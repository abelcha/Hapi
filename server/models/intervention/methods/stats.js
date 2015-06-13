var users = requireLocal('config/_users');
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
        telepro[name] = _.get(result, name + '.' + telepro.login + '[0]', {
            montant: 0,
            total: 0
        });
        if (telepro[name] !== {}) {
            delete telepro[name]._id;
            delete telepro[name].login;
        }

    }

    schema.statics.stats = function(req, res) {
        return new Promise(function(resolve, reject) {
            var filters = requireLocal('config/FiltersFactory')();
            var everydayOP = {
                todayTotal: statusDistinctFactory({
                    'date.ajout': {
                        $gt: edison.utils.date.today(true)
                    }
                }),
                todayStatus: statusDistinctFactory({
                    'date.ajout': {
                        $gt: edison.utils.date.today(true)
                    }
                }, {
                    st: '$status'
                })
            }
            var todayOP = {};
            _.each(filters.data, function(e) {
                if (e.stats !== false && e.match) {
                    var match = typeof e.match === 'function' ? e.match() : e.match;
                    todayOP[e.short_name] = statusDistinctFactory(match);
                }
            });
            async.parallel(todayOP, function(err2, result) {
                if (err2)
                    reject(err);
                result = _.mapValues(result, function(e) {
                    return _.groupBy(e, 'login')
                })
                var rtn = [];
                users.forEach(function(user) {
                    if (user.service === "INTERVENTION") {
                        var telepro = {
                            login: user.login,
                        }
                        _.each(result, function(fltr, key) {
                            cleanUp(key, telepro, result);
                        })
                        if (telepro._id) {
                            delete telepro._id;
                        }
                        rtn.push(telepro);
                    }
                });
                resolve(rtn)
            });
        });
    }
}
