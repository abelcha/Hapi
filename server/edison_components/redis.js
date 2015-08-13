module.exports = function() {
    var redis = require("redis");
    var redisClient;
    console.log(envStaging, process.env.REDISTOGO_URL)
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

    return redisClient;
}
