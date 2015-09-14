module.exports = function(schema) {
    var _ = require('lodash')
    var moment = require('moment-timezone')
    var PDF = require('edsx-mail')
    var getDevisPdfObj = function(doc) {
        doc.facture = doc.client;
        doc.facture.tel = doc.client.telephone.tel1;
        doc.datePlain = moment.tz('Europe/Paris').format('LL');
        doc.acquitte = false;
        doc.type = "devis"
        return PDF([{
            model: 'facture',
            options: doc
        }, {
            model: 'conditions',
            options: doc
        }], 500)
    }

    schema.statics.envoi = {

        unique: true,
        findBefore: true,
        method: 'POST',
        fn: function(devis, req, res) {
            return new Promise(function(resolve, reject) {
                if (!devis && !devis.produits || !devis.produits.length)
                    return reject('Le devis est vide')
/*                if (envDev) {
                    devis.historique.push({
                        login: req.session.login,
                        date: new Date,
                    })
                    devis.status = 'ATT';
                    return devis.save().then(resolve, reject)
                }*/
                if (!isWorker) {
                    return edison.worker.createJob({
                        name: 'db_id',
                        model: 'devis',
                        method: 'envoi',
                        data: devis,
                        req: _.pick(req, 'body', 'session')
                    }).then(function() {
                        devis.historique.push({
                            login: req.session.login,
                            date: new Date,
                        })
                        devis.status = 'ATT';
                        devis.save().then(resolve, reject)
                    }, reject)
                }



                try {
                    var pdf = getDevisPdfObj(devis);

                } catch (e) {
                    reject(e)
                }
                pdf.toBuffer(function(err, buffer) {
                    console.log('getBuffer');
                    try {
                        var communication = {
                            mailDest: envProd ? devis.client.email : (req.session.email || 'contact@edison-services.fr'),
                            mailBcc: envProd ? (req.session.email || 'contact@edison-services.fr') : undefined,
                            mailReply: (req.session.email || 'contact@edison-services.fr')
                        }
                    } catch (e) {
                        console.log(e.stack);
                    }
                    console.log(communication);
                    mail.send({
                        From: "intervention@edison-services.fr",
                        ReplyTo: communication.mailReply,
                        To: communication.mailDest,
                        Bcc: communication.mailBcc,
                        Subject: "DEVIS n°" + devis.id,
                        HtmlBody: req.body.text.replaceAll('\n', '<br>'),
                        Attachments: [{
                            Content: buffer.toString('base64'),
                            Name: "Devis n°" + devis.id + '.pdf',
                            ContentType: 'application/pdf'
                        }]
                    }).then(resolve, reject)
                })

            })
        }
    }
}
