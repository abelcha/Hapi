var Paiement = requireLocal('config/Paiement');
var ms = require('milliseconds');
var async = require('async')
var _ = require("lodash")
var FiltersFactory = requireLocal('config/FiltersFactory');

module.exports = function(schema) {
    var i = 0
    schema.statics.diff = function(req, res) {
        return new Promise(function(resolve, reject) {
            db.model('intervention').find({
                'compta.paiement.effectue': true,
                'compta.paiement.ready':false,
            }).limit(req.query.limit || undefined).sort('-id').then(function(docs) {
                _.each(docs, function(e) {
                    if (e.compta.historique.length) {
                        var paiement = new Paiement(e);
                        var diff = (e.compta.historique[0].montant - paiement.montantTotal).round()
                        if (Math.abs(diff) > 0.1) {
                            console.log([e.id, e.compta.historique[0].montant, paiement.montantTotal.round(), diff].join(';').replace('.', ','))
                                ++i;
                        }
                    }
                })
                console.log('total =>', i)
                resolve([i])
            })
        });
    }
}