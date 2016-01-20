 module.exports = function(schema) {
     var _ = require('lodash')
     var moment = require('moment')
     var request = require('request')
     var async = require('async')


     schema.statics.verify = function(req, res) {

      

         var dbl = requireLocal('config/dropbox-list')
         console.log(dbl.SCAN.join("', '"))
         return res.send('ok')
         edison.v1.get("SELECT name FROM scanner WHERE moved='1' ", function(err, resp) {
             resp = _.map(resp, 'name');

             _.each(resp.slice(0, 10), function(e) {
                 var fnd = _.findIndex(dbl.SCAN, function(x) {
                     return x === e.name
                 })
             })
         })
     }
 }
