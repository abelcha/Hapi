var Timer = module.exports = function() {
    var CronEmitter = require("cron-emitter").CronEmitter;

    var hour = function(h) {
        var moment = require('moment-timezone')
        return moment.tz('Europe/Paris').hour(h).format('[0] H [* * *]')
    }

    this.emitter = new CronEmitter();

    //    this.emitter.add("*/10 * * * *", "every 10 minutes");
    //    this.emitter.add("*/120 * * * *", "every hour");
    //    this.emitter.add("*/5 * * * *", "every 5 minutes");
    // this.emitter.add("*/2 * * * *", "every minute");
    this.emitter.add(hour(20), "everyday at 20")
    this.emitter.add(hour(7 - 1), "everyday at 7")
    this.emitter.add(hour(14 - 1), "everyday at 14")
    this.emitter.add(hour(3), "3pm");
    this.emitter.add(hour(4), "4pm");
    this.emitter.add("*/60 * * * *", "hour")
    this.emitter.add("*/20 * * * *", "20 minutes")
    this.emitter.add("*/10 * * * *", "10 minutes")

    if (envProd) {

        this.emitter.on("everyday at 20", function() {
            db.model('intervention').relanceAuto();
        });

        this.emitter.on("everyday at 7", function() {
            db.model('devis').relanceAuto7h()
        });


        this.emitter.on("everyday at 14", function() {
            db.model('devis').relanceAuto14h()
        });


        this.emitter.on("hour", function() {
            db.model('intervention').rappelDateIntervention()
        });

        this.emitter.on("20 minutes", function() {

            var req = {
                query: {}
            }
            db.model('document').check(req).then(function() {
                db.model('document').archiveScan(req).then(function() {
                    db.model('document').order(req).then(function() {
                        console.log('DocumentFullCheck [DONE]')
                    })
                })
            })

        })
    }

    this.emitter.on("4pm", function() {
        db.model('intervention').backup(function() {
            console.log('backup [DONE]')
        })
    })

    this.emitter.on("hour", function() {
        setTimeout(function() {
            db.model('artisan').fullReload().then(function() {
                console.log('artisan ok')
            })
        }, _.random(30000, 60000))
    })

    this.emitter.on("10 minutes", function() {
        db.model('intervention').fullReload().then(function() {
            console.log('inter ok')
        })
        db.model('devis').fullReload().then(function() {
            console.log('devis ok')
        })
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
        //   test();


}
