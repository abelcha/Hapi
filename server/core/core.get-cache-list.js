    module.exports = function(core) {
        return function(req, res) {
            new Promise(function(resolve, reject) {
                var hashname = core.redisCacheListName.envify()
                var CHUNK_SIZE = 50
                var _ = require('lodash')
                var async = require('async')
                var doShit = function(chunk, k) {
                    return function(callback) {
                        redis.hmget(hashname, chunk, function(err, resp) {
                            callback(err,_.compact(resp));
                        })
                    }
                }
                redis.hlen(hashname, function(err, len) {
                    len = len + 5000
                    var chunks = _.chunk(_.range(1, len), len / CHUNK_SIZE);
                    chunks = chunks.map(doShit);
                    console.time('GETDATALIST')
                    async.parallel(chunks, function(err, resp) {
                        console.timeEnd('GETDATALIST')
                        if (!err && resp) {
                            res.jsonStr('[' + _.flatten(resp).join(',') + ']');
                        } else {
                            res.sendStatus(400).send('failure')
                        }
                    })
                })
            })
        }
    }
