module.exports = function(schema) {
    schema.statics.__save = function(req, res) {
        var _ = require('lodash')
        var async = require('async')
        var comboList = req.body;
        return new Promise(function(resolve, reject) {
            //console.log(comboList)
            _.each(comboList, function(combo) {
                if (!combo.title) {
                    return reject('Veuillez rentrer un titre') && false;
                }
                if (!combo.text) {
                    return reject('Veuillez rentrer un text pour le mail') && false;
                }
                if (!combo.ref) {
                    combo.ref = _.snakeCase(combo.title).toUpperCase().slice(0, 10);
                }
                _.each(combo.produits, function(e) {
                    if (!e.ref) {
                        e.ref = _.deburr(e.title).toUpperCase().slice(0, 3) + "0" + String(_.random(10, 100))
                        return reject("La référence '" + e.ref + "' est invalide") && false;
                    }
                    if (!e.pu && e.pu !== 0) {
                        return reject("Veuillez rentrer un prix pour '" + e.ref + "'") && false;
                    }
                })
            })
            db.model('combo').remove({}, function() {
                db.model('combo').create(comboList).then(resolve, reject)
            })
        })
    }
}
