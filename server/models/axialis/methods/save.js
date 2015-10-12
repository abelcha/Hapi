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
                db.model('user').create(userList).then(function(resp) {
                    edison.users.data = resp;
                    resolve(resp)
                }, reject)
            })
        })
    }
}
