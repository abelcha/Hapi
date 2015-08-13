'use strict'
module.exports = function(schema) {

    schema.statics.list = function(req, res) {
        var reloadCache = (req && req.query && req.query.cache);

        var getWorkerCache = function(resolve, reject) {
            return edison.worker.createJob({
                name: 'db',
                model: 'intervention',
                method: 'cacheReload'
            }).then(resolve, reject);
        }

        var getList = function(resolve, reject) {
            if (!reloadCache)  {
                redis.get('interventionList', function(err, reply) {
                    if (!err && reply) { 
                        res.json(JSON.parse(reply))
                    } else {
                        return getWorkerCache(resolve, reject);
                    }
                });
            } else {
                return getCache(resolve, reject);
            }
        }
        return new Promise(getList);
    };

}
