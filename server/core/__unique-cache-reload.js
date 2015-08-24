    module.exports = function(core) {
        var async = require('async');
        var _ = require('lodash');

        return function(doc) {
            try {

                async.series({
                    reloadFilter: function(cb) {
                        core.model().reloadFilters({
                            id: doc.id
                        }, cb)
                    },
                    cacheList: function(cb) {
                        redis.get(core.redisCacheListName.envify(), cb);
                    },
                    data:function(cb) {
                        core.model().findById(doc.id, cb)
                    }
                }, function(err, resp) {
                    if (resp.cacheList && resp.data) {
                        var data = JSON.parse(resp.cacheList);
                        var index = _.findIndex(data, function(e) {
                            return e.id === resp.data.id;
                        });
                        result = resp.data.cache;
                        if (index !== -1) {
                            data[index] = result;
                        } else {
                            data.unshift(result);
                        }
                        edison.statsTelepro.reload().then(function(resp) {
                            io.sockets.emit('filterStatsReload', resp);
                        })
                        redis.set(core.redisCacheListName.envify(), JSON.stringify(data), function() {
                            result._date = Date.now()
                            if (!isWorker) {
                                io.sockets.emit(core.listChange, result);
                                //sometimes it's too fast
                                setTimeout(function() {
                                    io.sockets.emit(core.listChange, result);
                                }, 2500)
                            }
                        });
                    }
                })
            } catch (e) {
                __catch(e)
            }

        }
    }
