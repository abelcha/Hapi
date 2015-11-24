module.exports = {
    initJobQueue: function() {
        var kue = require("kue");
        var key = requireLocal('config/_keys');

        var url = require("url");
        if (envProd || envStaging) {
            var redisURL = url.parse(key.redisURL);
            var redisOptions = {
                port: redisURL.port,
                host: redisURL.hostname,
                auth: redisURL.auth.split(":")[1],
            }
        }
        return kue.createQueue({
            prefix: 'kue'.envify(),
            redis: redisOptions ||  undefined,
            disableSearch: false
        })
    },
    createJob: function(options) {
        return new Promise(function(resolve, reject) {
            var job = jobs
                .create(options.name, options)
                .removeOnComplete(true)
                .priority(options.priority || 'normal')
                .ttl(2)
                .on('complete', resolve)
                .on('failed', reject)
                .on('progress', function(progress, data) {
                    io.sockets.emit(options.model + "_" + options.name + '_' + options.method, progress);
                }).save()
        })
    }
}
