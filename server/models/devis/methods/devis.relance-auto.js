module.exports = function(schema) {
    var _ = require('lodash')
    var moment = require('moment-timezone')

    var relanceRapport;

    var send = function(e, callback) {
        var textTemplate = requireLocal('config/textTemplate');
        var config = requireLocal('config/dataList');
        var usr = _.find(edison.users.data, 'login', "benjamin_b");
        var realUsr = _.find(edison.users.data, 'login', e.login.ajout)
        var options = {
            session: realUsr || usr,
            body: {
                text: textTemplate.mail.devis.envoi.bind(e)(realUsr || usr, config, _, moment),
                auto: true,
            }
        }
        if (envDev) {
            console.log('send devis ' + e.id);
            return callback(null)
        }
        db.model('devis').envoi.fn(e, options)
            .then(_.partial(callback, null))
    }

    schema.statics.relanceAuto7h = function(req, res) {
        var async = require('async')
        var todayAt7 = moment.tz('Europe/Paris').hours(7).toDate()
        var weekendOffset = moment().isoWeekday() === 1 ? -2 : 0;
        var yesterdayAt12h30 = moment.tz('Europe/Paris').add(-1 + weekendOffset, 'days').hours(12).minutes(30).toDate()
        var twoDaysAgo = moment.tz('Europe/Paris').add(-2 + weekendOffset, 'days').toDate();
        var oneDaysAgo = moment.tz('Europe/Paris').add(-1, 'days').toDate();
        var relanceRapport = []
        async.parallel([
            function(cb) {
                db.model('devis').find({
                    status: 'ATT',
                    historique: {
                        $size: 1
                    },
                    'historique.0.date': {
                        $gt: yesterdayAt12h30
                    }
                }).then(function(resp) {
                    relanceRapport.push(["YesterdayAfter14H", _.pluck(resp, 'id').join(' - ')].join(' -> '))
                    async.eachLimit(resp, 1, send, cb)
                })
            },
            function(cb) {
                db.model('devis').find({
                    status: 'ATT',
                    historique: {
                        $size: 2
                    },
                    'historique.1.date': {
                        $lt: oneDaysAgo,
                        $gte: twoDaysAgo
                    }
                }).then(function(resp) {
                    relanceRapport.push(["YesterdayBefore14h", _.pluck(resp, 'id').join(' - ')].join(' -> '))
                    async.eachLimit(resp, 1, send, cb);
                })
            }
        ], function() {
            mail.send({
                From: "comptabilite@edison-services.fr",
                To: "abel.chalier@gmail.com",
                Subject: "Rapport d'envoi des relances devis 7H",
                HtmlBody: relanceRapport.join("<br>")
            })
            console.log(relanceRapport);
        })

    }


    schema.statics.relanceAuto14h = function(req, res) {
        var moment = require('moment')
        var async = require('async')
        var relanceRapport = [];

        var todayAt7 = moment.tz('Europe/Paris').hours(7).toDate()
        if (moment().isoWeekday() === 1) {
            todayAt7 = todayAt7.add(-2, "days");
        }
        db.model('devis').find({
            status: 'ATT',
            historique: {
                $size: 1
            },
            'historique.0.date': {
                $gt: todayAt7
            }
        }).then(function(resp) {
            relanceRapport.push(['TodayBefore14H', _.pluck(resp, 'id').join(' - ')].join(' -> '))
            async.eachLimit(resp, 1, send, function() {
                mail.send({
                    From: "comptabilite@edison-services.fr",
                    To: "abel.chalier@gmail.com",
                    Subject: "Rapport d'envoi des relances devis",
                    HtmlBody: relanceRapport.join("<br>")
                })
                console.log(relanceRapport);
            })
        })
    }

}
