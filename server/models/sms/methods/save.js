module.exports = function(schema) {

    schema.statics.send = function(options) {
        return new Promise(function(resolve, reject) {
            sms.send(options).then(function(resp) {
            }, reject);
        })
    }

    schema.statics.__save = function(req, res) {
        var options = req.body
        options.login = req.session.login;
        console.log(options)
        return this.send(options);
    }

}
