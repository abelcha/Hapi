// === BEGIN: KUE SETUP ===

var kue = require('kue');
var url = require('url');
require('./shared.js')();

global.isWorker = false;


try {
    var key = requireLocal('config/_keys');

    global.sms = new edison.ovh();
    global.isWorker = true;

    if (envProd ||  envStaging) {
        var redisUrl = url.parse(process.env.REDISCLOUD_URL);
    }
    redis.delWildcard("kue".envify() + '*', function() {

        var jobs = kue.createQueue({
            prefix: 'kue'.envify(),
            redis: envProd || envStaging ? {
                port: redisUrl.port,
                host: redisUrl.hostname,
                auth: redisUrl.auth.split(":")[1],
            } : undefined,
            disableSearch: false
        });

        jobs.process('db', function(job, done) {
            console.log('==>', job.data.model, job.data.method)
            var terminated = false
            global.currenWorkerJob = job;
            db.model(job.data.model)[job.data.method](job.data.req).then(function(result)  {
                terminated = true;
                done(null, result);
            }, function(err) {
                console.log(err.stack)
                console.log("job error", JSON.stringify(err, undefined, 1));
                return done(err ||  "error");
            })
        });

        jobs.process('stats', function(job, done) {
            job.inactive(function(err, ids) {
                // others are active, complete, failed, delayed
                // you may want to fetch each id to get the Job object out of it...
                console.log('-->', err, ids)
            });
            done();
        })

        jobs.process('test', 5, function(job, done) {
            console.log(job.id, 'LAUNCHED')
            setTimeout(function() {
                console.log(job.id, 'DONE')
                done(null)
            }, 2000)
        })

        jobs.process('db_id', function(job, done) {
            console.log(job)

            console.log('==>', job.data.model, job.data.method)
            db.model(job.data.model)[job.data.method].fn(job.data.data, job.data.req).then(function(result)  {
                done(null, result);
            }, function(err) {
                console.log("job error", err);
                console.log(err.stack)
                return done(err ||  "error");
            }).catch(__catch)
        });

    })

} catch (e) {
    __catch(e)
}
