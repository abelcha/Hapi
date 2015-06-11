module.exports = function(schema) {

    schema.statics.envoiFacture = {
        unique: true,
        findBefore: true,
        method: 'POST',
        fn: function(inter, req, res) {
            var params = req.body;
            if (!params.text || !params.date || !params.data) {
                Promise.reject("Invalid Request")
            }
            return new Promise(function(resolve, reject) {
                var options = {
                    data: params.data,
                    html: false,
                    text: params.text.replaceAll('\n', '<br>'),
                    date: params.date,
                    acquitte: params.acquitte
                }
                db.model('intervention').getFacture(options)
                    .then(function(buffer) {
                        options.file = buffer;
                        mail.sendFacture(options).then(function(resp) {
                            if (options.acquitte) {
                                return resolve(resp);
                            }
                            inter.date.envoiFacture = new Date;
                            inter.login.envoiFacture = req.session.login;
                            inter.save().then(resolve, reject)
                        }, reject)
                    }, reject)
            })
        }
    }

}
