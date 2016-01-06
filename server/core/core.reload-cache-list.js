var _ = require('lodash')

module.exports = function(core) {
    return function(req, res) {
        var hashname = core.redisCacheListName.envify()
        return new Promise(function(resolve, reject) {
            core.model().find({}, {
                cache: true,
            }).sort({
                id: -1
            }).limit(100000).then(function(resp) {
                var prn = [hashname];
                redis.del(hashname, function(err) {
                    _.each(resp, function(e) {
                        prn.push(String(e._id))
                        prn.push(JSON.stringify(e.cache));
                    })
                    redis.hmset(prn, function(err, res) {
                        resolve('ok')
                    });
                })
            }, reject)
        }).catch(__catch);
    }
}
