module.exports = function(schema) {
    schema.statics.__save = function(req, res) {
        var _ = require('lodash')
        var async = require('async')
        var prodList = req.body;
        async.each(prodList, function(e, cb) {
            if (e.login) {
                e.pseudo = _.startCase(e.pseudo);
                db.model('user').findOneAndUpdate({
                    login: e.login
                }, _.omit(e, '__v'), {
                    upsert: true,
                    'new': true
                }, cb);
            }
        }, function(err) {
            res.json(err)
        })
    }
}
