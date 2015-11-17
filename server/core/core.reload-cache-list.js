var _ = require('lodash')

module.exports = function(core) {
    return function(req, res) {
        return new Promise(function(resolve, reject) {
            console.log(core.model().find)
            core.model().find({}, {
                cache: true,
            }).sort({
                id: -1
            }).then(function(resp) {
                var cache = JSON.stringify(_.pluck(resp, 'cache'));
                resp = null;
                redis.set(core.redisCacheListName.envify(), cache, function() {
                    resolve(cache)
                });
            }, reject)
        }).catch(__catch);
    }
}
