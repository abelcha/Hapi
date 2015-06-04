module.exports = function(schema) {

    schema.statics.envoi = {
        unique: true,
        findBefore: true,
        fn: function(inter, req, res) {

            var getSuppFile = function(file_id) {
                if (file_id) {
                    return document.download(file_id);
                } else {
                    return Promise.resolve(null)
                }
            }


            var sendSMS = function(text, inter, login) {
                return db.model('sms').send({
                    to: '0633138868',
                    text: text,
                    login: login,
                    origin: inter.id,
                    link: inter.artisan.id,
                    type: 'OS'
                })

            }

            var save = function(inter, resolve, reject) {
                inter.status = "ENV";
                inter.date.envoi = new Date();
                inter.login.envoi = req.session.login;
                inter.save().then(resolve, reject);
            }

            return new Promise(function(resolve, reject) {
                if (inter.status !== "APR" && inter.status !== "ANN" && inter.status !== "LIT")
                    return reject("Annulez d'abords l'intervention avant de la réenvoyer")
                if (!req.body.sms)
                    return reject("Pas de text SMS");
                if (!inter.artisan.id)
                    return reject("Aucun artisan selectionné");
                if (envProd || envDev) {

                    getSuppFile(req.body.file).then(function(result) {
                        var suppFile = result || null;
                        db.model('intervention').getOSFile(inter).then(function(osFileBuffer) {
                            mail.sendOS(inter, osFileBuffer, suppFile).then(function(mail) {
                                sendSMS(req.body.sms, inter, req.session.login).then(function(data) {
                                    save(inter, resolve, reject)
                                }, reject)
                            }, reject)
                        }, reject)
                    }, reject)
                } else {
                    save(inter, resolve, reject)
                }
            });
        }
    }
}
