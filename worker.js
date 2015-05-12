// === BEGIN: KUE SETUP ===
var kue = require('kue'),
  url = require('url'),
  redis = require('redis');

var redisUrl = url.parse(process.env.REDISCLOUD_URL);

var jobs = kue.createQueue({
  prefix: 'q',
  redis: {
    port: redisUrl.port,
    host: redisUrl.hostname,
    auth: redisUrl.auth.split(":")[1],
    options: {
      // look for more redis options in [node_redis](https://github.com/mranney/node_redis)
    }
  },
  disableSearch: true
});
// === END: KUE SETUP ===

// see https://github.com/learnBoost/kue/ for how to do more than one job at a time
jobs.process('crawl', function(job, done) {
  for (var i = 0; i < 100000; i++) {
    if (i % 10000 === 0)
     console.log(i / 5000);
    for (var j = 0; j < i; j++) {};
  };
  return done();
});
