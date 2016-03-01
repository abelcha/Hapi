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
  this.emitter.add(hour(6), "everyday at 6")
  this.emitter.add(hour(14), "everyday at 14")
  this.emitter.add(hour(3), "3pm");
  this.emitter.add(hour(0), "midnight");
  this.emitter.add(hour(4), "4pm");
  this.emitter.add("*/60 * * * *", "hour")
  this.emitter.add("*/20 * * * *", "20 minutes")
  this.emitter.add("*/10 * * * *", "10 minutes")
  this.emitter.add("*/4 * * * *", "4 minutes")
  this.emitter.add("*/10 * * * *", "10 minutes")
  this.emitter.add("0 0 1 * *", "start of month")

  if (envProd) {

    this.emitter.on("start of month", function() {
       db.model('artisan').setCommission()
       db.model('artisan').relanceFinDeMois()
    })

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
        if (moment().hour() > 7 && moment().hour() < 21) {
          db.model('intervention').rappelDateIntervention()
        }
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


    this.emitter.on("10 minutes", function() {

      var req = {
        query: {}
      }
      setTimeout(function() {
        console.log('REFRESH')
        db.model('conversation').refresh().then(function(resp) {
          console.log('CONVERSATION===>', resp)
        })
      })
    })

  }

  this.emitter.on("hour", function() {
    setTimeout(function() {
      db.model('artisan').fullReload().then(function() {
        console.log('artisan ok')
      })
    }, _.random(ms.minutes(2), ms.minutes(10)))
  })

  this.emitter.on("everyday at 6", function() {
    setTimeout(function() {
      db.model('intervention').vcf2().then(function() {})
      db.model('devis').vcf2().then(function() {})
      db.model('artisan').vcf2().then(function() {})
    }, _.random(ms.minutes(2), ms.minutes(10)))
  });




  this.emitter.on("20 minutes", function() {
    db.model('intervention').update({
      'cache.f.i_avr': 1,
      'cache.s': 0
    }, {
      $set: {
        'cache.s': 3
      }
    }, {
      multi: true
    }, function(a, b) {
      console.log(a, b)
      db.model('intervention').fullReload().then(function() {})
      db.model('devis').fullReload().then(function() {})
    })
  })
  this.emitter.on("3pm", function() {
    redis.delWildcard("rs*")
  })

  this.emitter.on("midnight", function() {
    var exec = require('child_process').exec;
    exec("node db_dump.js", function(error, stdout, stderr) {
      console.log(error, stdout, stderr);
    });
  })
  console.log('ookok')


  var test = function(exp) {
      var parser = require('cron-parser');
      var interval = parser.parseExpression(exp);
      console.log('Date: ', interval.next().toString()); // Sat Dec 29 2012 00:44:00 GMT+0200 (EET)
      console.log('Date: ', interval.next().toString()); // Sat Dec 29 2012 00:44:00 GMT+0200 (EET)
      console.log('Date: ', interval.next().toString()); // Sat Dec 29 2012 00:44:00 GMT+0200 (EET)
      console.log('Date: ', interval.next().toString()); // Sat Dec 29 2012 00:44:00 GMT+0200 (EET)
      console.log('Date: ', interval.next().toString()); // Sat Dec 29 2012 00:44:00 GMT+0200 (EET)
      console.log('Date: ', interval.next().toString()); // Sat Dec 29 2012 00:44:00 GMT+0200 (EET)
    }
    //  test("0 0 0 * *")
}
