module.exports = function(schema) {
    var _ = require('lodash')


    schema.statics.getFlushList = function(query) {
        return new Promise(function(resolve, reject) {

            db.model('intervention').find(query)
                .select('id compta.paiement artisan compta.paiement.mode')
                .exec(function(err, docs) {
                    docs = JSON.parse(JSON.stringify(docs))
                    var rtn = _(docs).groupBy('artisan.id').values().map(function(e) {
                        return {
                            list: e
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
