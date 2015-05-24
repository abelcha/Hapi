// === BEGIN: KUE SETUP ===

var kue = require('kue');
var url = require('url');

global.requestp = require("request-promise")

global.envProd = process.env.NODE_ENV === "production";
global.envDev = process.env.NODE_ENV === "developement";
var dep = require('./loadDependencies');
global.edison = dep.loadDir("edisonFramework");
global.rootPath = process.cwd();
global.redis = edison.redis();
global.db = edison.db();
global.sms = new edison.mobyt(edison.config.mobytID, edison.config.mobytPASS);
global.isWorker = true;


var redisUrl = url.parse(process.env.REDISCLOUD_URL);

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
    db.model(job.data.model)[job.data.method]().then(function(result)  {
        terminated = true;
        console.log("job success")
        done(null, result);
    }, function(err) {
        console.log("job error", err);
        return done(err ||  "error");
    })
});
