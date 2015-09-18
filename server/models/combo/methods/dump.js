module.exports = function(schema) {
    schema.statics.dump = function(req, res) {
        return new Promise(function(resolve, reject) {
            var _ = require('lodash')
            var async = require('async')
            var comboList = requireLocal('config/combo-produits');
            _.each(comboList, function(combo) {
                _.each(combo.produits, function(e) {
                    if (!e.ref) {
                        e.ref = _.deburr(e.title).toUpperCase().slice(0, 3) + "0" + String(_.random(10, 100))
                    }
                })
            })
            db.model('combo').remove({}, function() {
                db.model('combo').create(comboList, function(err, resp) {
                    resolve('ok')
                });
            })
        })
    }
}
