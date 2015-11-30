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
        console.log('YES DATA', data && data.length)
        finalBuffer.push(data);
      }).on('end', function() {
        console.log('EN DATA')

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

          var gp = _.groupBy(resp, 'sst')
          async.eachLimit(gp, 1, function(sst, callback) {
            console.log('EACH')
            getPage(filepath, ++i, function(err, buffer) {
              console.log(err, buffer && buffer.length)
              async.eachLimit(sst, 1, function(e, small_cb) {
                console.log('/V2_DEV/intervention/' + e.id + '/' + 'Lettre-cheque-' + flush.numeroCheque + '.pdf')
                var flush = _.find(e.compta.paiement.historique, 'dateFlush', new Date(req.body.date));
                flush.numeroCheque = (_.find(req.body.ids, 'id', e.sst) || {}).numeroCheque
                document.upload({
                  filename: '/V2_DEV/intervention/' + e.id + '/' + 'Lettre-cheque-' + flush.numeroCheque + '.pdf',
                  data: buffer
                }).then(function(resp) {
                  e.save(small_cb)
                }, small_cb)

              }, function() {
                callback(null)
              })

            })

          }, function() {
            resolve('ok')
          })
        })
        resolve('ok')
      }).catch(__catch);
    }
   }
