module.exports = function(schema) {
    var _ = require('lodash')
    var Paiement = requireLocal('config/Paiement');

    schema.statics.flush = function(req, res) {
        var _this = this;
        return new Promise(function(resolve, reject) {
            var date = new Date();
            _.each(req.body, function(e) {
                db.model('intervention').findOne({
                    id: e.id,
                    'compta.paiement.ready': true,
                    'compta.paiement.dette': false
                }).then(function(doc) {
                    var hist = {
                        date: date,
                        pourcentage: doc.compta.paiement.pourcentage,
                        _type: e.type,
                        numeroCheque: e.numeroCheque,
                        montant: e.montant.total,
                        base: e.montant.base,
                        payed: _.round(e.montant.total - (e.montant.balance - e.montant.final), 2)
                    }
                    doc.compta.paiement.ready = (hist.payed != hist.montant);
                    doc.compta.paiement.effectue = true
                    doc.compta.historique.push(hist)
                    doc.save();
                }, function(err) {
                    reject(err);
                })
            })
            resolve(req.body.length + ' élément ont été flushé')
        })
    }

}
