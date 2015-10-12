module.exports = function(schema) {
    var _ = require('lodash')
    schema.statics.verification = {
        unique: true,
        findBefore: true,
        method: 'POST',
        fn: function(inter, req, res) {
            return new Promise(function(resolve, reject) {
                if (!inter.reglementSurPlace && !inter.date.envoiFacture)
                    return reject("Veuillez envoyer la facture avant de vérifier")
                if (inter.date.verification)
                    return reject("L'intervention est deja vérifiée");
                if (!inter.prixFinal)
                    return reject('Veuillez ajouté un prix final')
                inter.date.verification = new Date;
                inter.login.verification = req.session.login;
                inter.status = "VRF";
                edison.event('INTER_VERIFICATION').login(req.session.login).id(inter.id)
                    .broadcast(inter.login.ajout)
                    .color('green')
                    .message(_.template("L'intervention {{id}} chez {{client.civilite}} {{client.nom}} ({{client.address.cp}}) à été verifié par {{login.verification}}")(inter))
                    .send()
                    .save()
                inter.save().then(resolve, reject)
            })

        }
    }

}
