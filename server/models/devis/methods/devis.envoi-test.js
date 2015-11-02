module.exports = function(schema) {
    var _ = require('lodash')
    var moment = require('moment-timezone')
    var PDF = require('edsx-mail')

    schema.statics.envoiTest = {

        unique: true,
        findBefore: true,
        method: 'POST',
        fn: function(devis, req, res) {

            var getDevisPdfObj = function(doc) {
                console.log("devisSend")
                doc.client.email = "mzavot@gmail.com"
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
                        method: 'envoiTest',
                        data: devis,
                        req: _.pick(req, 'body', 'session')
                    }).then(function() {
                        devis.historique.push({
                            login: req.session.login,
                            date: new Date,
                        })
                        devis.status = 'ATT';
                        edison.event('DEVIS_ENVOI_TEST').login(req.session.login).id(devis.id).save();
                        resolve('ok')
                      //  devis.save().then(resolve, reject)
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
                            mailDest: 'abel.chalier@gmail.com',
                            mailBcc: envProd ? ('contact@edison-services.fr') : undefined,
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
                        Bcc: communication.mailBcc,
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
