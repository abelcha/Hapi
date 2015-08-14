// === BEGIN: KUE SETUP ===

var kue = require('kue');
var url = require('url');
global.requireLocal = function(pth) {
    return require(process.cwd() + '/' + pth)
}

global.__catch = function(e) {
    var prettyError = require('pretty-error');
    console.log((new prettyError().render(e)));
    throw e; 
}

global.envProd = process.env.NODE_ENV === "production";
global.envDev = process.env.NODE_ENV === "developement";
global.envStaging = process.env.NODE_ENV === "staging";
var dep = require(process.cwd() + '/server/loadDependencies');
global.edison = dep.loadDir(process.cwd() + "/server/edison_components");
global.redis = edison.redis();
global.document = new edison.dropbox();
global.mail = new edison.mail();
edison.extendPrototypes();

try {
    global.db = edison.db();

} catch (e) {
    console.log("err")
}
try {

var key = requireLocal('config/_keys');
global.sms = new edison.mobyt(key.mobyt.login, key.mobyt.pass);
global.isWorker = true;

if (envProd || envStaging) {
    var redisUrl = url.parse(envProd ? process.env.REDISTOGO_URL : process.env.REDISCLOUD_URL);
}
redis.keys("kue*", function(err, re) {
    re.forEach(function(k) {
        redis.del(k);
    });
});


var jobs = kue.createQueue({
    prefix: 'kue',
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
        console.log("job error", err.stack);
        return done(err ||  "error");
    }).catch(__catch)
});
} catch(e) {
    __catch(e)
}

