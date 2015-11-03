module.exports = function(schema) {
    var moment = require('moment')
    var async = require('async')
    var PDF = require('edsx-mail')
    var _ = require('lodash')
    var textTemplate = requireLocal('config/textTemplate');
    var RelanceClient = requireLocal('config/_relances-client');
    require('nodeify').extend();


    schema.statics.relanceAuto = function(req, res) {



        return new Promise(function(resolve, reject) {
            var from = moment().startOf('week').toDate();
            var to = moment().endOf('week').toDate();

            db.model('intervention').find({
                status: 'VRF',
                'reglementSurPlace': true,
                'compta.reglement.recu': false,
                'date.intervention': db.utils.between(from, to)
            }).populate('sst').exec(function(err, resp) {
                var rtn = _.groupBy(resp, 'sst.id')
                async.each(_.values(rtn), function(e, cb) {
                    var template = _.template(textTemplate.mail.intervention.relanceArtisan())({
                        options: {},
                        inters: e,
                        sst: e[0].sst,
                        moment: moment
                    })
                    mail.send({
                        From: "comptabilite@edison-services.fr",
                        ReplyTo: "comptabilite@edison-services.fr",
                        To: "mzavot+" +  e[0].sst.nomSociete + "@gmail.com",
                        Subject: "Rappel des interventions en attente de règlement",
                        HtmlBody: template,
                    }, cb);
                }, resolve)
            })
        }).catch(__catch)

    }

}
