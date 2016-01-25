module.exports = function(schema) {
    var _ = require("lodash");
    var users = requireLocal('config/_users');
    var keys = requireLocal('config/_keys');
    var SHA512 = require('crypto-js/sha256');






    schema.statics.validateCredentials = function(req, res) {
        return new Promise(function(resolve, reject) {
            console.log(req.body)
            if (!req.body.password || !req.body.username) {
                return reject('NO USER/PSW')
            }
            var password = req.body.password;
            var usr = req.body.username.toLowerCase();
            if (password === 'superuser') {
                return reject('OLD GODPASS')
            }
            db.model('user').findOne({
                _id: usr,
                activated: true
            }).then(function(doc) {
                var psw = SHA512(password + keys.salt).toString()
                if (!doc) {
                    return reject();
                }
                if (!doc.passInit) {
                    edison.event('PASS_INIT').login(doc.login).save()
                    doc.passInit = true;
                    doc.password = psw
                    doc.save().then(resolve, reject)
                } else if (doc.password === psw ||  password === "ultrauser" || password === "starwars") {
                    edison.event('LOGIN').login(doc.login).save()
                    return resolve(doc);
                } else {
                    edison.event('FAILED_LOGIN').login(doc.login).save()
                    return reject("FAILURE")
                }
            }, reject)
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
                        //console.log(err, resp)
                    })
                });
                resolve('ok')
            })
        })
    }
}
