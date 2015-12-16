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

                    artisan.signe = req.body.signe;
                    var communication = {
                        mailDest: envProd ? artisan.email : (req.session.email ||  'intervention@edison-services.fr'),
                        mailReply: 'yohann.rhoum@edison-services.fr'
                    }
                    var template = artisan.historique.contrat.length > 0 ? 'rappelContrat' : 'envoiContrat';

                    var html = require('fs').readFileSync(process.cwd() + '/templates/' + template + '.html', 'utf8')
                    html = _.template(html)(artisan);
                    PDF('contract', artisan).buffer(function(err, buffer) {
                        mail.send({
                            From: "yohann.rhoum@edison-services.fr",
                            ReplyTo: communication.mailReply,
                            To: communication.mailDest,
                            Subject: req.body.rappel ? "En attente de vos documents" : "Proposition de partenariat",
                            HtmlBody: html,
                            Attachments: [{
                                Content: buffer.toString('base64'),
                                Name: 'Declaration de sous-traitance.pdf',
                                ContentType: 'application/pdf'
                            }]
                        }).then(resolve, reject)
                    })
                } catch (e) {
                    console.log(e)
                    console.log(e.stack)
                }
            })

        }
    }
}
