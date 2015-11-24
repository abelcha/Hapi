module.exports = {
    initJobQueue: function() {
        var kue = require("kue");
        var url = require("url");
        if (envProd || envStaging) {
            var redisURL = url.parse(process.env.REDISCLOUD_URL);
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
            console.log('[LAUNCH JOB]')
            var job = jobs.create(options.name, options);
            console.log('[JOB LAUNCHED]')
            job.on('complete', resolve).on('failed', reject).on('progress', function(progress, data) {
                io.sockets.emit(options.model + "_" + options.name + '_' + options.method, progress);
            });
            job.removeOnComplete(true).priority(options.priority || 'normal').ttl(50000).save()
        })
    }
}
