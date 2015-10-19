module.exports = function(schema) {
    var _ = require('lodash')

    var send = function(e, callback) {
        var textTemplate = requireLocal('config/textTemplate');
        var config = requireLocal('config/dataList');
        e.client.email = "mzavot@gmail.com"
        var options = {
                session: usr,
                body: {
                    text: textTemplate.mail.devis.envoi.bind(e)(usr, config, _)
                }
            }
            //  console.log(options)
        db.model('devis').envoi.fn(e, options)
            .then(callback, _.partial(callback, null))
    }

    schema.statics.relanceAuto7h = function(req, res) {
        var moment = require('moment')
        var async = require('async')

        var todayAt7 = moment().hours(7).toDate()
        var yesterdayAt12h30 = moment().add(-19, 'days').hours(12).minutes(30).toDate()

        var usr = _.find(edison.users.data, 'login', "benjamin_b");
        db.model('devis').find({
            status: 'ATT',
            historique: {
                $size: 1
            },
            'historique.0.date': {
                $gt: yesterdayAt12h30
            }
        }).then(function(resp) {
            async.eachLimit(resp, 1, send, function() {
                res.send('ok')
            })
        })

    }
}
