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
            params = JSON.parse(JSON.stringify(artisan));
            if (req.body.signe === 'true') {
                params.signe = true;
            }
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
                            signe: params.signe,
                            date: Date.now()
                        })
                        artisan.save().then(resolve, reject);
                    })
                }

                var communication = {
                    mailDest: envProd ? artisan.email : (req.session.email ||  'intervention@edison-services.fr'),
                    mailBcc: envProd ? (req.session.email ||  'intervention@edison-services.fr') : undefined,
                    mailReply: (req.session.email ||  'intervention@edison-services.fr')
                }

                PDF('contract', params).buffer(function(err, buffer) {
                    console.log('gotbuffer')
                    mail.send({
                        From: "intervention@edison-services.fr",
                        ReplyTo: communication.mailReply,
                        To: communication.mailDest,
                        Bcc: communication.mailBcc,
                        Subject: req.body.rappel ? "En attente de vos documents" : "Proposition de partenariat",
                        HtmlBody: req.body.text.replaceAll('\n', '<br>'),
                        Attachments: [{
                            Content: buffer.toString('base64'),
                            Name: 'Declaration de sous-traitance.pdf',
                            ContentType: 'application/pdf'
                        }]
                    }).then(resolve, reject)
                })
            })

        }
    }
}
