module.exports = function(schema) {

    schema.statics.annulation = function(id, req, res) {
        return new Promise(function(resolve, reject) {
            db.model('intervention').findOne({
                id: id
            }).then(function(inter) {
                inter.date.verification = new Date;
                inter.login.verification = req.session.verification;
                inter.status = "ATT";
                inter.save(resolve, reject)
            }, reject)
        })
    }
}
