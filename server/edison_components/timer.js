var Timer = module.exports = function() {
    var CronEmitter = require("cron-emitter").CronEmitter;

    this.emitter = new CronEmitter();

    //    this.emitter.add("*/10 * * * *", "every 10 minutes");
    //    this.emitter.add("*/120 * * * *", "every hour");
    //    this.emitter.add("*/5 * * * *", "every 5 minutes");
    // this.emitter.add("*/2 * * * *", "every minute");
    this.emitter.add("0 3 * * *", "midnight");
    this.emitter.add("*/10 * * * *", "10 minutes")
        /*    this.emitter.on("every 10 minutes", function() {
                edison.worker.createJob({
                    name: 'db',
                    model: 'intervention',
                    method: 'cacheReload'
                })
            });*/

    this.emitter.on("10 minutes", function() {
        db.model('intervention').getCache()
            .then(function() {
                console.log('cache reloaded')
                db.model('intervention').stats().then(function() {
                    console.log('stats reloaded');
                })
            })
    })


    this.emitter.on("midnight", function() {
        console.log('midnight');
        redis.delWildcard("rs*")
    })

    /*    this.emitter.on("every 5 minutes", function() {
            edison.worker.createJob({
                name: 'db',
                model: 'sms',
                method: 'refreshStatus'
            })
        })
        this.emitter.on("every hour", function() {
            edison.worker.createJob({
                name: 'db',
                model: 'intervention',
                method: 'workerDump',
                arg: 25000
            }).then(function() {
                edison.worker.createJob({
                    name: 'db',
                    model: 'devis',
                    method: 'workerDump',
                    arg: 25000
                })
            })
        })*/
    var test = function(cronString, iterations) {
        console.log('sweg')
        var parser = require('cron-parser');

        var interval = parser.parseExpression(cronString, {
            currentDate: new Date,
            iterator: true
        });
        for (var i = 0; i < 10; i++) {
            console.log(interval.next())
        };

    }



}
