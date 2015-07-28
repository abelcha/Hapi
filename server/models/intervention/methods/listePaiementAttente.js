module.exports = function(schema) {
    var _ = require('lodash')

    var getPreviousMontant = function(inter) {
        var montantTotal = 0
        if (!inter.compta.historique.length)
            return 0
        _.each(inter.compta.historique, function(e) {
            montantTotal += e.montant
        })
        return montantTotal;
    }

    schema.statics.lpa = function(req, res) {
        return new Promise(function(resolve, reject) {
            db.model('intervention').find({
                    'compta.paiement.ready': true,
                    'compta.paiement.dette': false
                })
                .select('id compta.historique compta.paiement.mode compta.paiement.montant compta.paiement.base artisan compta.paiement.mode')
                .exec(function(err, docs) {
                    docs = JSON.parse(JSON.stringify(docs))
                    var rtn = _(docs).groupBy('artisan.id').values().map(function(e) {
                        return {
                            list: e
                        }
                    }).value()
                    _.each(rtn, function(sst) {
                        sst.nomSociete = sst.list[0].artisan.nomSociete
                        sst.id = sst.list[0].artisan.id
                        var total = {
                            base: 0,
                            montant: 0,
                            balance: 0,
                            legacy: 0
                        };
                        _.each(sst.list, function(e) {
                            e.montant = {
                                base: e.compta.paiement.base,
                                total: e.compta.paiement.montant,
                                legacy: getPreviousMontant(e),
                                balance: _.round(e.compta.paiement.montant - getPreviousMontant(e))
                            }
                            e.mode = e.compta.paiement.mode
                            console.log(e)
                            e.type = e.montant.balance !== 0 ? (e.montant.balance > 0 ? 'COMPLEMENT' : 'AVOIR') : 'AUTO-FACT'
                            total.base = _.round(total.base + e.montant.base);
                            total.montant = _.round(total.montant + e.montant.total);
                            total.legacy = _.round(total.legacy + e.montant.legacy);
                            total.balance = _.round(total.balance + e.montant.balance);
                            delete e.artisan
                            delete e.compta
                        })
                        sst.total = total;
                    })
                    resolve(rtn)
                })
        })
    }

}
