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
                sst: artisan,
                text: _.template(textTemplate.lettre.artisan.envoiFacturier())(artisan),
                title: ""
            }
            if (req.query.html) {
                res.send(PDF('sst-letter', params).getHTML())
            } else {
                PDF('sst-letter', params).buffer(function(err, resp) {
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
                artisan.save().then(resolve, reject)
            })
        }
    }

}
