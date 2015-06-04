module.exports = function(schema) {

    schema.statics.annulation = {
        unique: true,
        findBefore: true,
        fn: function(inter, req, res) {
            return new Promise(function(resolve, reject) {
                inter.date.annulation = new Date;
                inter.login.annulation = req.session.login;
                inter.status = "ANN";
                inter.save().then(resolve, reject)
            })
        }
    }
}
