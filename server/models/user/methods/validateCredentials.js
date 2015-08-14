module.exports = function(schema) {
    var _ = require("lodash");
    var users = requireLocal('config/_users');
    var keys = requireLocal('config/_keys');


    schema.statics.validateCredentials = function(req, res) {
        return new Promise(function(resolve, reject) {
            var AES = require("crypto-js/aes");
            var password = req.body.password;
            var usr = req.body.username.toLowerCase();
            db.model('user').findOne({
                _id: usr,
                activated: true
            }).then(function(doc) {
                console.log(doc)
                var psw = AES.encrypt(password, keys.salt);
                console.log(psw, doc.password, psw === doc.password)
                if (!doc) {
                    return reject();
                }
                if (!doc.passInit) {
                    doc.passInit = true;
                    doc.password = psw
                    doc.save().then(resolve, reject)
                } else if (doc.password === String(psw)) {
                    return resolve(doc);
                } else {
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
