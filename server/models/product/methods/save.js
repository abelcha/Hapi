module.exports = function(schema) {
    schema.statics.__save = function(req, res) {
        var _ = require('lodash')
        var async = require('async')
        var prodList = req.body;
        async.each(prodList, function(e, cb) {
            db.model('product').findOneAndUpdate({
                _id: e.ref
            }, _.omit(e, '__v'), {
                upsert: true,
                'new': true
            }, cb);
        }, function(err) {
            res.json(err)
        })
    }
}
