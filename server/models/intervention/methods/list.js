'use strict'
var redisRStream = require('redis-rstream')
module.exports = function(schema) {

    schema.statics.list = function(req, res) {
        console.log("list")
        var reloadCache = (req && req.query && req.query.cache);

        var getWorkerCache = function(resolve, reject) {
            return edison.worker.createJob({
                name: 'db',
                model: 'intervention',
                method: 'cacheReload'
            }).then(resolve, reject);
        }

        var getWebCache = function(resolve, reject) {
            return db.model('intervention').cacheReload().then(resolve, reject);
        }

        var getCache = function(resolve, reject) {
            if (envProd || envDev) {
                return getWorkerCache(resolve, reject);
            } else {
                return getWebCache(resolve, reject);
            }
        }

        var getList2 = function(resolve, reject) {
            console.log("two")
            if (!reloadCache)  {
                redis.get('interventionList', function(err, reply) {
                    if (!err && reply) { // we just want to refresh the cache 
                       res.send(reply)
                    } else {
                        return getCache(resolve, reject);
                    }
                });
            } else {
            console.log("one")

                return getCache(resolve, reject);
            }
        }

        var getList = function(resolve, reject) {
            if (!reloadCache)  {
                redis.exists('interventionList', function(err, reply) {
                    if (!err && reply) { // we just want to refresh the cache 
                        redisRStream(redis, 'interventionList')
                            .pipe(res)
                    } else {
                        return getCache(resolve, reject);
                    }
                });
            } else {
                return getCache(resolve, reject);
            }
        }
        return new Promise(req.query.lol ? getList2 : getList);
    };

}
