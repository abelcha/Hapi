module.exports = function(schema) {
  var async = require('async');
  var _ = require('lodash');
  var moment = require('moment');
  var momentIterator = require('moment-iterator');


  var stepQuery = {
    nbrIntervention: {
      $exists: true,
      $gt: 0
    },
    $or: [
      {
        id: {
          $in: [1821, 1987, 1950, 2004, 1903, 1990, 1901, 1993, 1910, 1981, 2020, 2014, 2007, 1989, 1986,
              1978, 1945, 1940, 2012]
        }
        },
      {
        'date.ajout': {
          $gt: new Date(2016, 0, 0)
        }
      }
      ]
  }

  schema.statics.getStep = function(req, res) {

    db.model('artisan').find(stepQuery, function(err, resp) {
      var result = _.map(resp, function(e) {
        var rtn = {
          nbrComissionImpaye: e.nbrComissionImpaye,
          nbrComissionPaye: e.nbrComissionPaye,
          nomSociete: e.nomSociete,
          nbrIntervention: e.nbrIntervention,
          id: e.id
        }
        rtn.totalPaye = e.nbrComissionPaye - e.nbrComissionPaye % 10
        rtn.totalImpaye = e.nbrComissionImpaye + (e.nbrComissionPaye % 10)
        rtn.step = _.floor(rtn.totalImpaye / 10)
        return rtn;
      })
      if (!req.query.download) {
        res.json(result)
      }
      var rs = result.map((e) => _.values(e))
      rs.unshift(_.keys(result[0]))
      res.contentType('text/csv');
      res.setHeader('Content-disposition', 'attachment; filename=' + "commissionPartenariat-" + new Date()+ ".csv");
      res.send(rs.map(e => e.join(';')).join('\n'))
    })

  }


  schema.statics.setStep = function(req, res) {
    var rtn = [];
    var date = moment().add(-1, 'months').startOf('month').toDate();
    db.model('artisan').find(stepQuery).select('_id')
      .stream()
      .on('data', function(e) {




        db.model('intervention').count({
          sst: e._id,
          'compta.paiement.effectue': true,
          'compta.paiement.date': {
            $gte: date
          }
        }).count(function(err, resp) {
          var _this = this;
          _this.nbrComissionImpaye = resp;
          db.model('artisan').update({
            _id: e._id
          }, {
            $set: {
              nbrComissionImpaye: _this.nbrComissionImpaye
            }
          }, function(err, resp) {
            console.log('==>', e._id, err, resp, _this.nbrComissionImpaye)
          })
        })





        db.model('intervention').count({
          sst: e._id,
          'compta.paiement.effectue': true,
          'compta.paiement.date': {
            $lt: date
          }
        }).count(function(err, resp) {
          var _this = this;
          _this.nbrStep = _.floor(resp / 10)
          _this.nbrComissionPaye = resp;
          db.model('artisan').update({
            _id: e._id
          }, {
            $set: {
              nbrStep: _this.nbrStep,
              nbrComissionPaye: _this.nbrComissionPaye
            }
          }, function(err, resp) {
            console.log('==>', e._id, err, resp, _this.nbrComissionPaye, _this.nbrStep)
          })
        })

      })






    .on('end', function(e) {
      return res.send('ok')
    })
  }
}
