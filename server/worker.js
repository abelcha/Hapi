// === BEGIN: KUE SETUP ===

var kue = require('kue');
var url = require('url');
var _ = require('lodash')
require('./shared.js')();
var cluster = require('cluster')

global.isWorker = false;


try {
    var key = requireLocal('config/_keys');

    global.sms = new edison.mobyt(key.mobyt.login, key.mobyt.pass);
    global.isWorker = true;

    if ((envProd ||  envStaging) &&  process.env.PLATFORM !== 'DIGITAL_OCEAN') {
        var redisUrl = url.parse(key.redisURL);
    }
    //    redis.delWildcard("kue".envify() + '*', function(err, resp) {

    var jobs = kue.createQueue({
        prefix: 'kue'.envify(),
        redis: (envProd || envStaging) &&  process.env.PLATFORM !== 'DIGITAL_OCEAN' ? {
            port: redisUrl.port,
            host: redisUrl.hostname,
            auth: redisUrl.auth.split(":")[1],
        } : undefined,
        disableSearch: false
    });


    console.log('FILDEPUTE')
    if (process.env.PLATFORM === 'DIGITAL_OCEAN' && cluster.isMaster) {
        console.log(process.pid, 'MASTER')
        kue.app.listen(3042);
        for (var i = 0; i < process.env.CLUSTER_PROCESS_NBR; i++) {
        console.log('FORK')

            cluster.fork();
        }
    } else {
        console.log(process.pid, 'SLAVE')
        var __log = function(_id, status, time, err) {
            db.model('event').update({
                'data._id': _id
            }, {
                $set: {
                    'data.status': status,
                    'data.time': time,
                    'data.error': err
                }
            }).then(function(err, resp) {

            })
        }

        var end = function() {
            var _this = this;
            return function(resp) {
                if (_this.done) {
                    totalTime = Date.now() - _this.timeStart;
                    console.log(process.pid, '[', 'DB', _this.data.model, _this.data.method, '][' + _this.id + '] - [OK] - <' + (totalTime / 1000) + '>')
                    clearTimeout(_this.timer);
                    __log(_this.data._id, 'OK', totalTime);
                    _this.done(null, resp)
                }
            }
        }


        var err = function() {
            var _this = this;
            return function(err) {
                if (_this.done) {
                    totalTime = Date.now() - _this.timeStart;
                    console.log(process.pid, '[', 'DB', _this.data.model, _this.data.method, '][' + _this.id + '] - [FAILED] - <' + (totalTime / 1000) + '>')
                    clearTimeout(_this.timer);
                    __log(_this.data._id, 'FAILED', totalTime, err);
                    _this.done(err);
                }
            }
        }

        var getTimer = function() {
            var _this = this;
            _this.timeStart = Date.now()
            return setTimeout(function() {
                console.log(process.pid, '[', 'DB', _this.data.model, _this.data.method, '][' + _this.id + '] - [TIMEOUT]')
                _this.done('[' + ' DB ' + _this.data.model + ' ' + _this.data.method + '][' + _this.id + '] -  [TIMEOUT]');
                _this.done = null;
            }, _this.data.ttl || 30000)
        }


        jobs.process('db', 5, function(job, done) {
            __log(job.data._id, 'PROCESSED');
            console.log(process.pid, '[', 'DB', job.data.model, job.data.method, '][' + job.id + '] - [LAUNCH]')
            job.done = done;
            job.timer = getTimer.bind(job)()
            db.model(job.data.model)[job.data.method](job.data.req)
                .then(end.bind(job)(), err.bind(job))
                .catch(__catch);

        });




        jobs.process('db_id', 5, function(job, done) {
            __log(job.data._id, 'PROCESSED');
            console.log(process.pid, '[', 'DB_ID', job.data.model, job.data.method, '][' + job.id + '] - [LAUNCH]')
            job.done = done;
            job.timer = getTimer.bind(job)()
            db.model(job.data.model)[job.data.method].fn(job.data.data, job.data.req)
                .then(end.bind(job)(), err.bind(job)())
                .catch(__catch);

        });




        var fn = function(options) {
            return new Promise(function(resolve, reject) {
                setTimeout(function() {
                    if (options.fail) {
                        options.qdds.QDS();
                    }
                    resolve('ok')
                }, options.time || 100);
            })
        }


        jobs.process('test', 3, function(job, done) {
            __log(job.data._id, 'PROCESSED');
            console.log(process.pid, '[', job.data.model, job.data.method, '][' + job.id + '] - [LAUNCH]')
            job.done = done;
            job.timer = getTimer.bind(job)()
            fn(job.data).then(end.bind(job)(), done)
        })
    }
    // })
} catch (e) {
    __catch(e)
}

process.on('uncaughtException', function(a, b, c) {
    console.log(process.pid, 'UNCAUGHTEXCEPTION')
        //   console.log(process.pid, a, b, c, 'okok')
});
