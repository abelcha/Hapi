   module.exports = function(schema) {
       var _ = require('lodash')
       var moment = require('moment')
       var request = require('request')
       var async = require('async')



       schema.statics.order = function(req, res) {
           if (!isWorker) {
               return edison.worker.createJob({
                   name: 'db',
                   model: 'document',
                   method: 'order',
                   req: _.pick(req, 'query', 'session')
               })
           }

           return new Promise(function(resolve, reject) {
               var limit = req.query.limit || 100;
               var i = 0;
               edison.v1.get("SELECT * FROM scanner WHERE archived=1 AND moved=1 and ordered='0' LIMIT " + limit, function(err, resp) {
                   async.eachLimit(resp, 5, function(e, cb) {
                       //console.log('MV', '/SCAN_ARCHIVES/' + e.name, String(i++) + '/' + String(resp.length))
                       document.copy('/SCAN_ARCHIVES/' + e.name, '/V2_PRODUCTION/intervention/' + e.id_inter + '/' + e.name)
                           .then(function(resp) {
                               edison.v1.set("UPDATE scanner SET ordered='1' WHERE id='" + e.id + "'", function() {
                                   //console.log('ARCHIVED', e.name)
                                   cb(null)
                               })
                           }, function(err) {
                               //console.log('ERR <', e.name, err, '>')
                               if (_.includes(String(err), '403')) {
                                   edison.v1.set("UPDATE scanner SET ordered='1' WHERE id='" + e.id + "'", function() {
                                   //    console.log('ARCHIVED', e.name)
                                       cb(null)
                                   })
                               } else {
                                   cb(null);
                               }
                           });
                   }, function(err) {
                       resolve('ok')
                   })
               })
           })
       }
   }
