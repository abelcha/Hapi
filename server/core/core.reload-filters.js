module.exports = function(core) {
    var _ = require('lodash')
    return function(query, cb, a, b) {
        var updateFactory = function(obj) {
            return function(cb) {
                core.model().update(obj.query, obj.update, {
                    multi: true
                }).exec(cb)
            }
        }
        try {
            if (!query) {
                query = {}
            } else if (typeof query === 'function') {
                cb = query;
                query = {}
            }
            var fltrs = FiltersFactory(core.name).getAllFilters();

            var updates = {};
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
                    updates[e.short_name] = updateFactory(tmp)
                }
            });
            core.model().update(query, {
                $set: {
                    'cache.f': {}
                }
            }, {
                multi: true
            }).exec(function(err, resp) {
                var async = require('async')
                async.parallel(updates, function(err, result) {
                    if (typeof cb === 'function')
                        cb(err, result)
                });
            })

        } catch (e) {
            __catch(e)
        }
    }
}
