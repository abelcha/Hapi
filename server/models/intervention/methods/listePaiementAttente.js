module.exports = function(schema) {
    var _ = require('lodash')


    schema.statics.lpa = function(req, res) {
        return new Promise(function(resolve, reject) {
            db.model('intervention').find({
                    'compta.paiement.ready': true
                })
                .select('id compta.historique compta.paiement.mode compta.paiement.montant compta.paiement.base artisan')
                .exec(function(err, docs) {
                    docs = JSON.parse(JSON.stringify(docs))
                    var rtn = _.groupBy(docs, function(e) {
                            return e.artisan.id;
                        })
                        /* _.each(rtn, function(e) {
                             console.log(e, undefined, 2);
                         })*/
                    var sst = rtn['7'];
                    sst.montantTotal = 0
                    _.each(sst, function(e) {
                        if (e.compta.historique.length) {
                            console.log(e.compta.paiement.montant, e.compta.historique[e.compta.historique.length -1].montant)
                            e.diff = e.compta.paiement.montant - e.compta.historique[e.compta.historique.length -1].montant
                        } else {
                            e.diff = e.compta.paiement.montant
                        }

                        sst.montantTotal += e.diff
                    })
                    sst.montantTotal = sst.montantTotal.round()
                    console.log(sst)
                    resolve(rtn)
                })
        })
    }

}
