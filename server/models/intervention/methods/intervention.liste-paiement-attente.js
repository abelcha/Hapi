module.exports = function(schema) {
    var _ = require('lodash')


    schema.statics.getFlushList = function(query) {
        return new Promise(function(resolve, reject) {
            db.model('intervention').find(query)
                .populate('sst')
                .select('id client description compta.paiement date.intervention sst artisan fourniture')
                .exec(function(err, docs) {
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
        inter = JSON.parse(JSON.stringify(inter));
        inter.compta.paiement.base = inter.compta.paiement.historique[index].base
        inter.compta.paiement.montant = inter.compta.paiement.historique[index].montant
        inter.compta.paiement.pourcentage = inter.compta.paiement.historique[index].pourcentage
        inter.compta.paiement.tva = inter.compta.paiement.historique[index].tva
            //WTF
        inter.compta.paiement.numeroCheque = inter.compta.paiement.historique[index].numeroCheque;
        inter.compta.paiement.fourniture = inter.compta.paiement.historique[index].fourniture
        inter.compta.paiement.historique = inter.compta.paiement.historique.slice(0, index);
        inter.sst = undefined;
        //   console.log(inter.compta.paiement.numeroCheque)
        return inter;
    }

    var gtf = function(ts) {
        return new Promise(function(resolve, reject) {

            var date = new Date(parseInt(ts));
            db.model('intervention')
                .find({
                  //  id:30226,
                    'compta.paiement.historique': {
                        $elemMatch: {
                            dateFlush: date
                        }
                    },
                })
                .populate('sst')
                .select('id client description compta.paiement date.intervention sst artisan fourniture')
                .exec(function(err, docs) {
                //    console.log(docs[0].compta.paiement)
                    var rtn = _(docs).filter('sst').groupBy('sst.id').values().map(function(e) {
                            return {
                                address: e[0].sst.address,
                                nomSociete: e[0].sst.nomSociete,
                                id: e[0].sst.id,
                                representant: e[0].sst.representant,
                                list: _.map(e, _.partial(lol, _, date))
                            }
                        }).value()
                  //  console.log('=================')
                    //console.log(JSON.stringify(rtn, null, 2))

                        //  console.log(rtn);
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
