   module.exports = function(schema) {
     var _ = require('lodash')
     var moment = require('moment-timezone')
     var request = require('request')
     var async = require('async')

     var convert = function(ts, offset) {
       var dt = ts.replace('.', '-').split('-').slice(0, -4).join('-');
       var hr = ts.replace('.', '-').split('-').slice(3, 6).join(':');
       return moment.tz(dt + " " + hr, 'Europe/Paris').unix() * 1000 + (offset || 0)
     }


     schema.statics.test = function(req, res) {
       try {
         var req = {}
         if (moment().hour() > 7 && moment().hour() < 21) {
           db.model('document').check(req).then(function() {
             db.model('document').archiveScan(req).then(function() {
               db.model('document').order(req).then(function() {})
             })
           })
         }
       } catch (e) {
         console.log(e)
       }
     }

     schema.statics.checkChecked = function(req, res) {
       edison.v1.get('SELECT COUNT(*) FROM scanner WHERE checked=1', function(err, resp) {
         res.json([err, resp])
       });
     }


     var findClosest = function(x, dbl) {
       var min = {
         diff: Math.pow(9, 9)
       }
       _.each(dbl, function(e) {
         e.diff = e.ts - x.start;
         if (Math.abs(e.diff) < Math.abs(min.diff)) {
           min = e;
         }
       })
       if ((min.diff > 0 && min.diff < 15000) || (min.diff < 0 && min.diff > -1000)) {
         return min
       }
       return null
     }


     var moveV1 = function(closest, cb) {
       request.get({
         url: 'http://electricien13003.com/alvin/5_Gestion_des_interventions/mvFile.php',
         qs: {
           file: '/SCAN/' + closest.name
         }
       }, function(err, resp, body) {
         cb(err, body)
       })
     }


     schema.statics.check = function(req, res) {



       if (!isWorker) {
         return edison.worker.createJob({
           name: 'db',
           model: 'document',
           method: 'check',
           req: _.pick(req, 'query', 'session')
         })
       }




       return new Promise(function(resolve, reject) {
           console.log('heererere')
           document.list('/SCAN').then(function(dbl) {
             dbl = _(dbl).filter(function(e) {
               return e.length === 23 && _.endsWith(e, '.pdf') && e[4] === '-'
             }).map(function(e) {
               return {
                 name: e,
                 ts: convert(e, 0)
               }
             }).value();

             console.log('>>>', dbl)
             var i = 0;
             var limit = req && req.query.limit || 100;
             edison.v1.get("SELECT * FROM scanner WHERE moved='0' AND checked='0' ORDER BY id ASC LIMIT " +
               limit,
               function(err, resp)  {
                 console.log('--===============>', resp.length)
                 limit = resp.length;
                 async.eachLimit(resp, 20, function(row, cb) {
                   //     console.log(String(i++) + '/' + String(limit))
                   var closest = findClosest(row, dbl)
                   if (closest) {
                     var mrg = _.merge(row, closest)
                     moveV1(closest, function(err, resp) {
                       if (err || !resp) {
                         //console.log("ERR", '<', err, ">", mrg.name, mrg.id);
                         return cb(null, 'ERR')
                       }
                       var q = _.template(
                         "UPDATE scanner SET diff='{{diff}}', name='{{name}}', checked='1',  moved='1' WHERE id='{{id}}'"
                       )(mrg)
                       edison.v1.set(q, function(err, resp) {
                         cb(null, 'ok')
                       })
                     })
                   } else {
                     edison.v1.set(_.template("UPDATE scanner SET checked='0' WHERE id='{{id}}'")(row),
                       cb)
                   }
                 }, function(resp) {
                   resolve('ok');
                 })
               })
           }, function(err) {
             console.log('-->', err)
           })
         })
         .catch(__catch);



       /*          _.each(_.filter(dbl, 'length', 23).slice(0, 10), function(e) {
                         var cvt = convert(e);
                         var closest = findClosest(cvt, )
                         console.log('-->', cvt)
                     })*/
     }
   }
