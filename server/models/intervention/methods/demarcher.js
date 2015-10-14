module.exports = function(schema) {

    schema.statics.demarcher = {
        unique: true,
        findBefore: true,
        method: 'POST',
        fn: function(inter, req, res) {
            return new Promise(function(resolve, reject) {
                inter.aDemarcher = true;
                inter.date.demarchage = new Date();
                inter.login.demarchage = req.session.login;
                edison.event('INTER_DEM').login(req.session.login).id(inter.id)
                    .broadcast(inter.login.ajout)
                    .color('orange')
                    .message(_.template("L'intervention {{id}} chez {{client.civilite}} {{client.nom}} ({{client.address.cp}}) est démarché par {{login.demarchage}}")(inter))
                    .send()
                    .save()
                inter.save().then(resolve, reject);

            })
        }
    }
}
