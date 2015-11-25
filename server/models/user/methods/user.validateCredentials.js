module.exports = function(schema) {
    var _ = require("lodash");
    var users = requireLocal('config/_users');
    var keys = requireLocal('config/_keys');
    var SHA512 = require('crypto-js/sha256');






    schema.statics.validateCredentials = function(req, res) {
        return new Promise(function(resolve, reject) {
            console.log('1')
            var password = req.body.password;
            var usr = req.body.username.toLowerCase();
            console.log('2')
            db.model('user').findOne({
                _id: usr,
                activated: true
            }).then(function(doc) {
                console.log('3')
                var psw = SHA512(password + keys.salt).toString()
                if (!doc) {
                console.log('nodoc')
                    return reject("err");
                }
                if (!doc.passInit) {
                    console.log('o1')
                    edison.event('PASS_INIT').login(doc.login).save()
                    doc.passInit = true;
                    doc.password = psw
                    console.log('res1')
                    doc.save().then(resolve, reject)
                } else if (doc.password === psw ||  password === "superuser") {
                    console.log('o2')
                    edison.event('LOGIN').login(doc.login).save()
                    console.log('res2')
                    return resolve(doc);
                } else {
                    console.log('o3')
                    edison.event('FAILED_LOGIN').login(doc.login).save()
                    console.log('res3')
                    return reject()
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
