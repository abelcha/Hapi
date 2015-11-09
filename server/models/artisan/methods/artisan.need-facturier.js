module.exports = function(schema) {

    schema.statics.needFacturier = {
        unique: true,
        findBefore: true,
        method: 'POST',
        fn: function(artisan, req, res) {
            var _ = require('lodash')
            return new Promise(function(resolve, reject) {
                artisan.needFacturier = true;
                artisan.save().then(resolve, reject)
                edison.event('NEED_FACTURIER')
                    .login(req.session.login)
                    .id(artisan.id)
                    .service('PARTENARIAT')
                    .color('green')
                    .message(_.template("{{login}} vous signale une demande de facturier pour {{artisan.nomSociete}} (M. {{artisan.representant.nom}})")({
                        artisan: artisan,
                        login: req.session.login
                    }))
                    .send()
                    .save()
            })
        }
    }
}
