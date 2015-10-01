module.exports = function(schema) {

    schema.statics.annulation = {
        unique: true,
        findBefore: true,
        populateArtisan: true,
        method: 'POST',
        fn: function(inter, req, res) {
            
            var _ = require('lodash')
            return new Promise(function(resolve, reject) {
                inter.date.annulation = new Date;
                inter.date.envoi = undefined;
                inter.compta.paiement.ready = false;
                inter.login.annulation = req.session.login;
                inter.status = "ANN";
                inter.causeAnnulation = req.body.causeAnnulation;
                if (req.body.reinit) {
                    inter.artisan = undefined;
                    inter.sst = undefined;
                    inter.status = 'APR';
                }
                inter.save().then(resolve, reject)
                if (req.body.sms) {
                    sms.send({
                        to: envProd ? _.get(inter, 'sst.telephone.tel1', '0633138868') : req.session.portable,
                        text: req.body.textSms,
                    })
                }
            })
        }
    }
}
