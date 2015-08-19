// === BEGIN: KUE SETUP ===

var kue = require('kue');
var url = require('url');
require('./shared.js')();

global.isWorker = false;


try {

    var key = requireLocal('config/_keys');
    global.sms = new edison.mobyt(key.mobyt.login, key.mobyt.pass);
    global.isWorker = true;

    if (envProd ||  envStaging) {
        var redisUrl = url.parse(process.env.REDISTOGO_URL);
    }
    redis.delWildcard("kue".envify() + '*', function() {

        var jobs = kue.createQueue({
            prefix: 'kue'.envify(),
            redis: envProd || envStaging ? {
                port: redisUrl.port,
                host: redisUrl.hostname,
                auth: redisUrl.auth.split(":")[1],
            } : undefined,
            disableSearch: true
        });

        jobs.process('db', function(job, done) {
            var terminated = false
            console.log(job.data.model, job.data.method)
            db.model(job.data.model)[job.data.method](job.data.arg).then(function(result)  {
                terminated = true;
                console.log("job success")
                done(null, result);
            }, function(err) {
                console.log("job error", JSON.stringify(err, undefined, 1));
                return done(err ||  "error");
            })
        });


        jobs.process('db_id', function(job, done) {
            console.log(job.data.model, job.data.method)
            db.model(job.data.model)[job.data.method].fn(job.data.data, job.data.req).then(function(result)  {
                console.log("job success")
                done(null, result);
            }, function(err) {
                console.log("job error", err);
                return done(err ||  "error");
            }).catch(__catch)
        });

    })

} catch (e) {
    __catch(e)
}
