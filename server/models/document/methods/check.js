   module.exports = function(schema) {
       var _ = require('lodash')
       var moment = require('moment')

       var convert = function(ts) {
           var dt = ts.replace('.', '-').split('-').slice(0, -4).join('-');
           var hr = ts.replace('.', '-').split('-').slice(3, 6).join(':');
           console.log(ts)
           return moment(dt + " " + hr).unix() * 1000
       }

       schema.statics.check = function(req, res) {

           var dbl = requireLocal('config/dropbox-list')

           dbl = _(dbl).filter(function(e) {
               return e.length === 23 && _.endsWith(e, '.pdf')
           }).map(function(e) {
               return {
                   name: e,
                   ts: convert(e)
               }
           }).value()

           edison.v1.get("SELECT * FROM scanner WHERE checked='0' LIMIT 10", function(err, resp)  {

           })




           /*          _.each(_.filter(dbl, 'length', 23).slice(0, 10), function(e) {
                             var cvt = convert(e);
                             var closest = findClosest(cvt, )
                             console.log('-->', cvt)
                         })*/
           res.send('okokd')
       }
   }
