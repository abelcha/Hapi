module.exports = function() {
    var async = require('async');
    var key = requireLocal('config/_keys');
    var redis = require("redis");
    redis.RedisClient.prototype.delWildcard = function(key, callback) {
        var redis = this

        redis.keys(key, function(err, rows) {
            async.each(rows, function(row, callbackDelete) {
                redis.del(row, callbackDelete)
            }, callback)
        });
    }


    var redisClient;
    try {

        if (envProd || envStaging) {
            var url = require('url');
            var redisURL = url.parse(key.redisURL);
            redisClient = redis.createClient(redisURL.port, redisURL.hostname, {
                no_ready_check: true
            });

            redisClient.auth(redisURL.auth.split(":")[1]);

        } else {
            redisClient = redis.createClient();
        }


        redisClient.on("error", function(err) {
            console.log("Redis Error " + err);
        });

    } catch (e) {
        __catch(e);
    }
    return redisClient;
}
