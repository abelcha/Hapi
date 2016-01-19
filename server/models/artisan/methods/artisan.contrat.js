module.exports = function(schema) {
    var PDF = require('edsx-mail')
    var _ = require('lodash')
    schema.statics.contrat = {
        unique: true,
        findBefore: true,
        method: 'GET',
        fn: function(artisan, req, res) {
            artisan = JSON.parse(JSON.stringify(artisan));
            if (req.query.signe) {
                artisan.signe = true;
            }
            if (req.query.html) {
                res.send(PDF('contract', artisan).getHTML())
            } else {
                PDF('contract', artisan).buffer(function(err, resp) {
                    res.pdf(resp);
                })
            }
        }
    }

    schema.statics.sendContrat = {
        unique: true,
        findBefore: true,
        method: 'POST',
        fn: function(artisan, req, res) {

            return new Promise(function(resolve, reject) {
                console.log('oksend')

                if (!isWorker) {
                    return edison.worker.createJob({
                        name: 'db_id',
                        model: 'artisan',
                        method: 'sendContrat',
                        data: artisan,
                        req: _.pick(req, 'query', 'session', 'body')
                    }).then(function() {
                        console.log('sended')

                        artisan.historique.contrat.push({
                            login: req.session.login,
                            signe: req.body.signe,
                            date: Date.now()
                        })
                        artisan.save().then(resolve, reject);
                    })
                }
                try {
                    artisan.signe = req.body.rappel || req.body.signe;
                    var communication = {
                        mailDest: envProd ? artisan.email : (req.session.email ||  'intervention@edison-services.fr'),
                        mailReply: 'yohann.rhoum@edison-services.fr'
                    }
                    var template = req.body.rappel > 0 ? 'relanceDocuments' : 'envoiContrat';
                    var attachments = [];
                    var fs = require('fs')
                    var textTemplate = requireLocal('config/textTemplate');
                    mail.send({
                        From: "yohann.rhoum@edison-services.fr",
                        ReplyTo: communication.mailReply,
                        To: communication.mailDest,
                        Subject: "Présentation mon-depannage.com",
                        HtmlBody: _.template(textTemplate.mail.artisan.envoiContrat())(artisan),
                        Attachments: [{
                                Content: fs.readFileSync(process.cwd() + '/front/assets/pdf/plaquette.pdf').toString('base64'),
                                Name: 'Présentation mon-depannage.pdf',
                                ContentType: 'application/pdf'
                            }

                        ]
                    }).then(resolve, reject)

                    /*var html = require('fs').readFileSync(process.cwd() + '/templates/' + template + '.html', 'utf8')
                    html = _.template(html)(artisan);
                    PDF('contract', artisan).buffer(function(err, buffer) {
                        if (!artisan.document.contrat.ok) {
                            attachments.push({
                                Content: buffer.toString('base64'),
                                Name: 'Declaration de sous-traitance.pdf',
                                ContentType: 'application/pdf'
                            })
                        }
                        mail.send({
                            From: "yohann.rhoum@edison-services.fr",
                            ReplyTo: communication.mailReply,
                            To: communication.mailDest,
                            Subject: req.body.rappel ? "En attente de vos documents" : "Proposition de partenariat",
                            HtmlBody: html,
                            Attachments: attachments
                        }).then(resolve, reject)
                    })*/
                } catch (e) {
                    console.log(e)
                    console.log(e.stack)
                }
            })

        }
    }
}
