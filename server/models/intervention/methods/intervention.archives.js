module.exports = function(schema) {
  var config = requireLocal('config/dataList')
  var _ = require('lodash')
  var async = require('async')
  var moment = require('moment')

  schema.statics.archivePaiement = function(req, res) {
    var _this = this;
    return new Promise(function(resolve, reject) {
      db.model('intervention').aggregate().match({
          'compta.paiement.effectue': true,
        })
        .unwind("compta.paiement.historique")
        .group({
          _id: {
            d: '$compta.paiement.historique.dateFlush'
          }
        }).exec(function(err, resp) {
          resp = _.uniq(resp, function(e) {
            return (new Date(e._id.d)).getTime()
          });
          resolve(_.map(resp, function(e) {
            return {
              timestamp: (new Date(e._id.d)).getTime(),
              date: (new Date(e._id.d)),
            }
          }))
        })
    })
  };

  schema.statics.archiveReglement = function(req, res) {

    var _this = this;
    return new Promise(function(resolve, reject) {
      db.model('intervention')
        .aggregate()
        .match({
          'compta.reglement.date': {
            $exists: true
          },
          'compta.reglement.recu': true
        })
        .group({
          _id: {
            yr: {
              $year: '$compta.reglement.date',

            },
            mth: {
              $month: '$compta.reglement.date',
            }
          },
          date: {
            $first: '$compta.reglement.date'
          }
        })

      .exec(function(err, docs) {
        if (err) {
          return reject(err)
        }
        resolve(docs)

      });

    })
  }



}
