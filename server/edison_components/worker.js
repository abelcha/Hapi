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

        var uuid = require('uuid');
        var _ = require('lodash')
        return new Promise(function(resolve, reject) {
            options._id = uuid.v4();
            options.status = "LAUNCHED"
            edison.event('WORKER_JOB')
                .login(_.get(options, 'session.login'))
                .data(options)
                .save()
            var job = jobs
                .create(options.name, options)
                .removeOnComplete(true)
                .attempts(options.attempts || 3)
                .priority(options.priority || 'normal')
                .on('complete', resolve)
                .on('failed', reject)
                .on('progress', function(progress, data) {
                    io.sockets.emit(options.model + "_" + options.name + '_' + options.method, progress);
                }).save()
        })
    }
}
