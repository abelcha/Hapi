var users = requireLocal('config/_users');
var ms = require('milliseconds');
var async = require('async')
var _ = require("lodash")
var FiltersFactory = requireLocal('config/FiltersFactory');

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



module.exports = {
    reload: function() {
        return new Promise(function(resolve, reject) {

            try {
                var allFilters = {};
                mergeFilters(allFilters, 'intervention')
                mergeFilters(allFilters, 'devis')
                mergeFilters(allFilters, 'artisan')
                console.time('allFilters')
                async.parallel(allFilters, function(err, result) {
                    console.timeEnd('allFilters')
                    if (err)
                        reject(err)
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
                    redis.set('statsTelepro'.envify(), JSON.stringify(rtn), function() {
                        if (typeof io !== 'undefined') {
                            io.sockets.emit('filterStatsReload', rtn);
                        }
                        return resolve(rtn);
                    });

                });
            } catch (e) {
                __catch(e)
            }
        });
    },
    get: function(req, res) {
        var _this = this;

        redis.get('statsTelepro'.envify(), function(err, reply) {
            if (!err && reply && !req.query.cache) {
                return res.jsonStr(reply)
            } else {
                return _this.reload().then(res.json.bind(res))
            }
        })
    }
}
