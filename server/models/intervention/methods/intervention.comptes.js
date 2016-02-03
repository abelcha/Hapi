module.exports = function(schema) {
  var _ = require('lodash')

  var getMonthRange = function(m, y) {
    var date = new Date(y, m);
    return {
      $gte: new Date(date.getFullYear(), date.getMonth(), 1, -1),
      $lt: new Date(date.getFullYear(), date.getMonth() + 1, 1)
    }
  }
  var clientMap = function(e) {
    return [
      '411CLT' + _.padLeft(e._id, 6, '0'),
      e.client.civilite,
      e.client.nom + ' ' + e.client.prenom,
      e.client.address.n,
      e.client.address.r,
      e.client.address.v,
      e.client.address.cp,
    ];
  }
  schema.statics.comptes = function(req, res) {
    var _this = this;
    var dateRange = getMonthRange(req.query.m - 1, req.query.y)
    return new Promise(function(resolve, reject) {
      var rtn = []
      if (req.query.download || req.query.ids_in) {
        res.contentType('text/csv');
        res.setHeader('Content-disposition', 'attachment; filename=' + "ComptesClients-" + req.query.m + '-' + req.query.y + ".txt");
      }

      var query = {
        'compta.reglement.recu': true,
        'compta.reglement.date': dateRange
      }
      if (req.query.ids_in) {
        var ids = req.query.ids_in.split(/[^0-9]/g).filter(function(e) {
            return /^\d+$/.test(e)
          })
          .map(function(e) {
            return parseInt(e, 10)
          });
        query = {
          id: {
            $in: ids
          }
        }
      }
      db.model('intervention').find(query)
      .select('client').stream()

        .on('data', function(e) {
          res.write(clientMap(e).join(';') + "\r\n")
        })
        .on('end', function() {
          res.end()
        })
    })
  }
}
