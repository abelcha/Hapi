module.exports = function(core) {
    var _ = require('lodash')
    return function(query, cb, a, b) {
        console.log('here')
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
            console.log('here2')

            var fltrs = FiltersFactory(core.name).getAllFilters();

            console.log('here3')
            var updates = {};
            var __updates = {}
            _.each(fltrs, function(e) {
                console.log('hereloop', !!e.stats, !!e.match)
                if (e.stats !== false && e.match) {
                    console.log('trigger')
                    var match = typeof e.match === 'function' ? e.match() : e.match;
                    var field = 'cache.f.' + e.short_name;
                    var tmp = {
                        query: _.merge(_.clone(query), match  ||  {}),
                        update: {
                            $set: {}
                        }
                    }
                    tmp.update.$set[field] = 1;
                   // tmp.query['$or'] = [{}, {}]
                   /* tmp.query['$or'][0][field] = 0;
                    tmp.query['$or'][1][field] = {
                        $exists: false
                    };*/
                    __updates[e.short_name] = tmp
                    updates[e.short_name] = updateFactory(tmp)
                }
            });

            console.log(JSON.stringify(__updates, null, 2))
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
