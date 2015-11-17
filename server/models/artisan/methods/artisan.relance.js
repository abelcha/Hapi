module.exports = function(schema) {
    var moment = require('moment')
    var async = require('async')
    var PDF = require('edsx-mail')
    var _ = require('lodash')
    var textTemplate = requireLocal('config/textTemplate');
    var RelanceClient = requireLocal('config/_relances-client');
    require('nodeify').extend();


    schema.statics.relanceFinDeMois = function(req, res) {
        var to = moment().startOf('month').toDate();
        var from = moment().add(-1, 'months').startOf('month').toDate();

        db.model('intervention').find({
            status: 'VRF',
            'reglementSurPlace': true,
            'facture.email': {
                $exists: true
            },
            'date.intervention': {
                $exists: true
            },
            'compta.reglement.recu': false,
            'date.intervention': db.utils.between(from, to)
        }).populate('sst').exec(function(err, resp) {
            var rtn = _.groupBy(resp, 'sst.id')
            console.log(_.size(rtn))
            async.eachLimit(_.values(rtn), 5,function(e, cb) {
                var template = _.template(textTemplate.mail.intervention.relanceArtisanFinDeMois())({
                    options: {},
                    inters: e,
                    sst: e[0].sst,
                    moment: moment
                })
                var options = {
                    address: e[0].sst.address,
                    dest: e[0].sst.representant,
                    text: template,
                    id: e[0].sst,
                    title: ""
                }
                var x = PDF('letter', options).buffer(function(err, buff) {
                    //require('fs').writeFileSync('xxx.pdf', buff);
                    document.stack(buff, 'relance-sst - ' + e[0].sst.nomSociete, "AUTO")
                        .then(function(resp) {
                            console.log('-->', resp)
                            cb();
                        })
                })
            }, function(err) {

                console.log('---->', err)
                res.send('ok')
            })
        })
    }

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
                        To: "mzavot+" + e[0].sst.nomSociete + "@gmail.com",
                        Subject: "Rappel des interventions en attente de règlement",
                        HtmlBody: template,
                    }, cb);
                }, resolve)
            })
        }).catch(__catch)

    }

}
