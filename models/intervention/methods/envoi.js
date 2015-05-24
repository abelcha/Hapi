module.exports = function(schema) {


    var getSuppFile = function(file_id) {
        if (file_id) {
            return document.download(file_id);
        } else {
            return Promise.resolve(null)
        }
    }


    var sendSMS = function(sms, id, number) {
        return db.model('sms').send({
            to: number,
            text: sms,
            link: id,
            type: 'OS'
        })

    }

    schema.statics.envoi = function(id, req, res) {
        return new Promise(function(resolve, reject) {
            db.model('intervention').findOne({
                id: id
            }).then(function(inter) {
                if (!inter)
                    return reject("Impossible de retrouver l'intervention");
                if (inter.status !== "APR" && inter.status !== "ANN" && inter.status !== "LIT")
                    return reject("Annulez d'abords l'intervention avant de la réenvoyer")
                if (!req.query.sms || req.query.sms.length < 20)
                    return reject("Pas de text SMS");
                if (!inter.artisan.id)
                    return reject("Aucun artisan selectionné");

                getSuppFile(req.query.file).then(function(suppFile) {
                    db.model('intervention').getOSFile(inter).then(function(osFileBuffer) {
                        mail.sendOS(inter, osFileBuffer, suppFile.data).then(function(mail) {
                            sendSMS(req.query.sms, id, '0633138868').then(function(data) {
                                inter.status = "ENV";
                                inter.date.envoi = new Date();
                                inter.save(function() {
                                    resolve("L'intervention " + inter.id + " à été envoyé");
                                }, reject);
                            }, reject)
                        }, reject)
                    }, reject)
                }, reject)
            }, reject);
        });
    }

}
