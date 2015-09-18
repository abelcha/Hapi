module.exports = function(schema) {
    schema.statics.__save = function(req, res) {
        var _ = require('lodash')
        var async = require('async')
        var prodList = req.body;
        return new Promise(function(resolve, reject) {
            _.each(prodList, function(e) {
                if (!e.ref || e.ref.length != 6) {
                    return reject("La référence '" + e.ref + "' est invalide") && false;
                }
                if (!e.pu && e.pu !== 0) {
                    return reject("Veuillez rentrer un prix pour '" + e.ref + "'") && false;
                }
                if (!e.single)  {
                    e.desc = _.capitalize(e.title);
                }
            })
            db.model('product').remove({}, function() {
                db.model('product').create(prodList).then(resolve, reject)
            })
        })
    }
}
