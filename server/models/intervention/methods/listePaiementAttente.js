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

    schema.statics.lpa = function(req, res) {
        return this.getFlushList({
            'compta.paiement.ready': true,
            'compta.paiement.dette': false
        })

    }

}
