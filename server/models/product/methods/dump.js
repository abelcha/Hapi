module.exports = function(schema) {
    schema.statics.dump = function(req, res) {
        return new Promise(function(resolve, reject) {
            var _ = require('lodash')
            var async = require('async')
            var prodList = requireLocal('config/default-produits');
            _.each(prodList, function(e) {
                e._id = e.ref;
            })
            db.model('product').remove({}, function() {
                    db.model('product').create(prodList, function(err, resp)  {
                        console.log(err, resp);
                        resolve('ok')
                    });
                })
        })
    }
}
