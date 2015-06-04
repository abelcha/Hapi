module.exports = function(schema) {

    schema.statics.envoiFacture = {
        unique: true,
        findBefore: true,
        fn: function(inter, req, res) {
            return new Promise(function(resolve, reject) {
                inter.date.envoiFacture = new Date;
                inter.login.envoiFacture = req.session.login;
                inter.save().then(resolve, reject)
            })
        }
    }

}
