var users = requireLocal('config/_users');
var ms = require('milliseconds');
var async = require('async')
var _ = require("lodash")
var FiltersFactory = requireLocal('config/FiltersFactory');

module.exports = function(schema) {
    var statusDistinctFactory = function(customMatch, model) {
        var match = customMatch || {};
        return function(cb) {
            db.model(model ||  'intervention')
                .aggregate()
                .match(match)
                .group({
                    _id: {
                        telepro: '$login.ajout'
                    },
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
        };
        return telepro[name];

    }

    var mergeFilters = function(allFilters, model) {
        var filters = FiltersFactory(model).getAllFilters();
        _.each(filters, function(e) {
            if (e.stats !== false && e.match) {
                var match = typeof e.match === 'function' ? e.match() : e.match;
                allFilters[e.short_name] = statusDistinctFactory(match, model);
            }
        });
    }

    schema.statics.stats = function(req, res) {
        return new Promise(function(resolve, reject) {
            redis.get('interventionStats', function(err, resp) {
                if (!err && resp && !_.get(req, 'query.cache'))
                    return resolve(JSON.parse(resp))
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
                var allFilters = {};
                mergeFilters(allFilters, 'intervention')
                mergeFilters(allFilters, 'devis')
                mergeFilters(allFilters, 'artisan')
                async.parallel(allFilters, function(err2, result) {
                    if (err2)
                        reject(err);
                    result = _.mapValues(result, function(e) {
                        return _.groupBy(e, 'login')
                    })
                    var rtn = [];
                    var sum = {
                    }
                    users.forEach(function(user) {
                        if (user.service === "INTERVENTION") {
                            var telepro = {
                                login: user.login,
                            }
                            _.each(result, function(fltr, key) {
                                if (key.startsWith('i_') ||  key.startsWith('d_')) {
                                    var tmp = cleanUp(key, telepro, result);
                                    if (!sum[key])
                                        sum[key] = {
                                            total: 0,
                                            montant: 0
                                        };
                                    sum[key].montant = Math.round((sum[key].montant + tmp.montant) * 100) / 100;
                                    sum[key].total += tmp.total;
                                }
                            })
                            if (telepro._id) {
                                delete telepro._id;
                            }
                            rtn.push(telepro);
                        }
                    });
                    rtn.push(sum);
                    resolve(rtn)
                    redis.set('interventionStats', JSON.stringify(rtn));
                });
            });
        });
    }
}
