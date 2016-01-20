    var _ = require('lodash')
    module.exports = function(schema) {

        var getHisto = function(inter, date) {
            console.log(_.map(inter.compta.paiement.historique), date)
            var index = _.findIndex(inter.compta.paiement.historique, 'dateFlush', date)
            inter = JSON.parse(JSON.stringify(inter));
            if (index === -1) {
                return inter;
            }
            inter.compta.paiement.base = inter.compta.paiement.historique[index].base
            inter.compta.paiement.montant = inter.compta.paiement.historique[index].montant
            inter.compta.paiement.pourcentage = inter.compta.paiement.historique[index].pourcentage
            inter.compta.paiement.tva = inter.compta.paiement.historique[index].tva
                //WTF
            inter.compta.paiement.numeroCheque = inter.compta.paiement.historique[index].numeroCheque;
            inter.compta.paiement.fourniture = inter.compta.paiement.historique[index].fourniture
            inter.compta.paiement.historique = inter.compta.paiement.historique.slice(0, index);
            return inter;
        }


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
                            'id': true,
                            'date.intervention': true,
                            'description': true,
                            'client': true,
                            'fourniture': true,
                            'sst': true,

                        })
                        .exec(function(err, docs) {
                            var x = _.groupBy(docs, 'compta.paiement.historique.dateFlush')
                            x = _(x).map(function(e, k) {
                                return {
                                    date: k,
                                    timestamp: (new Date(k)).getTime(),
                                    list: e.map(function(x) {
                                        //     console.log(x.compta.paiement)
                                        //   console.log(_.extend(x.compta.paiement, x.compta.paiement.historique))
                                        x.compta.paiement.montant = x.compta.paiement.historique.montant
                                        x.compta.paiement.base = x.compta.paiement.historique.base
                                        x.compta.paiement.final = x.compta.paiement.historique.final
                                        x.compta.paiement.payed = x.compta.paiement.historique.payed
                                        x.compta.paiement.total = x.compta.paiement.historique.total
                                        x.compta.paiement._mode = x.compta.paiement.historique._mode
                                        x.compta.paiement.type = x.compta.paiement.historique.type
                                        return x;
                                        //return getHisto(x, new Date(k))
                                    }),
                                    total: _.round(_.sum(e, 'compta.paiement.historique.final'), 2)
                                }
                            }).value()
                            resolve(x)
                        })

                })
            }
        }
    }
