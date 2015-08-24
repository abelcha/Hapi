var _ = require('lodash')

module.exports = function(core) {
    return function(req, res) {
        return new Promise(function(resolve, reject) {
            core.model().find({}, {
                cache: true,
            }).then(function(resp) {
                var cache = JSON.stringify(_.pluck(resp, 'cache'));
                resp = null;
                redis.set(core.redisCacheListName.envify(), cache, function() {
                    resolve(cache)
                });
            }, reject).catch(__catch);
        })
    }
}
