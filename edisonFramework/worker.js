module.exports = {
  initJobQueue: function() {
    var kue = require("kue");
    var url = require("url");
    if (envProd) {
      var redisURL = url.parse(process.env.REDISCLOUD_URL);
      var redisOptions = {
        port: redisURL.port,
        host: redisURL.hostname,
        auth: redisURL.auth.split(":")[1],
      }
    }
    return kue.createQueue({
      prefix: 'kue',
      redis: redisOptions ||  undefined,
      disableSearch: false
    })
  },
  createJob: function(options) {
    return new Promise(function(resolve, reject) {
      var job = jobs.create(options.name, options);
      job.on('complete', resolve).on('failed', reject)
        .on('progress', function(progress) {
          console.log('job ' + options.name + ' ' + progress + '% complete');
        });
      job.removeOnComplete(true).ttl(10000).save()
        //return db.model('intervention').cacheReload()
    })
  }
}
