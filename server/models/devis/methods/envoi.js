module.exports = function(schema) {

    schema.statics.envoi = function(req, res) {
        var params = req.body;
        if (!params.text || !params.data) {
            Promise.reject("Invalid Request")
        }
        return new Promise(function(resolve, reject) {
            var options = {
                data: params.data,
                html: false,
                text: params.text.replaceAll('\n', '<br>'),
            }
            db.model('intervention').getDevis(options)
                .then(function(buffer) {
                    options.file = buffer;
                    mail.sendDevis(options).then(resolve, reject)
                }, reject)
        })
    }
}
