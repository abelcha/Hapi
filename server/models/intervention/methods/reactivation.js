module.exports = function(schema) {

    schema.statics.reactivation = {
        unique: true,
        findBefore: true,
        method: 'POST',
        fn: function(inter, req, res) {
            return new Promise(function(resolve, reject) {
                inter.date.annulation = undefined
                inter.login.annulation = undefined;
                inter.status = "APR";
                inter.causeAnnulation = undefined
                inter.save().then(resolve, reject)
            })
        }
    }
}
