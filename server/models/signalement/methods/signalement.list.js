module.exports = function(schema) {

    schema.statics.list = function(req, res) {
        return new Promise(function(resolve, reject) {
            var _ = require('lodash')
            _.each(req.query, function(e, k) {
                if (k == 'ok') {
                    req.query.ok = !(e == 'false')
                }
            })
            db.model('signalement').find(req.query ||  {}).then(resolve, reject);
        })
    }
}
