    module.exports = function(core) {
        var async = require('async');
        var _ = require('lodash');


        return function(docs) {
            return new Promise(function(resolve, reject) {
                var id_list = _(docs).flatten().map('id').value();
                async.series({
                    reloadFilter: function(cb) {
                        core.model().reloadFilters({
                            _id: {
                                $in: id_list
                            }
                        }, cb)
                    },
                    cacheList: function(cb) {
                        redis.get(core.redisCacheListName.envify(), cb);
                    },
                    data: function(cb) {
                        core.model().find({
                            _id: {
                                $in: id_list
                            }
                        }, {
                            cache: true
                        }, cb)
                    },
                    statsTelepro: function(cb) {
                        edison.statsTelepro.reload().then(function(resp) {
                            cb(null, resp);
                        });
                    }
                }, function(err, resp) {

                    try {

                        console.log('NBS ==> ',  resp.data.length)
                        if (resp.cacheList && resp.data) {
                            var cache = JSON.parse(resp.cacheList);
                            for (var i = 0; i < cache.length && id_list.length; i++) {
                                var pos = id_list.indexOf(cache[i].id)
                                if (pos >= 0) {
                                    cache[i] = resp.data[pos].cache;
                                    id_list.splice(pos, 1);
                                }
                            };
                            if (id_list.length) {
                                var shift = _(resp.data).filter(function(e) {
                                    return _.includes(id_list, e._id);
                                }).map('cache').value()
                                cache.unshift(shift)
                            }

                        }
                        redis.set(core.redisCacheListName.envify(), JSON.stringify(cache), function() {
                            resolve([_.map(resp.data, 'cache'), resp.statsTelepro]);
                        });
                    } catch (e) {
                        __catch(e);
                    }
                })
            }).catch(__catch)
        }
    }
