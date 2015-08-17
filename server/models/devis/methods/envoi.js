module.exports = function(schema) {
    var _ = require('lodash')
    var moment = require('moment')
    var PDF = require('edsx-mail')
    var getDevisPdfObj = function(doc) {

        doc.datePlain = moment().format('LL');
        doc.acquitte = false;
        doc.type = "devis"
        return PDF([{
            model: 'facture',
            options: doc
        }, {
            model: 'conditions',
            options: doc
        }])
    }

    schema.statics.envoi = {

        unique: true,
        findBefore: true,
        method: 'POST',
        fn: function(devis, req, res) {

            return new Promise(function(resolve, reject) {
                if (!isWorker) {
                    return edison.worker.createJob({
                        name: 'db_id',
                        model: 'devis',
                        method: 'envoi',
                        data: devis,
                        req: _.pick(req, 'body', 'session')
                    }).then(function() {
                        devis.save().then(resolve, reject)
                    }, reject)
                }

                if (!devis.produits || !devis.produits.length)
                    return reject('Le devis est vide')

                try {
                    var pdf = getDevisPdfObj(devis);

                } catch (e) {
                    reject(e)
                }
                pdf.toBuffer(function(err, buffer) {
                    mail.send({
                        From: "intervention@edison-services.fr",
                        To: req.session.email || "abel@chalier.me",
                        Subject: "Devis n°" + devis.id,
                        HtmlBody: req.body.text.replaceAll('\n', '<br>'),
                        Attachments: [{
                            Content: buffer.toString('base64'),
                            Name: 'Devis.pdf',
                            ContentType: 'application/pdf'
                        }]
                    }).then(function(resp) {
                        db.model('devis').findOne({
                            id: devis.id
                        }).then(function(doc) {
                            doc.historique.push({
                                login: req.session.login,
                                date: new Date,
                                id_devis: doc.id
                            })
                            doc.status = 'ATT';
                            console.log('oksave')
                            doc.save(function(err, resp){
                                console.log(err, resp)
                                resolve(resp)
                            })
                        }, reject)
                    }, reject).catch(__catch)
                })
            })

        }
    }
}
