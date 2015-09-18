module.exports = function(schema) {
    schema.statics.__save = function(req, res) {
        var _ = require('lodash')
        var async = require('async')
        var compteList = req.body;
        return new Promise(function(resolve, reject) {
            _.each(compteList, function(e) {
                if (!e.email ||  !e.nom || !e.address.r || !e.address.v ||  !e.address.cp || !e.address.n) {
                    return reject('Les coordonées de facturations de ' + e.nom + ' sont incompletes')
                }
                e.nom = e.nom.toUpperCase();
                e.ref = _.snakeCase(e.nom).slice(0, 10);
            })
            db.model('compte').remove({}, function() {
                db.model('compte').create(compteList).then(resolve, reject)
            })
        })
    }
}
