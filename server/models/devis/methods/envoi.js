module.exports = function(schema) {

    schema.statics.envoi = function(req, res) {
        var params = req.body;
        if (!params.text || !params.data) {
            return Promise.reject("Invalid Request")
        }
        if (!params.data.produits || !params.data.produits.length)
            return Promise.reject('Le devis est vide')
        return new Promise(function(resolve, reject) {
            var options = {
                data: params.data,
                html: false,
                text: params.text.replaceAll('\n', '<br>'),
            }

            db.model('intervention').getDevis(options)
                .then(function(buffer) {
                    options.file = buffer;
                    mail.sendDevis(options).then(function() {
                        if (params.data.isDevis) {
                            db.model('devis').findOne({
                                _id: params.data.id
                            }).then(function(devis) {
                                devis.historique.push({
                                    login: req.session.login,
                                    date: new Date,
                                    id_devis: params.data.id
                                })
                                devis.status = 'ATT';
                                devis.save(resolve, reject);
                            })
                        } else {
                            resolve("OK")
                        }
                    }, reject)
                }, reject)
        })
    }
}
