module.exports = function(schema) {
    schema.statics.send = function(req, res) {
        if (req.text) {
            var options = req;
        } else {
            var options = req.query
            options.login = req.session.login;
        }
        return new Promise(function(resolve, reject) {
            sms.send(options).then(function(params) {
                db.model('sms')(params).save().then(resolve, reject);
            }, reject);
        })
    }
}
