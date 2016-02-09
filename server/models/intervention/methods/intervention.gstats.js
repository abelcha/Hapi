module.exports = function(schema) {
  var _ = require('lodash')
  var momentIterator = require('moment-iterator')
  schema.statics.gstats = function(req, res) {
    db.model('intervention')
      .aggregate()
      .match({
        'compta.paiement.effectue': true
      })
      .group({
        _id: {
          px: '$compta.paiement.pourcentage.maindOeuvre',
          m: {
            $month: '$compta.paiement.date'
          },
          y: {
            $year: '$compta.paiement.date'
          },
        },
        sum: {
          $sum: '$prixFinal'
        },
        count: {
          $sum: 1
        }
      })
      .exec(function(err, resp) {

        resp = resp.map(function(e) {
          if (e._id.px <= 30) {
            e._id.px = '0-30';
          } else if (e._id.px <= 45) {
            e._id.px = '30-45';
          } else {
            e._id.px = '45-100';
          }
          return e
        })

        var keys = _(resp).groupBy('_id.px').map((e, k) => k).sort().value()
          // var rs = _(resp)
          //   .groupBy(e => new Date(e._id.y, e._id.m - 1, 15))
          //   //      .map(e => _.groupBy(e, '_id.px'))
          //   .value()

        var rtn = {};
        rtn.series = keys.map(function(key) {
          return {
            name: key,
            data: momentIterator(new Date(2013, 8, 14), new Date())
              .range('month')
              .map(function(x) {
                return _(resp).filter(function(e, k) {
                  return e._id.px === key && e._id.m === x.month() + 1 && e._id.y === x.year();
                }).reduce(function(total, n) {
                  return _.round(total + n.sum, 2)
                }, 0)
              })
          }
        })
        rtn.categories = momentIterator(new Date(2013, 8, 14), new Date()).range('month', {
          format:'MM/YY'
        })
        console.log('-->', rtn.dates)


        res.json(rtn);
      })
  }
}
