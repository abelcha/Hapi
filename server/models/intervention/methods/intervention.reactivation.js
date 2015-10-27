module.exports = function(schema) {

    schema.statics.reactivation = {
        unique: true,
        findBefore: true,
        method: 'POST',
        fn: function(inter, req, res) {
            return new Promise(function(resolve, reject) {
                var _ = require('lodash')
                inter.date.annulation = undefined
                inter.login.annulation = undefined;
                inter.status = "APR";
                inter.causeAnnulation = undefined
                edison.event('INTER_REACTIVATION')
                    .login(req.session.login)
                    .id(inter.id)
                    .broadcast(inter.login.ajout)
                    .color('red')
                    .message(_.template("L'intervention {{id}} chez {{client.civilite}} {{client.nom}} ({{client.address.cp}}) à été reactivé par " + req.session.login)(inter))
                    .send()
                    .save()

                inter.save().then(resolve, reject)
            })
        }
    }
}
