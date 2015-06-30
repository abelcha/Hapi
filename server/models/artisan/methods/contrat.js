module.exports = function(schema) {

    schema.statics.getContrat = function(artisan, html, contratSigne) {
        return edison.pdf({
            html: html,
            buffer: true,
            template: 'contrat',
            args: {
                contratSigne:contratSigne,
                data: artisan
            },
        })
    }

    schema.statics.contrat = {
        unique: true,
        findBefore: true,
        method: 'GET',
        fn: function(artisan, req, res) {
            return new Promise(function(resolve, reject) {
                db.model('artisan').getContrat(artisan, req.query.html)
                    .then(function(resp) {
                        if (!req.query.html)
                            res.contentType("application/pdf");
                        res.send(resp);
                    }, reject)
            })
        }
    }

    schema.statics.sendContrat = {
        unique: true,
        findBefore: true,
        method: 'POST',
        fn: function(artisan, req, res) {
            var text = req.body.text.replaceAll('\n', '<br>')
            return new Promise(function(resolve, reject) {
                db.model('artisan').getContrat(artisan, false, req.body.signe).then(function(buffer) {
                    mail.sendContrat(artisan, buffer, req.session.email, text).then(function() {
                        artisan.historique.contrat.push({
                            login: req.session.login,
                            signe: req.body.signe,
                            date: new Date(),
                        });
                        artisan.save().then(resolve, reject);
                    }, reject);
                }, reject);
            });
        }
    }
}
