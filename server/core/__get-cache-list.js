    module.exports = function(core) {
        return function(req, res) {
            new Promise(function(resolve, reject) {
                redis.get(core.redisCacheListName.envify(), function(err, reply) {
                    console.log('--->', reply.length)
                    if (!reply || err) {
                        reject('no cache list')
                    }
                    res.jsonStr(reply)
                })
            })
        }
    }
