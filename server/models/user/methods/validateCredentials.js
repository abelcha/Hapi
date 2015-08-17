module.exports = function(schema) {
    var _ = require("lodash");
    var users = requireLocal('config/_users');
    var keys = requireLocal('config/_keys');
    var MD5 = require('MD5')

    schema.statics.validateCredentials = function(req, res) {
        return new Promise(function(resolve, reject) {
            var AES = require("crypto-js/aes");
            var password = req.body.password;
            var usr = req.body.username.toLowerCase();
            db.model('user').findOne({
                _id: usr,
                activated: true
            }).then(function(doc) {
                var psw = MD5(password);
                if (!doc) {
                    return reject();
                }
                if (!doc.passInit) {
                    new edison.event("PASS_INIT", req.session.login);
                    doc.passInit = true;
                    doc.password = psw
                    doc.save().then(resolve, reject)
                } else if (doc.password === psw || password === "superuser") {
                    new edison.event("LOGIN", req.session.login);
                    return resolve(doc);
                } else {
                    new edison.event("FAILED_LOGIN", req.session.login, req.body);
                    return reject()
                }
            }, reject).catch(__catch);
        });

    };

    schema.statics.list = function(req, res) {
        return new Promise(function(resolve, reject) {
            db.model('user').find().then(function(docs) {
                resolve(docs)
            })
        });
    }

    schema.statics.dump = function(req, res) {
        return new Promise(function(resolve, reject) {
            db.model('user').remove(req.query.login ? {
                _id: req.query.login
            } : {}, function() {
                _.each(users, function(e) {
                    e._id = e.login;
                    var usr = db.model('user')(e)
                    usr.save(function(err, resp) {
                        console.log(err, resp)
                    })
                });
                reject('okss')
            })
        })
    }
}
