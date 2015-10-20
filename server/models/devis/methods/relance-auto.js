module.exports = function(schema) {
    var _ = require('lodash')
    var moment = require('moment-timezone')

    var send = function(e, callback) {
        var textTemplate = requireLocal('config/textTemplate');
        var config = requireLocal('config/dataList');
        var usr = _.find(edison.users.data, 'login', "benjamin_b");
        var options = {
                session: usr,
                body: {
                    text: textTemplate.mail.devis.envoi.bind(e)(usr, config, _, moment)
                }
            }
            //  console.log(options)
        db.model('devis').envoiTest.fn(e, options)
            .then(callback, _.partial(callback, null))
    }

    schema.statics.relanceAuto7h = function(req, res) {
        var async = require('async')

        var todayAt7 = moment.tz('Europe/Paris').hours(7).toDate()
        var yesterdayAt12h30 = moment.tz('Europe/Paris').add(-1, 'days').hours(12).minutes(30).toDate()
        var twoDaysAgo = moment.tz('Europe/Paris').add(-2, 'days').toDate();
        var oneDaysAgo = moment.tz('Europe/Paris').add(-1, 'days').toDate();
        db.model('devis').find({
            status: 'ATT',
            historique: {
                $size: 1
            },
            'historique.0.date': {
                $gt: yesterdayAt12h30
            }
        }).then(function(resp) {
            async.eachLimit(resp, 1, send)
        })

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
            async.eachLimit(resp, 1, send);
        })
    }


    schema.statics.relanceAuto14h = function(req, res) {
        var moment = require('moment')
        var async = require('async')

        var todayAt7 = moment.tz('Europe/Paris').hours(7).toDate()
        db.model('devis').find({
            status: 'ATT',
            historique: {
                $size: 1
            },
            'historique.0.date': {
                $gt: todayAt7
            }
        }).then(function(resp) {
            async.eachLimit(resp, 1, send)
        })
    }

}
