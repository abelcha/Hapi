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


        var __log = function(_id, status, time) {
            db.model('event').update({
                'data._id': _id
            }, {
                $set: {
                    'data.status': status,
                    'data.time': time
                }
            }).then(function(err, resp) {

            })
        }

        var end = function() {
            var _this = this;
            return function(resp) {
                if (_this.done) {
                    totalTime = Date.now() - _this.timeStart;
                    console.log('[', 'DB', _this.data.model, _this.data.method, '][' + _this.id + '] - [OK] - <' + (totalTime / 1000) + '>')
                    clearTimeout(_this.timer);
                    __log(_this.data._id, 'OK', totalTime);
                    _this.done(null, resp)
                }
            }
        }

        var getTimer = function() {
            var _this = this;
            _this.timeStart = Date.now()
            return setTimeout(function() {
                console.log('[', 'DB', _this.data.model, _this.data.method, '][' + _this.id + '] - [TIMEOUT]')
                _this.done('[' + ' DB ' + _this.data.model + ' ' + _this.data.method + '][' + _this.id + '] -  [TIMEOUT]');
                _this.done = null;
            }, _this.data.ttl || 52000)
        }


        jobs.process('db', 5, function(job, done) {
            __log(job.data._id, 'PROCESSED');
            console.log('[', 'DB', job.data.model, job.data.method, '][' + job.id + '] - [LAUNCH]')
            job.done = done;
            job.timer = getTimer.bind(job)()
            db.model(job.data.model)[job.data.method](job.data.req)
                .then(end.bind(job)(), done)
                .catch(__catch);

        });


        var fn = function(options) {
            return new Promise(function(resolve, reject) {
                setTimeout(function() {
                    resolve('okokokgoogoogo')
                }, options.time || 100);
            })
        }



        jobs.process('db_id', 5, function(job, done) {
            __log(job.data._id, 'PROCESSED');
            console.log('[', 'DB_ID', job.data.model, job.data.method, '][' + job.id + '] - [LAUNCH]')
            job.done = done;
            job.timer = getTimer.bind(job)()
            db.model(job.data.model)[job.data.method].fn(job.data.data, job.data.req)
                .then(end.bind(job)(), done)
                .catch(__catch);

        });



        jobs.process('test', 3, function(job, done) {
            __log(job.data._id, 'PROCESSED');
            console.log('[', job.data.model, job.data.method, '][' + job.id + '] - [LAUNCH]')
            job.done = done;
            job.timer = getTimer.bind(job)()
            fn(job.data).then(end.bind(job)(), done)
                .catch(__catch);
        })

    })

} catch (e) {
    __catch(e)
}
