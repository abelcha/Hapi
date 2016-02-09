var ms = require('milliseconds')
var _ = require('lodash')
var moment = require('moment')
var Timer = module.exports = function() {
  var schedule = require('node-schedule');

  var DEFAULT_DELAY_VALUE = 10

  var eventList = [];
  var everydayAt = function(hour, delay, fn) {
    var moment = require('moment-timezone')
    if (!fn && _.isFunction(delay)) {
      fn = delay
      delay = DEFAULT_DELAY_VALUE
    }
    if (delay === false) {
      delay = 0;
    }

    var cronString = moment.tz('Europe/Paris').hour(hour).format('[0] H [* * *]');

    var parser = require('cron-parser');
    var interval = parser.parseExpression(cronString);


    eventList.push({
      nextDate: [
        interval.next().toString(),
        interval.next().toString(),
      ],
      cronString: cronString,
      name: fn.name,
      fn: fn,
      delay: ms.minutes(delay)
    })
  }


  var everyMinutes = function(minute, fn) {

    var cronString = '*/' + minute + ' * * * *'

    var parser = require('cron-parser');
    var interval = parser.parseExpression(cronString);


    eventList.push({
      nextDate: [
        interval.next().toString(),
        interval.next().toString(),
      ],
      name: fn.name,
      cronString: cronString,
      fn: fn,
      delay: 0
    })
  }




  this.setTimer = function() {

    _.each(eventList, function(ev) {
      console.log(ev.fn.name, ev.nextDate[0]);
      schedule.scheduleJob(ev.cronString, function() {
        console.log('JOB [' + ev.fn.name + ']')
        if (ev.delay) {

          // mail.send({
          //   noBCC: true,
          //   From: "intervention@edison-services.fr",
          //   To: 'abel.chalier@gmail.com',
          //   Subject: "[EVENT-TRIGGER] - " + ev.fn.name,
          //   HtmlBody: "<body>hello world</body>",
          // });
        }
        setTimeout(ev.fn, ev.delay)
      });
    })
  }







  if (envProd ||  envDev) {
    //
    // this.emitter.on("start of month", function() {
    //    db.model('artisan').setCommission()
    //    db.model('artisan').relanceFinDeMois()
    // })



    // this.emitter.on("everyday at 6", function() {
    //   setTimeout(function() {
    //     db.model('intervention').vcf2().then(function() {})
    //     db.model('devis').vcf2().then(function() {})
    //     db.model('artisan').vcf2().then(function() {})
    //   }, _.random(ms.minutes(2), ms.minutes(10)))
    // });



    everydayAt(5, function envoiVCFArtisan() {
      db.model('artisan').vcf2().then(function() {

      })
    })

    everydayAt(5, function envoiVCFDevis() {
      db.model('devis').vcf2().then(function() {

      })
    })


    everydayAt(5, function envoiVCFIntervention() {
      db.model('intervention').vcf2().then(function() {

      })
    })






    //
    // this.emitter.on("everyday at 7", function() {
    //   setTimeout(function() {
    //     if (moment().isoWeekday() !== 6 && moment().isoWeekday() !== 7) {
    //       db.model('devis').relanceAuto7h()
    //     }
    //   }, _.random(ms.minutes(2), ms.minutes(10)))
    // });

    everydayAt(8, function relancesDevisMatin() {
      if (moment().isoWeekday() !== 6 && moment().isoWeekday() !== 7) {
        db.model('devis').relanceAuto7h()
      }
    })




    //
    // this.emitter.on("everyday at 14", function() {
    //   setTimeout(function() {
    //     if (moment().isoWeekday() !== 6 && moment().isoWeekday() !== 7) {
    //       db.model('devis').relanceAuto14h()
    //     }
    //   }, _.random(ms.minutes(2), ms.minutes(10)))
    //
    // });

    everydayAt(14, function relancesDevisApresMidi() {
      if (moment().isoWeekday() !== 6 && moment().isoWeekday() !== 7) {
        db.model('devis').relanceAuto14h()
      }
    })



    //
    // this.emitter.on("everyday at 20", function() {
    //   if (moment().isoWeekday() !== 6 && moment().isoWeekday() !== 7) {
    //     db.model('intervention').relanceAuto();
    //   }
    // });


    everydayAt(18, function relancesClients() {
      if (moment().isoWeekday() !== 6 && moment().isoWeekday() !== 7) {
        db.model('intervention').relanceAuto();
      }
    })


    // this.emitter.on("3pm", function() {
    //   redis.delWildcard("rs*")
    // })
    //
    // this.emitter.on("midnight", function() {
    //   var exec = require('child_process').exec;
    //   exec("node db_dump.js", function(error, stdout, stderr) {
    //     console.log(error, stdout, stderr);
    //   });
    // })

    everydayAt(0, function dumpDB() {
      var exec = require('child_process').exec;
      exec("node db_dump.js", function(error, stdout, stderr) {
        console.log(error, stdout, stderr);
      });
    })




    // this.emitter.on("hour", function() {
    //   setTimeout(function() {
    //     if (moment().hour() > 7 && moment().hour() < 21) {
    //       db.model('intervention').rappelDateIntervention()
    //     }
    //   }, _.random(ms.minutes(2), ms.minutes(10)))
    // });


    everyMinutes(60, function rappelDateIntervention() {
      if (moment().hour() > 7 && moment().hour() < 21) {
        db.model('intervention').rappelDateIntervention()
      }
    })





    //
    // this.emitter.on("4 minutes", function() {
    //
    //   var req = {
    //     query: {}
    //   }
    //   setTimeout(function() {
    //
    //     db.model('document').check(req).then(function() {
    //       db.model('document').archiveScan(req).then(function() {
    //         db.model('document').order(req).then(function() {})
    //       })
    //     })
    //   }, _.random(ms.minutes(2), ms.minutes(10)))
    // })
    //


    everyMinutes(15, function scanCheck() {
      var req = {

      }

      if (moment().hour() > 7 && moment().hour() < 21) {
        db.model('document').check(req).then(function() {
          db.model('document').archiveScan(req).then(function() {
            db.model('document').order(req).then(function() {})
          })
        })
      }
    })






    //
    // this.emitter.on("10 minutes", function() {
    //
    //   var req = {
    //     query: {}
    //   }
    //   setTimeout(function() {
    //     console.log('REFRESH')
    //     db.model('conversation').refresh().then(function(resp) {
    //       console.log('CONVERSATION===>', resp)
    //     })
    //   })
    // })

    everyMinutes(10, function conversationCheck() {
      if (moment().hour() > 7 && moment().hour() < 21) {
        db.model('conversation').refresh().then(function(resp) {})
      }
    })



  }


  //
  //
  // this.emitter.on("20 minutes", function() {
  //   db.model('intervention').update({
  //     'cache.f.i_avr': 1,
  //     'cache.s': 0
  //   }, {
  //     $set: {
  //       'cache.s': 3
  //     }
  //   }, {
  //     multi: true
  //   }, function(a, b) {
  //     console.log(a, b)
  //     db.model('intervention').fullReload().then(function() {})
  //     db.model('devis').fullReload().then(function() {})
  //   })
  // })
  //


  everyMinutes(20, function artisanFullReload() {
    db.model('artisan').fullReload().then(function() {})
  })

  everyMinutes(20, function artisanFullReload() {
    db.model('intervention').fullReload().then(function() {})
  })


  everyMinutes(20, function artisanFullReload() {
    db.model('devis').fullReload().then(function() {})
  })

  everyMinutes(20, function updateAVR() {
    if (moment().hour() > 7 && moment().hour() < 21) {
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
      })
    }
  })


  // console.log('ookok')
  //
  //
  // var test = function(exp) {
  //     var parser = require('cron-parser');
  //     var interval = parser.parseExpression(exp);
  //     console.log('Date: ', interval.next().toString()); // Sat Dec 29 2012 00:44:00 GMT+0200 (EET)
  //     console.log('Date: ', interval.next().toString()); // Sat Dec 29 2012 00:44:00 GMT+0200 (EET)
  //     console.log('Date: ', interval.next().toString()); // Sat Dec 29 2012 00:44:00 GMT+0200 (EET)
  //     console.log('Date: ', interval.next().toString()); // Sat Dec 29 2012 00:44:00 GMT+0200 (EET)
  //     console.log('Date: ', interval.next().toString()); // Sat Dec 29 2012 00:44:00 GMT+0200 (EET)
  //     console.log('Date: ', interval.next().toString()); // Sat Dec 29 2012 00:44:00 GMT+0200 (EET)
  //   }
  //   //  test("0 0 0 * *")




}
