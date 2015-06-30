var Timer = module.exports = function() {
    var CronEmitter = require("cron-emitter").CronEmitter;

    this.emitter = new CronEmitter();

    this.emitter.add("*/10 * * * *", "every 10 minutes");
    this.emitter.add("*/120 * * * *", "every hour");
    this.emitter.add("*/5 * * * *", "every 5 minutes");
    this.emitter.add("*/2 * * * *", "every minute");

    /*    this.emitter.on("every 10 minutes", function() {
            edison.worker.createJob({
                name: 'db',
                model: 'intervention',
                method: 'cacheReload'
            })
        });*/

    this.emitter.on("every 5 minutes", function() {
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
            arg: 21000
        }).then(function() {
            edison.worker.createJob({
                name: 'db',
                model: 'devis',
                method: 'workerDump',
                arg: 21000
            })
        })
    })
}


Timer.prototype.test = function(cronString, iterations) {
    var parser = require('cron-parser');

    var interval = parser.parseExpression(cronString, {
        currentDate: new Date,
        iterator: true
    });
    for (var i = 0; i < 10; i++) {
        console.log(interval.next())
    };
}
