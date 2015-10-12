   module.exports = function(schema) {
       var _ = require('lodash')
       var moment = require('moment')
       var request = require('request')
       var mime = require("mime")
       var async = require('async')



       schema.statics.preview = function(req, res) {
           var path = require('path')
           return new Promise(function(resolve, reject) {
               document.get('V2_PRODUCTION/' + req.query.name, function(err, resp) {
                   if (err) return reject(err)
                   var extension = path.extname(req.query.name)
                   var contentType = mime.lookup(extension);
                   res.contentType(contentType);
                   res.send(resp);
                   resolve('ok')
               })
           })
       }
   }
