   module.exports = function(schema) {
       var _ = require('lodash')
       var moment = require('moment')
       var request = require('request')
       var async = require('async')
       var fs = require('fs')

       var getPage = function(filepath, page, cb) {
           var fs = require('fs')
           var scissors = require('scissors');
           var finalBuffer = [];
           var stream = scissors(filepath).pages(page).pdfStream()
           stream.on('data', function(data) {
               console.log('DATA')
               finalBuffer.push(data);
           }).on('end', function() {
               console.log('END')
               return cb(null, Buffer.concat(finalBuffer))
           })
       }

       schema.statics.uploadScans = function(req, res) {
           return new Promise(function(resolve, reject) {
               if (!req.files || !req.files.file || !req.files.file.buffer || !req.files.file.extension) {
                   return reject("Invalid File");
               }
               if (req.files.file.size > 5000000)
                   return reject("File is too big");


               var fs = require('fs')
               var uuid = require('uuid')
               var filepath = '/tmp/' + uuid.v4() + '.pdf';
               fs.writeFileSync(filepath, req.files.file.buffer);



               req.body.ids = JSON.parse(req.body.ids)
               req.body.date = JSON.parse(req.body.date)
               db.model('intervention').find({
                       sst: {
                           $in: _.pluck(req.body.ids, 'id')
                       },
                       'compta.paiement.historique': {
                           $elemMatch: {
                               dateFlush: req.body.date,
                               mode: 'CHQ'
                           }
                       }
                   }).then(function(resp) {
                       var i = 0;


                       async.eachLimit(resp, 5, function(e, callback) {
                               var flush = _.find(e.compta.paiement.historique, 'dateFlush', new Date(req.body.date));
                               flush.numeroCheque = (_.find(req.body.ids, 'id', e.sst) || {}).numeroCheque
                               getPage(filepath, ++i, function(err, buffer) {
                                   console.log('-->uauau')
                                   console.log(err, buffer)
                                   document.upload({
                                       filename: '/V2_PRODUCTION/intervention/' + e.id + '/' + 'lettre-cheque-' + moment(req.body.date).format('LL') + '.pdf',
                                       data: buffer
                                   }).then(function(resp) {
                                       console.log('ok upload')
                                       callback(null)
                                   }, callback)
                               })

                           }, function() {
                               resolve('ok')
                           })
                           /* var flush = _.find(resp, function(e) {
                                console.log(e.dateFlush, req.body.date)
                                return false;
                            });
                            console.log('==>', flush)*/
                   })
                   //console.log(req.body)
                   //console.log(req.files)
                   //fs.writeFileSync(req.files.file.buffer, '~/xxx.pdf')



               resolve('ok')
           }).catch(__catch);
       }
   }
