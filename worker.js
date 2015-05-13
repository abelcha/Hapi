// === BEGIN: KUE SETUP ===

var kue = require('kue');
var url = require('url');
var agenda = require('agenda')

global.requestp = require("request-promise")

global.envProd = process.env.NODE_ENV === "production";
global.envDev = process.env.NODE_ENV === "developement";
var dep = require('./loadDependencies');
global.edison = dep.loadDir("edisonFramework");
global.rootPath = process.cwd();
global.redis = edison.redis();
global.db = edison.db();
global.sms = new edison.mobyt(edison.config.mobytID, edison.config.mobytPASS);



var redisUrl = url.parse(process.env.REDISCLOUD_URL);

redis.keys("kue*", function(err, re) {
  re.forEach(function(k) {
    redis.del(re, function() {});
  })
})

var jobs = kue.createQueue({
  prefix: 'kue',
  redis: envProd ? {
    port: redisUrl.port,
    host: redisUrl.hostname,
    auth: redisUrl.auth.split(":")[1],
  } : undefined,
  disableSearch: true
});

var agenda = new agenda({
  db: {
    address: 'localhost:27017/EDISON' || edison.config.localDB
  }
});

agenda.define('refresh sms status', function(job, done) {
  console.log("refresh sms status");
  db.model('sms').refreshStatus().then(done, done);
});

agenda.every('5 minutes', 'refresh sms status');
agenda.start();





jobs.process('db', function(job, done) {
  console.log("gotjob")
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
