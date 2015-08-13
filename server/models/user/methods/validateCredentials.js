module.exports = function(schema) {
    var _ = require("lodash");
    var users = requireLocal('config/_users');

    schema.statics.validateCredentials = function(req, res) {
        return new Promise(function(resolve, reject) {
            var usr = req.body.username.toLowerCase();
            var user = _.find(users, function(e) {
                if (req.body.username === e.login) {
                    resolve(e)
                }
            })
            if (user === void(0))
                return reject();
            return resolve(user)
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
                 db.model('user').remove({}, function() {
            _.each(users, function(e) {
                var usr = db.model('user')(e)
                usr.save(function(err, resp) {
                    console.log(err, resp)
                })
                    // .save(function(err) {
                    //     if (err) {
                    //         res.status(500).send('fail');
                    //     } else {
                    //         console.log(e.login, 'ok');
                    //     }
                    // })
            });
            reject('okss')
                   })
        })
    }
}
