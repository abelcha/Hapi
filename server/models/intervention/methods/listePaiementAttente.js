module.exports = function(schema) {
    var _ = require('lodash')


    schema.statics.getFlushList = function(query) {
        return new Promise(function(resolve, reject) {
            db.model('intervention').find(query)
                .populate('sst')
                .select('id client description compta.paiement date.intervention sst artisan fourniture')
                .exec(function(err, docs) {
                    docs = _.clone(docs)
                    var rtn = _(docs).groupBy('sst.id').values().map(function(e) {
                        return {
                            address: e[0].sst.address,
                            nomSociete: e[0].sst.nomSociete,
                            id: e[0].sst.id,
                            representant: e[0].sst.representant,
                            list: _.map(e, function(z) {
                                z.sst = undefined
                                return z;
                            })
                        }
                    }).value()
                    resolve(rtn)
                })
        });
    }

    var lol = function(inter, date) {

        var index = _.findIndex(inter.compta.paiement.historique, 'dateFlush', date)
        inter.compta.paiement.base = inter.compta.paiement.historique[index].base
        inter.compta.paiement.montant = inter.compta.paiement.historique[index].montant
        inter.compta.paiement.pourcentage = inter.compta.paiement.historique[index].pourcentage
        inter.compta.paiement.tva = inter.compta.paiement.historique[index].tva
        inter.compta.paiement.fourniture = inter.compta.paiement.historique[index].fourniture
        inter.compta.paiement.historique = inter.compta.paiement.historique.slice(index + 1);
        inter.sst = undefined;
        return inter;
    }

    var gtf = function(ts) {
        return new Promise(function(resolve, reject) {

            var date = new Date(parseInt(ts));
            console.log(date)
            db.model('intervention')
                .find({
                    'compta.paiement.historique': {
                        $elemMatch: {
                            dateFlush: date
                        }
                    }
                })
                .populate('sst')
                .select('id client description compta.paiement date.intervention sst artisan fourniture')
                .exec(function(err, docs) {
                    docs = _.clone(docs)
                    var rtn = _(docs.slice(0, 1)).groupBy('sst.id').values().map(function(e) {
                        return {
                            address: e[0].sst.address,
                            nomSociete: e[0].sst.nomSociete,
                            id: e[0].sst.id,
                            representant: e[0].sst.representant,
                            list: _.map(e, _.partial(lol, _, date))
                        }
                    }).value()
                    resolve(rtn)
                })
        })
    }

    schema.statics.lpa = function(req, res) {
        if (req.query.d) {
            return gtf(req.query.d)
        }
        return this.getFlushList({
            'compta.paiement.ready': true,
            'compta.paiement.dette': false
        })

    }

}
