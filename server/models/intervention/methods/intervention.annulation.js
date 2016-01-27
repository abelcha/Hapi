module.exports = function(schema) {


    schema.statics.annulation = {
        unique: true,
        findBefore: true,
        populateArtisan: true,
        method: 'POST',
        fn: function(inter, req, res) {

            var _ = require('lodash')
            return new Promise(function(resolve, reject) {
                if (inter.status === 'ENC' && inter.sst) {
                    var textTemplate = requireLocal('config/textTemplate');
                    mail.send({
                        noBCC: true,
                        From: "intervention@edison-services.fr",
                        ReplyTo: req.session.email,
                        To: inter.sst.email,
                        Subject: "[ANNULATION] - OS" + inter.id,
                        HtmlBody: _.template(textTemplate.sms.intervention.annulation)(inter)
                    });
                }
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
                edison.event('INTER_ANNULATION')
                    .login(req.session.login)
                    .id(inter.id)
                    .broadcast(inter.login.ajout)
                    .color('red')
                    .message(_.template("L'intervention {{id}} chez {{client.civilite}} {{client.nom}} ({{client.address.cp}}) à été annulé par {{login.annulation}}")(inter))
                    .send()
                    .save()

                if (inter.sst && inter.sst.subStatus === "TUT") {
                    db.model('signalement').signalArtisan({
                        inter_id: inter.id,
                        sst_id: inter.sst.id,
                        login: req.session.login,
                        sst_nom: inter.sst.nomSociete,
                        level: 1,
                        nom: "INTERVENTION SOUS-TUTELLE ANNULÉE",
                        subType: "INTERVENTION",
                        service: "PARTENARIAT",
                        level: "1",
                        _type: "INTERVENTION_SOUS_TUTELLE_ANNULÉE",
                    })
                }

                inter.save().then(resolve, reject)
                if (req.body.sms) {
                    sms.send({
                        type: "ANNULATION",
                        dest: inter.sst.nomSociete,
                        to: inter.sst.telephone.tel1,
                        text: req.body.textSms,
                    })
                }

            })
        }
    }
}
