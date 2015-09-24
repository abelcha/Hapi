module.exports = function(schema) {
    var moment = require('moment')
    var async = require('async')
    var _ = require('lodash')
    schema.statics.commissions = function(req, res) {
        return new Promise(function(resolve, reject) {
            var getMonthRange = function(m, y) {
                var date = new Date(y, m);
                return {
                    $gte: new Date(date.getFullYear(), date.getMonth(), 1, -1),
                    $lt: new Date(date.getFullYear(), date.getMonth() + 1, 0)
                }
            }
            var dateRange = getMonthRange(req.query.m - 1, req.query.y)
            db.model('intervention').find({
                    'date.ajout': dateRange,
                    'login.ajout': req.query.l,
                    'compta.paiement.effectue': true
                }).select('id categorie compta.reglement compta.paiement.effectue')
                .exec(function(err, resp) {
                    resolve(resp);
                })
        })
    }
}
