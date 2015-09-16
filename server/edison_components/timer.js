var Timer = module.exports = function() {
    var CronEmitter = require("cron-emitter").CronEmitter;

    this.emitter = new CronEmitter();

    //    this.emitter.add("*/10 * * * *", "every 10 minutes");
    //    this.emitter.add("*/120 * * * *", "every hour");
    //    this.emitter.add("*/5 * * * *", "every 5 minutes");
    // this.emitter.add("*/2 * * * *", "every minute");
    this.emitter.add("0 3 * * *", "3pm");
    this.emitter.add("0 20 * * *", "20h");
    this.emitter.add("*/60 * * * *", "30 minutes")
        /*    this.emitter.on("every 10 minutes", function() {
                edison.worker.createJob({
                    name: 'db',
                    model: 'intervention',
                    method: 'cacheReload'
                })
            });*/
    this.emitter.on("30 minutes", function() {
        db.model('intervention').fullReload().then(function() {
            console.log('inter ok')
        })
        db.model('devis').fullReload().then(function() {
            console.log('devis ok')
        })
    })
/*
    this.emitter.on("20h", function() {
        redis.delWildcard("rs*")
    })
*/
    this.emitter.on("3pm", function() {
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
    var test = function() {
        var parser = require('cron-parser');
        try {
            var interval = parser.parseExpression("0 20 * * *");
            console.log('Date: ', interval.next().toString()); // Sat Dec 29 2012 00:42:00 GMT+0200 (EET) 
            console.log('Date: ', interval.next().toString()); // Sat Dec 29 2012 00:44:00 GMT+0200 (EET) 
            console.log('Date: ', interval.next().toString()); // Sat Dec 29 2012 00:44:00 GMT+0200 (EET) 
            console.log('Date: ', interval.next().toString()); // Sat Dec 29 2012 00:44:00 GMT+0200 (EET) 
        } catch (err) {
            console.log('Error: ' + err.message);
        }

    }
    test();



}
