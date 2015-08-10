// === BEGIN: KUE SETUP ===

var kue = require('kue');
var url = require('url');
global.requireLocal = function(pth) {
    return require(process.cwd() + '/' + pth)
}

global.envProd = process.env.NODE_ENV === "production";
global.envDev = process.env.NODE_ENV === "developement";
var dep = require(process.cwd() + '/server/loadDependencies');
global.edison = dep.loadDir(process.cwd() + "/server/edison_components");
global.redis = edison.redis();
global.db = edison.db();
var key = requireLocal('config/_keys');
global.sms = new edison.mobyt(key.mobyt.login,key.mobyt.pass);
global.isWorker = true;

if (envProd) {
    var redisUrl = url.parse(process.env.REDIS_URL);
}


redis.keys("kue*", function(err, re) {
    re.forEach(function(k) {
        redis.del(k);
    });
});


var jobs = kue.createQueue({
    prefix: 'kue',
    redis: envProd ? {
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
