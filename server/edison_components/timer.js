var Timer = module.exports = function() {
    var CronEmitter = require("cron-emitter").CronEmitter;

    var hour = function(h) {
        var moment = require('moment-timezone')
        return moment.tz('Europe/Paris').format('[0] H [* * *]')
    }

    this.emitter = new CronEmitter();

    //    this.emitter.add("*/10 * * * *", "every 10 minutes");
    //    this.emitter.add("*/120 * * * *", "every hour");
    //    this.emitter.add("*/5 * * * *", "every 5 minutes");
    // this.emitter.add("*/2 * * * *", "every minute");
    this.emitter.add(hour(7), "everyday at 7")
    this.emitter.add(hour(14), "everyday at 14")
    this.emitter.add(hour(3), "3pm");
    this.emitter.add(hour(4), "4pm");
    this.emitter.add("*/60 * * * *", "30 minutes")
    this.emitter.add("*/20 * * * *", "20 minutes")

    /*    this.emitter.on("every 10 minutes", function() {
            edison.worker.createJob({
                name: 'db',
                model: 'intervention',
                method: 'cacheReload'
            })
        });*/


    this.emitter.on("everyday at 7", function() {
        db.model('devis').relanceAuto7h()
    });


    this.emitter.on("everyday at 14", function() {
        db.model('devis').relanceAuto14h()
    });


    this.emitter.on("30 minutes", function() {
        db.model('intervention').fullReload().then(function() {
            console.log('inter ok')
        })
        db.model('devis').fullReload().then(function() {
            console.log('devis ok')
        })
    })
    this.emitter.on("20 minutes", function() {

        var req = {
            query: {}
        }
        if (envProd) {
            db.model('document').check(req).then(function() {
                db.model('document').archiveScan(req).then(function() {
                    db.model('document').order(req).then(function() {
                        console.log('DocumentFullCheck [DONE]')
                    })
                })
            })
        }

    })
    this.emitter.on("3pm", function() {
        return sms.send({
            to: '0633138868',
            text: "DEL WILDCARD",
        })
        redis.delWildcard("rs*")
    })
    this.emitter.on("4pm", function() {
        db.model('intervention').backup(function() {
            console.log('backup [DONE]')
        })
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
                var interval = parser.parseExpression(hour(7));
                console.log('Date: ', interval.next().toString()); // Sat Dec 29 2012 00:44:00 GMT+0200 (EET) 
                console.log('Date: ', interval.next().toString()); // Sat Dec 29 2012 00:44:00 GMT+0200 (EET) 
                console.log('Date: ', interval.next().toString()); // Sat Dec 29 2012 00:44:00 GMT+0200 (EET) 
                console.log('Date: ', interval.next().toString()); // Sat Dec 29 2012 00:44:00 GMT+0200 (EET) 
                console.log('Date: ', interval.next().toString()); // Sat Dec 29 2012 00:44:00 GMT+0200 (EET) 
                console.log('Date: ', interval.next().toString()); // Sat Dec 29 2012 00:44:00 GMT+0200 (EET) 
            } catch (err) {
                console.log('Error: ' + err.message);
            }

        }
        //  test();


}
