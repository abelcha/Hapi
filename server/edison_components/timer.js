var Timer = module.exports = function() {
    var ms = require('milliseconds')
    var CronEmitter = require("cron-emitter").CronEmitter;
    var _ = require('lodash')
    var moment = require('moment')
    var hour = function(h) {
        var moment = require('moment-timezone')
        return moment.tz('Europe/Paris').hour(h).format('[0] H [* * *]')
    }

    this.emitter = new CronEmitter();

    //    this.emitter.add("*/10 * * * *", "every 10 minutes");
    //    this.emitter.add("*/120 * * * *", "every hour");
    //    this.emitter.add("*/5 * * * *", "every 5 minutes");
    // this.emitter.add("*/2 * * * *", "every minute");
    this.emitter.add(hour(18), "everyday at 20")
    this.emitter.add(hour(8), "everyday at 7")
    this.emitter.add(hour(14), "everyday at 14")
    this.emitter.add(hour(3), "3pm");
    this.emitter.add(hour(4), "4pm");
    this.emitter.add("*/60 * * * *", "hour")
    this.emitter.add("*/20 * * * *", "20 minutes")
    this.emitter.add("*/10 * * * *", "10 minutes")
    this.emitter.add("*/4 * * * *", "4 minutes")

    if (envProd) {


        this.emitter.on("everyday at 20", function() {
            if (moment().isoWeekday() !== 6 && moment().isoWeekday() !== 7) {
                db.model('intervention').relanceAuto();
            }
        });

        this.emitter.on("everyday at 7", function() {
            setTimeout(function() {
                if (moment().isoWeekday() !== 6 && moment().isoWeekday() !== 7) {
                    db.model('devis').relanceAuto7h()
                }
            }, _.random(ms.minutes(2), ms.minutes(10)))
        });


        this.emitter.on("everyday at 14", function() {
            setTimeout(function() {
                if (moment().isoWeekday() !== 6 && moment().isoWeekday() !== 7) {
                    db.model('devis').relanceAuto14h()
                }
            }, _.random(ms.minutes(2), ms.minutes(10)))

        });


        this.emitter.on("hour", function() {
            setTimeout(function() {

                db.model('intervention').rappelDateIntervention()
            }, _.random(ms.minutes(2), ms.minutes(10)))
        });

        this.emitter.on("4 minutes", function() {

            var req = {
                query: {}
            }
            setTimeout(function() {

                db.model('document').check(req).then(function() {
                    db.model('document').archiveScan(req).then(function() {
                        db.model('document').order(req).then(function() {})
                    })
                })
            }, _.random(ms.minutes(2), ms.minutes(10)))
        })
    }

    this.emitter.on("4pm", function() {
        db.model('intervention').backup(function() {})
    })

    this.emitter.on("hour", function() {
        setTimeout(function() {
            db.model('artisan').fullReload().then(function() {
                console.log('artisan ok')
            })
        }, _.random(ms.minutes(2), ms.minutes(10)))
    })

    this.emitter.on("10 minutes", function() {
        setTimeout(function() {

            db.model('intervention').fullReload().then(function() {})
            db.model('devis').fullReload().then(function() {})
        }, _.random(ms.minutes(2), ms.minutes(10)))
    })
    this.emitter.on("3pm", function() {
        redis.delWildcard("rs*")
    })



    var test = function() {
        var parser = require('cron-parser');
        try {
            var interval = parser.parseExpression("42 18 * * 6");
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
}
