    module.exports = function(core) {
        var _ = require('lodash');

        var log = function(name, callback) {
            console.time(name)
            return function() {
                console.timeEnd(name)
                callback.apply(this, arguments);
            }
        }

        return function(id_list) {
            var hashname = core.redisCacheListName.envify()
            return new Promise(function(resolve, reject) {
                var async = require('async');
                async.series({
                    reloadFilter: function(cb) {
                        core.model().reloadFilters({
                            _id: {
                                $in: id_list
                            }
                        }, log('reloadFilter', cb))
                    },
                    data: function(cb) {
                        core.model().find({
                            _id: {
                                $in: id_list
                            }
                        }, {
                            cache: true
                        }, log('data', cb))
                    },

                }, function(err, resp) {
                    if (err) {
                        return reject(err);
                    }
                    if (resp.data) {
                        _.each(resp.data, function(e) {
                            redis.hset(hashname, e.cache.id, JSON.stringify(e.cache));
                        })
                        resolve(_.map(resp.data, 'cache'));
                    }
                })
            }).catch(__catch)
        }
    }
