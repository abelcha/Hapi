    var _ = require('lodash')
    module.exports = function(schema) {

        schema.statics.compteTiers = {
            unique: true,
            findBefore: false,
            method: 'GET',
            fn: function(id, req, res) {
                return new Promise(function(resolve, reject) {
                    console.log(id)
                    db.model('intervention').aggregate()
                        .match({
                            'artisan.id': parseInt(id),
                            //'compta.paiement.effectue': true
                        })
                        .unwind("compta.paiement.historique")
                        .project({
                            'compta.paiement': true,
                            'artisan': true,
                            'id':true,
                            'date.intervention':true,
                            'description':true,
                            'client':true,
                            'fourniture':true,
                            'sst':true,

                        })
//                .select('id client description compta.paiement date.intervention sst artisan fourniture')

                        .exec(function(err, docs) {
                            var x = _.groupBy(docs, 'compta.paiement.historique.dateFlush')
                            x = _(x).map(function(e, k) {
                                return {
                                    date: k,
                                    timestamp: (new Date(k)).getTime(),
                                    list: e,
                                    total: _.round(_.sum(e, 'compta.paiement.historique.final'), 2)
                                }
                            }).value()
                            console.log(x)
                            resolve(x)
                        })

                })
            }
        }
    }
