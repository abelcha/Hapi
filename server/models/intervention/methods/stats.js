var ms = require('milliseconds');
var async = require('async')
var _ = require("lodash")

module.exports = function(schema) {
    var statusDistinctFactory = function(customMatch, customGroup) {
        var group = customGroup || {};
        group.telepro = '$login.ajout';
        var match = customMatch || {};
        return function(cb) {
            db.model('intervention')
                .aggregate()
                .match(match)
                .group({
                    _id: group,
                    mnt: {
                        $sum: "$prixAnnonce"
                    },
                    total: {
                        $sum: 1
                    }
                })
                .project({
                    _id: 1,
                    name: '$_id.st',
                    login: '$_id.telepro',
                    total: 1,
                    montant: db.utils.round("$mnt")
                }).exec(cb);
        }
    }

    var cleanStatus = function(intersStatus) {
        intersStatus = _.indexBy(intersStatus, 'name')
        intersStatus = _.mapValues(intersStatus, function(e) {
            delete e._id
            delete e.login
            delete e.name
            return e;
        })
        return intersStatus;
    }

    var cleanUp = function(name, telepro, result) {
        telepro[name] = _.get(result, name + '.' + telepro.login + '[0]', {});
        if (telepro[name] !== {}) {
            delete telepro[name]._id;
            delete telepro[name].login;
        }

    }

    schema.statics.stats = function(req, res) {
        return new Promise(function(resolve, reject) {
            var p1 = statusDistinctFactory({
                'date.ajout': {
                    $gt: edison.utils.date.today(true)
                }
            });

            var p2 = statusDistinctFactory({
                'date.ajout': {
                    $gt: edison.utils.date.today(true)
                }
            }, {
                st: '$status'
            });

            var p3 = statusDistinctFactory({
                'status': 'APR',
                'date.ajout': {
                    $gt: new Date(0)
                },
            });
            var p4 = statusDistinctFactory({
                status: 'ENV',
                'date.intervention': {
                    $lt: new Date(Date.now() + ms.hours(1))
                }
            });
            var p5 = statusDistinctFactory({
                status: 'ATT',
                reglementSurPlace: true,
                'date.intervention': {
                    $lt: new Date(Date.now() - ms.weeks(2)),
                }
            });
            var p6 = statusDistinctFactory({
                status: 'ATT',
                reglementSurPlace: true,
                'date.intervention': {
                    $lt: new Date(Date.now() - ms.months(1))
                }
            });
            var p7 = statusDistinctFactory({
                status: 'ATT',
                reglementSurPlace: false,
                'date.intervention': {
                    $lt: new Date(Date.now() - ms.weeks(2)),
                }
            });
            var p8 = statusDistinctFactory({
                status: 'ATT',
                reglementSurPlace: false,
                'date.intervention': {
                    $lt: new Date(Date.now() - ms.months(1))
                }
            });
            //p1.then(console.log)

            async.parallel({
                todayTotal: p1,
                todayStatus: p2,
                apr: p3,
                avr: p4,
                sarl: p5,
                usarl: p6,
                carl: p7,
                ucarl: p8,
            }, function(err, result) {
                if (err)
                    console.log(err);
                result.apr = _.groupBy(result.apr, 'login')
                result.avr = _.groupBy(result.avr, 'login')
                result.sarl = _.groupBy(result.sarl, 'login')
                result.usarl = _.groupBy(result.usarl, 'login')
                result.carl = _.groupBy(result.carl, 'login')
                result.ucarl = _.groupBy(result.ucarl, 'login')
                result.todayTotal = _.groupBy(result.todayTotal, 'login');
                result.todayStatus = _.groupBy(result.todayStatus, 'login')
                var rtn = [];
                edison.config.users.forEach(function(user) {
                    if (user.service === "INTERVENTION") {
                        var telepro = _.get(result, 'todayTotal[' + user.login + '][0]') || {
                            login: user.login,
                            total: 0,
                            montant: 0
                        }

                        telepro.status = cleanStatus(result.todayStatus[telepro.login]);
                        cleanUp('apr', telepro, result);
                        cleanUp('avr', telepro, result);
                        cleanUp('sarl', telepro, result);
                        cleanUp('usarl', telepro, result);
                        cleanUp('carl', telepro, result);
                        cleanUp('ucarl', telepro, result);
                        if (telepro._id) {
                            delete telepro._id;
                        }
                        //console.log(telepro)
                        rtn.push(telepro);
                    }
                })
                resolve(rtn)
            })


        });
    }
}
