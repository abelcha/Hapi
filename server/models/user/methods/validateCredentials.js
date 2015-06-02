module.exports = function(schema) {
var _ = require("lodash");
    schema.statics.validateCredentials = function(req, res) {
        return new Promise(function(resolve, reject) {
            var user = _.find(edison.config.users, function(e) {
                return req.body.username === e.login
            })
            if (typeof user === 'undefined')
                return reject();
            return resolve(user)
        });

    };
}
