'use strict'
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

        var getList = function(resolve, reject) {
            if (!reloadCache)  {
                redis.get('interventionList', function(err, reply) {
                    if (!err && reply) { // we just want to refresh the cache 
                        res.send(reply)
                    } else {
                        return getCache(resolve, reject);
                    }
                });
            } else {
                return getCache(resolve, reject);
            }
        }
        return new Promise(getList);
    };

}
