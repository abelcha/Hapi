// === BEGIN: KUE SETUP ===

var kue = require('kue');
var url = require('url');
var CronJob = require('cron').CronJob;
var humanToCron = require('human-to-cron');


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


/*new CronJob("* * * * *", function() {
  db.model('sms').refreshStatus().then();
}, null, true, "America/Los_Angeles");
*/



jobs.process('db', function(job, done) {
  var terminated = false
    //  console.log(job.data.model, job.data.method, db.model(job.data.model)[job.data.method])
  db.model(job.data.model)[job.data.method]().then(function(result)  {
    terminated = true;
    console.log("ok")
    done(null, result);
  }, function(err) {
    terminated = true;
    console.log("error:", err);
    return done(err ||  "error");
  })
  setTimeout(function() {
    console.log(terminated);
    if (!terminated)
      return done("timed out");
  }, 60000);
});
