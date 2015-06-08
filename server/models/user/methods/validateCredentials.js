module.exports = function(schema) {
    var _ = require("lodash");
    var users = requireLocal('config/_users');

    schema.statics.validateCredentials = function(req, res) {
        return new Promise(function(resolve, reject) {
            var user = _.find(users, function(e) {
                return req.body.username === e.login
            })
            if (typeof user === 'undefined')
                return reject();
            return resolve(user)
        });

    };
}
