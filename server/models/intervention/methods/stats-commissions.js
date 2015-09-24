module.exports = function(schema) {
    var moment = require('moment')
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
            db.model('intervention').fing({
                    'date.ajout': dateRange,
                    'compta.reglement.recu': true,
                    'login.ajout':'benjamin_b'
                })
               .exec(function(err, resp) {
                    console.log(resp);
                    /*if (err) {
                        reject(err);
                    }
                    resp = _.map(resp, function(e) {
                        return {
                            prix: e.prixFinal ||  e.prixAnnonce ||  0,
                            day: e.day,
                            recu: e.recu ? 'Encaissé' : 'En Attente'
                        }
                    })
                    _.times(31, function(i) {
                        resp.push({
                            day: i + 1,
                            prix: 0,
                            recu:'En Attente'
                        })
                    })*/
                    resolve(resp);
                })
        })
    }
}
