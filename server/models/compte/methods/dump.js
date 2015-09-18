module.exports = function(schema) {
    schema.statics.dump = function(req, res) {
        return new Promise(function(resolve, reject) {
            var _ = require('lodash')
            var async = require('async')
            var prodList = requireLocal('config/default-comptes');
            db.model('compte').remove({}, function() {
                db.model('compte').create(prodList, function(err, resp) {
                    console.log(err, resp);
                    resolve('ok')
                });
            })
        })
    }
}
