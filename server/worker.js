// === BEGIN: KUE SETUP ===

var kue = require('kue');
var url = require('url');
var _ = require('lodash')
require('./shared.js')();

global.isWorker = false;


try {
    var key = requireLocal('config/_keys');

    global.sms = new edison.ovh();
    global.isWorker = true;

    if (envProd ||  envStaging) {
        var redisUrl = url.parse(key.redisURL);
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


        var end = function(done, timer) {
            var _this = this;
            return function(resp) {
                if (_this.done) {
                    totalTime = Date.now() - _this.timeStart;
                    console.log('[', 'DB', _this.data.model, _this.data.method, '] OK - [' + (totalTime / 1000) + ']')
                    clearTimeout(_this.timer);
                    _this.done(null, resp)
                }
            }
        }

        var getTimer = function() {
            var _this = this;
            _this.timeStart = Date.now()
            return setTimeout(function() {
                console.log('[', 'DB', _this.data.model, _this.data.method, '] TIMEOUT')
                _this.done('[' + ' DB ' + _this.data.model + ' ' + _this.data.method + '] TIMEOUT');
                _this.done = null;
            }, 52000)
        }


        jobs.process('db', 5, function(job, done) {
            console.log('[', 'DB', job.data.model, job.data.method, '] LAUNCH')
            job.done = done;
            job.timer = getTimer.bind(job)()
            db.model(job.data.model)[job.data.method](job.data.req)
                .then(end.bind(job)(), done)
                .catch(__catch);

        });


        var fn = function() {
            return new Promise(function(resolve, reject) {
                setTimeout(function() {
                    resolve('okokokgoogoogo')
                }, 100);
            })
        }



        jobs.process('db_id', 5, function(job, done) {
            console.log('[', 'DB_ID', job.data.model, job.data.method, '] LAUNCH')
            job.done = done;
            job.timer = getTimer.bind(job)()
            db.model(job.data.model)[job.data.method].fn(job.data.data, job.data.req)
                .then(end.bind(job)(), done)
                .catch(__catch);

        });



        jobs.process('test', 3, function(job, done) {
            console.log('[', 'TEST', job.data.model, job.data.method, '] LAUNCH')
            job.done = done;
            job.timer = getTimer.bind(job)()
            fn().then(end.bind(job)(), done)
                .catch(__catch);
        })

    })

} catch (e) {
    __catch(e)
}
