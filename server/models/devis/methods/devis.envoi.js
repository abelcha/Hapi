module.exports = function(schema) {
    var _ = require('lodash')
    var moment = require('moment-timezone')
    var PDF = require('edsx-mail')

    schema.statics.envoi = {

        unique: true,
        findBefore: true,
        method: 'POST',
        fn: function(devis, req, res) {

            var getDevisPdfObj = function(doc) {
                console.log("devisSend")
                doc.facture = doc.client;
                doc.facture.tel = doc.client.telephone.tel1;
                doc.datePlain = moment.tz(doc.date.ajout, 'Europe/Paris').format('LL');
                doc.user = req.session;
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


            return new Promise(function(resolve, reject) {

                if (envDev) {
                    return resolve('ok')
                }

                if (!devis && !devis.produits || !devis.produits.length)
                    return reject('Le devis est vide')
                if (!isWorker) {
                    return edison.worker.createJob({
                        name: 'db_id',
                        model: 'devis',
                        method: 'envoi',
                        data: devis,
                        req: _.pick(req, 'body', 'session'),
                    }).then(function() {
                        devis.historique.push({
                            login: req.session.login,
                            date: new Date,
                            auto: req.body.auto
                        })
                        devis.status = 'ATT';
                        edison.event('DEVIS_ENVOI').login(req.session.login).id(devis.id).save();
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
                            mailDest: envProd ? devis.client.email : ('contact@edison-services.fr'),
                            mailReply: (req.session.email ||  'contact@edison-services.fr')
                        }
                    } catch (e) {
                        console.log(e.stack);
                    }
                    if (devis.historique.length == 0) {
                        var txt = "DEVIS n°" + devis.id;
                    } else if (devis.historique.length === 1) {
                        var txt = "Suite au devis n°" + devis.id;
                    } else if (devis.historique.length >= 2) {
                        var txt = "Relance concernant le devis n°" + devis.id;
                    }

                    console.log(communication);
                    mail.send({
                        From: "contact@edison-services.fr",
                        ReplyTo: communication.mailReply,
                        To: communication.mailDest,
                        Subject: txt,
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
