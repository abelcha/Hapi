module.exports = function(schema) {

    schema.statics.annulation = function(id, req, res) {
        return new Promise(function(resolve, reject) {
            db.model('intervention').findOne({
                id: id
            }).then(function(inter) {
                inter.date.annulation = new Date;
                inter.login.annulation = req.session.login;
                inter.status = "ANN";
                inter.save()
                resolve("L'intervention " + id  + " à été annulé.")
            }, reject)
        })
    }
}
