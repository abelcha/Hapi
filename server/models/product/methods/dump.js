module.exports = function(schema) {
    schema.statics.dump = function(req, res) {
        return new Promise(function(resolve, reject) {
            var _ = require('lodash')
            var async = require('async')
            var prodList = requireLocal('config/default-produits');
            _.each(prodList, function(e) {
                if (!e.ref) {
                    e.ref = _.deburr(e.title).toUpperCase().slice(0, 3) + "0" + String(_.random(10, 100))
                }
                if (!e.single)  {
                    e.desc = _.capitalize(e.title);
                }
            })
            db.model('product').remove({}, function() {
                db.model('product').create(prodList, function(err, resp) {
                    console.log(err, resp);
                    resolve('ok')
                });
            })
        })
    }
}
