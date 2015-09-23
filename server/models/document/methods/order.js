   module.exports = function(schema) {
       var _ = require('lodash')
       var moment = require('moment')
       var request = require('request')
       var async = require('async')



       schema.statics.order = function(req, res) {
           return new Promise(function(resolve, reject) {
               edison.v1.get("SELECT * FROM scanner WHERE archived=1 AND moved=1 LIMIT 10", function(err, resp) {
                   console.log(err, resp)
               })
           })
       }
   }
