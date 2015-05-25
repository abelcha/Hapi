module.exports = function(schema) {

    schema.statics.verification = function(id, req, res) {
        return new Promise(function(resolve, reject) {
            db.model('intervention').findOne({
                id: id
            }).then(function(inter) {
                if (!inter.reglementSurPlace && !inter.date.envoiFacture)
                    reject("Veuillez envoyer la facture avant de vérifier")
                inter.date.verification = new Date;
                inter.login.verification = req.session.verification;
                inter.status = "ATT";
                inter.save(resolve, reject)
            }, reject)
        })
    }
}
