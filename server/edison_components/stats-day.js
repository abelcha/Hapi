module.exports = function(req, res) {

    var moment = require('moment');
    var async = require('async');
    var _ = require('lodash');
    var day = moment().hour(4).toDate()
    console.log(day)

    var promiseFactory = function(match) {

        return function(cb) {
            match['date.ajout'] =
                db.model('intervention')
                .aggregate()
                .match(match)
                .group({
                    _id: "$login.ajout",
                    count: {
                        $sum: 1
                    },
                    montant: {
                        $sum: '$prixAnnonce'
                    }
                })
                .exec(function(err, resp) {
                    if (err) {
                        return cb(err)
                    }
                    cb(null, resp)
                });
        }
    }




    var P = {
        enc: promiseFactory({
            'date.ajout': {
                $gt: day
            },
            status: 'ENC'
        }),
        all: promiseFactory({
            'date.ajout': {
                $gt: day
            },
        }),
        apr: promiseFactory({
            'date.ajout': {
                $gt: day
            },
            status: 'APR'
        })
    }
    async.parallel(P, function(err, resp) {

        var xfind = function(name, login) {
            var fnd = _.find(resp[name], '_id', login)
            return fnd ? {
                montant: _.round(fnd.montant, 2),
                count: _.round(fnd.count, 2)
            } : {
                count: 0,
                montant: 0
            }
        }

        var rtn = {};
        db.model('user').find({
                service: 'INTERVENTION',
                activated: true
            })
            .then(function(users) {
                //  console.log(users)
                _.each(users, function(usr) {
                    rtn[usr.login] = {}
                    _.each(P, function(x, fltr) {
                        rtn[usr.login][fltr] = xfind(fltr, usr.login)
                    })
                })
                res.json(rtn);
            })
    })


}
