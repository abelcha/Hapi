module.exports = function(schema) {
    schema.statics.__save = function(req, res) {
        var _ = require('lodash')
        var async = require('async')
        var userList = req.body;
        return new Promise(function(resolve, reject) {

            _.each(userList, function(e) {
                if (!e.login) {
                    return reject("Le login est manquant") && false;
                }
                e._id = e.login;
            })
            db.model('user').remove({}, function() {
                db.model('user').create(userList).then(resolve, reject)
            })

            /*        async.each(userList, function(e, cb) {
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
                    })*/
        })
    }
}
