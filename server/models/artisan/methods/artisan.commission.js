module.exports = function(schema) {
  var async = require('async');
  var _ = require('lodash');
  var moment = require('moment');
  var momentIterator = require('moment-iterator');
  schema.statics.com = function(req, res) {
    db.model('artisan').find({
      nbrIntervention: {
        $lte: 20,
        $gt: 0
      },
      'date.ajout': {
        $gt: new Date(2015, 11, 1)
      }
    }, {
      status: 1,
      nbrIntervention: 1,
      nomSociete: 1
    }).then(function(resp) {
      var rtn = _(resp).groupBy('nbrIntervention')
        .value()
      var x = _.map(rtn, function(e, k) {
          return {
            nbrInter: k,
            total_actif: _.filter(e, 'status', 'ACT').length,
            total_archive: _.filter(e, 'status', 'ARC').length
          }
        })
        /*x = _.map(x, function(e) {
        	return (_.toArray(e))
        })*/
      res.xtable(x);
      //console.log(x)
    })
  }

  var dateThreeshold = moment().add(-1, "months").startOf('month').toDate()
  console.log(dateThreeshold)




  var getTableauComs = function(date, cb) {
    var includeRemainder = moment().isSame(date, 'month') //only include remainde if its the current month
    var _from = moment(date).startOf('month').toDate();
    var _to = moment(date).endOf('month').toDate();
    var i = 0;
    var rtn = []


    if (!includeRemainder) {
      var query = {
        'compta.paiement.effectue': true,
        $or: [{
          'compta.paiement.date': db.utils.between(_from, _to)
        }, {
          'date.commissionPartenariat': db.utils.between(_from, _to)
        }, {
          'compta.paiement.date': db.utils.between(new Date(2015, 0, 0), new Date(2016, 1, 0)),
          'artisan.id': {
            $in: [1821, 1987, 1950, 2004, 1903]
          },
        }]
      }
    } else {
      var query = {
        'compta.paiement.effectue': true,
        $or: [{
          'compta.paiement.date': db.utils.between(_from, _to)
        }, {
          'date.commissionPartenariat': {
            $exists: false
          },
          'compta.paiement.date': {
            $gt: dateThreeshold
          }
        }]
      }
    }
    console.log(JSON.stringify(query, null, 2))
    db.model('intervention').find(query)
      .select('id sst compta')
      .stream()
      .on('data', function(data)  {
        rtn.push(data);
        //console.log('-->', data.id, i++)
      })
      .on('error', function(err) {
        //  console.log("=>", err)
      })
      .on('end', function(end) {
        console.log('==>', rtn.length)
        var gp = _.groupBy(rtn, 'sst')
        async.mapLimit(gp, 1, function(e, cb) {
          var retainer = _.filter(e, function(x) {
            return !moment(x.compta.paiement.date).isBetween(_from, _to)
          }).length
          db.model('artisan').findById(e[0].sst)
            .then(function(resp) {
              cb(null, {
                login: resp.login.ajout,
                ajout: resp.date.ajout,
                ids: _.pluck(e, 'id'),
                nbr: e.length - retainer,
                retainer: retainer,
                com: Math.floor(e.length / 10),
                ceil: 10 - (e.length % 10),
                date: date,
                sst: resp.id,
                nomSociete: resp.nomSociete
              })
            })
        }, function(err, resp) {
          resp = _(resp).toArray()
            .filter(function(e) {
              return new Date(e.ajout) > dateThreeshold ||  _.includes([1821, 1987, 1950, 2004, 1903], e.sst);
            })
            .sortBy('nbr').reverse().value()
          cb(null, resp)
        })
      })

  }

  schema.statics.setCommission = function(req, res) {
    var _from = moment().add(-1, 'months').startOf('month').toDate();
    var _to = moment().add(-1, 'months').endOf('month').toDate();
    console.log(_from, _to)
    db.model('intervention').find({
      'compta.paiement.effectue': true,
      $or: [{
        'compta.paiement.date': {
          $lt: _to,
          $gt: _from
        }
      },/* {
        'artisan.id': {
          $in: [1821, 1987, 1950, 2004, 1903]
        },
        'compta.paiement.date': {
          $gt: new Date(2015, 11, 0),
          $lt: new Date(2016, 0, 0),
        }
      }*/]
    }).then(function(resp) {
        console.log('-->', resp.length)
        try {

          var toUpdate = _(resp).groupBy('sst')
            .filter(function(e, k) {
              return e.length >= 10
            })
            .map(function(e) {
              var nbrToUpd = _.floor(e.length / 10) * 10
              console.log('==>', e[0].artisan.nomSociete, nbrToUpd, _(e).slice(0, nbrToUpd).pluck('id').value().length)
              return _(e).slice(0, nbrToUpd).pluck('id').value()
            })
            .flatten()
            .value()
        } catch (e) {
          console.log('=>', e)
        }
        console.log('==>', toUpdate)
        var query = {
          id: {
            $in: toUpdate
          }
        }
        var set = {
          $set: {
            'date.commissionPartenariat': moment().add('-4', 'days').toDate()
          }
        }
        var multi = {
          multi: true
        }
        db.model('intervention').update(query, set, multi).then(function(resp) {
          console.log('=>', resp)
        })
      },
      function(err) {
        console.log('ERR', err)
      })
  }

  schema.statics.tableauCom = function(req, res) {
    var range = momentIterator(dateThreeshold, new Date()).range('months')
      //  console.log(range)
    async.mapLimit(range, 1, getTableauComs, function(err, resp) {
        //console.log(resp);
        res.json(resp);
      })
      // getTableauComs(moment().add(-1, 'months').toDate(), function(err, resp) {
      //   console.log(err, resp)
      // })
  }
}
