var users = requireLocal('config/_users');
var ms = require('milliseconds');
var async = require('async')
var _ = require("lodash")
var FiltersFactory = requireLocal('config/FiltersFactory');

module.exports = function(schema) {
    var statusDistinctFactory = function(model, customMatch, customGroup) {
        var match = customMatch || {};
        return function(cb) {
            db.model(model ||  'intervention')
                .aggregate()
                .match(match)
                .group({
                    _id: {
                        telepro: customGroup || '$login.ajout'
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
                allFilters[e.short_name] = statusDistinctFactory(model, match, e.group);
            }
        });
    }


    schema.statics.stats = function(req, res) {
        return new Promise(function(resolve, reject) {
            redis.get('interventionStats'.envify(), function(err, resp) {
                if (req && !err && resp && !_.get(req, 'query.cache')) {
                    return resolve(resp)
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
                    var sum = {}
                    users.forEach(function(user) {
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
                    });
                    redis.set('interventionStats'.envify(), JSON.stringify(rtn), function() {
                        resolve(rtn)
                    });
                });
            });
        });
    }










    var createUpdate = function(obj) {
        return function(cb) {
            db.model('intervention').update(obj.query, obj.update, {
                multi: true
            }).exec(cb)
        }
    }

    var fltr = schema.statics.fltrify = function(query, cb) {
        try {
            if (!query) {
                query = {}
            } else if (typeof query === 'function') {
                cb = query;
                query = {}
            }
            var fltrs = FiltersFactory('intervention').getAllFilters();

            var updates = [];
            _.each(fltrs, function(e) {
                if (e.stats !== false && e.match) {
                    var match = typeof e.match === 'function' ? e.match() : e.match;
                    var field = 'cache.f.' + e.short_name;
                    var tmp = {
                        query: _.merge(_.clone(query), match  ||  {}),
                        update: {
                            $set: {}
                        }
                    }
                    tmp.update.$set[field] = 1;
                    tmp.query['$or'] = [{}, {}]
                    tmp.query['$or'][0][field] = 0;
                    tmp.query['$or'][1][field] = {
                        $exists: false
                    };
                    updates.push(createUpdate(tmp))
                }
            });
            db.model('intervention').update(query, {
                $set: {
                    'cache.f': {}
                }
            }, {
                multi: true
            }).exec(function(err, resp) {
                async.parallel(updates, function(err, result) {
                    if (typeof cb === 'function')
                        cb(err, result)
                });
            })

        } catch (e) {
            __catch(e)
        }
    }

    schema.statics.fltrAll = function(req, res) {
        fltr(_.omit(req.query, 'x'), function(err, resp) {
            res.json([err, resp])
        })
    }



}
