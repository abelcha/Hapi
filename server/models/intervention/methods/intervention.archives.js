module.exports = function(schema) {
  var config = requireLocal('config/dataList')
  var _ = require('lodash')
  var async = require('async')
  var moment = require('moment')
  var csv = require('express-csv')

  schema.statics.getList = function(match) {
      return new Promise(function(resolve, reject) {
        db.model('intervention')
          .aggregate()
          .match(match ||  {})
          .unwind("compta.paiement.historique")
          .project({
            'compta': true,
            'artisan': true,
            'id': true,
            'categorie': true
          })
          .exec(function(err, docs) {
            var x = _.groupBy(docs, 'compta.paiement.historique.dateFlush')
            x = _(x).map(function(e, k) {
                return {
                  date: k,
                  timestamp: (new Date(k)).getTime(),
                  list: _.groupBy(e, 'artisan.id')
                }
              }).value()
              // console.log(x)
            resolve(x)
          })
      })
    }
    /*db.sales.aggregate(
       [
          {
            $group : {
               _id : { month: { $month: "$date" }, day: { $dayOfMonth: "$date" }, year: { $year: "$date" } },
               totalPrice: { $sum: { $multiply: [ "$price", "$quantity" ] } },
               averageQuantity: { $avg: "$quantity" },
               count: { $sum: 1 }
            }
          }
       ]
    )*/


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
            console.log(e);
            return e._id.d.getTime()
          });
          resolve(_.map(resp, function(e) {
            return {
              timestamp: (new Date(e._id.d)).getTime(),
              date: (new Date(e._id.d)),
            }
          }))
        })
        /* redis.get("ARCHIVE_PAIEMENT".envify(), function(err, reply) {
             if (!err && reply && !req.query.cache) {
                 return resolve(JSON.parse(reply));
             }
             db.model('intervention').getList({
                 'compta.paiement.effectue': true,
             }).then(function(resp) {
                 console.log('here')
                 console.log(docs)
                 redis.set("ARCHIVE_PAIEMENT".envify(), JSON.stringify(docs), function() {
                 console.log('hss')
                     resolve(resp);
                 });
             }, reject)
         })*/
    })
  };

  schema.statics.archiveReglement = function(req, res) {

    var _this = this;
    return new Promise(function(resolve, reject) {
      db.model('intervention')
        .aggregate()
        .match({
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
        resolve(docs)

      });

    })
  }



}
