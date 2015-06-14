module.exports = function(schema) {

    schema.statics.annulation = {
        unique: true,
        findBefore: true,
        method: 'POST',
        fn: function(devis, req, res) {
            return new Promise(function(resolve, reject) {
                devis.date.annulation = new Date;
                devis.login.annulation = req.session.login;
                devis.status = "ANN";
                devis.causeAnnulation = req.body.causeAnnulation;
                db.model('event')({
                    type: 'ANN_DEV',
                    login: req.session.login,
                    date: new Date,
                    id_devis: devis.id
                }).save();
                devis.save().then(resolve, reject)
            })
        }
    }
}
