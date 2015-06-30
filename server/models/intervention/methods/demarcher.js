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
                inter.save().then(resolve, reject);

            })
        }
    }
}
