var ms = require('milliseconds');

module.exports = function(schema) {
    var async = require('async')
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

    schema.statics.stats = function(req, res) {
        return new Promise(function(resolve, reject) {
            var today = new Date().strtotime('last friday')
            today.setHours(0);
            var p1 = statusDistinctFactory({
                'date.ajout': {
                    $gt: today
                }
            });

            var p2 = statusDistinctFactory({
                'date.ajout': {
                    $gt: today
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
            //p1.then(console.log)

            async.parallel({
                todayTotal: p1,
                todayStatus: p2,
                allApr: p3,
                allAvr: p4
            }, function(err, result) {
                if (err)
                    console.log(err);
                result.allApr = _.groupBy(result.allApr, 'login')
                result.allAvr = _.groupBy(result.allAvr, 'login')
                    // console.log(result.allApr)
                result.todayTotal = _.sortByOrder(result.todayTotal, 'total', false);
                result.todayStatus = _.groupBy(result.todayStatus, 'login')
                var rtn = result.todayTotal.map(function(telepro) {
                    
                    telepro.status = cleanStatus(result.todayStatus[telepro.login]);
                    telepro.apr = _.get(result, 'allApr.' + telepro.login + '[0]', {});
                    if (telepro.apr !== {}) {
                        delete telepro.apr._id;
                        delete telepro.apr.login;
                    }
                    telepro.avr = _.get(result, 'allAvr.' + telepro.login + '[0]', {});
                    if (telepro.avr !== {}) {
                        delete telepro.avr._id;
                        delete telepro.avr.login;
                    }
                    delete telepro._id;
                    return telepro
                });
                resolve(rtn)
            })

            /* console.log("newt")
             Promise.all(p1, p2).then(function(result) {
                 console.log("-->", result)
             }, console.log)*/


        });
    }
}
