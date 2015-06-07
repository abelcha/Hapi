module.exports = function(schema) {

    schema.statics.send = function(options) {
        return new Promise(function(resolve, reject) {
            sms.send(options).then(function(resp) {
                db.model('sms')(resp).save().then(resolve, reject);
            }, reject);
        })
    }

    schema.statics.save = function(req, res) {
        var options = req.body
        options.login = req.session.login;
        return this.send(options);
    }

}
