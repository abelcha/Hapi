module.exports = function() {
    var async = require('async');
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
            //console.log('here')
            var url = require('url');
            var redisURL = url.parse(process.env.REDISTOGO_URL);
            redisClient = redis.createClient(redisURL.port, redisURL.hostname, {
                no_ready_check: true
            });
            var stack = new Error().stack
            console.log(stack)
                //console.log(redisClient)
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
