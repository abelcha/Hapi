    module.exports = function(core) {
        var _ = require('lodash');

        return function(id_list) {
            return new Promise(function(resolve, reject) {
                var async = require('async');
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

                }, function(err, resp) {
                    if (err) {
                        reject(err);
                    }
                    try {
                        console.log('NBS ==> ', resp.data.length, id_list)
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
                                var z = _.filter(resp.data, function(e) {
                                    return _.includes(id_list, e._id);
                                })
                                _.each(z, function(x) {
                                    cache.unshift(x.cache)
                                })
                            }
                        }
                        redis.set(core.redisCacheListName.envify(), JSON.stringify(cache), function() {
                            resolve(_.map(resp.data, 'cache'));
                        });
                    } catch (e) {
                        __catch(e);
                    }
                })
            }).catch(__catch)
        }
    }
