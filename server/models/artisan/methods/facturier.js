module.exports = function(schema) {
    var _ = require('lodash')
    var PDF = require('edsx-mail')

    schema.statics.facturier = {
        unique: true,
        findBefore: true,
        method: 'GET',
        fn: function(artisan, req, res) {
            var textTemplate = requireLocal('config/textTemplate.js');
            var params = {
                address: artisan.address,
                dest: artisan.representant,
                text: _.template(textTemplate.lettre.artisan.envoiFacturier())(artisan),
                title: ""
            }
            if (req.query.html) {
                res.send(PDF('letter', params).getHTML())
            } else {
                PDF('letter', params).buffer(function(err, resp) {
                    res.pdf(resp);
                })
            }

        }
    }


    schema.statics.sendFacturier = {
        unique: true,
        findBefore: true,
        method: 'POST',
        fn: function(artisan, req, res) {
            return new Promise(function(resolve, reject) {
                var opt = _.pick(req.body, 'facturier', 'deviseur');
                opt.login = req.session.login;
                opt.date = Date.now();
                artisan.historique.pack.push(opt)

                var communication = {
                    mailDest: envProd ? artisan.email : (req.session.email ||  'contact@edison-services.fr'),
                    mailBcc: envProd ? (req.session.email ||  'contact@edison-services.fr') : undefined,
                    mailReply: (req.session.email ||  'contact@edison-services.fr')
                }

/*                var textTemplate = requireLocal('config/textTemplate.js');
                var txt = _.template(textTemplate.lettre.artisan.rappelContrat())(artisan);

                mail.send({
                    From: "intervention@edison-services.fr",
                    ReplyTo: communication.mailReply,
                    To: communication.mailDest,
                    Bcc: communication.mailBcc,
                    Subject: "",
                    HtmlBody: txt.replaceAll('\n', '<br>'),
                }).then(function() {
                }, reject)*/
                    artisan.save().then(resolve, reject)
            })
        }
    }

}
