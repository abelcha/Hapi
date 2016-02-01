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

  var getTableauComs = function(date, cb) {

    var _from = moment(date).startOf('month').toDate();
    var _to = moment(date).endOf('month').toDate();
    var i = 0;
    var rtn = []
    db.model('intervention').find({
        'compta.paiement.effectue': true,
        'compta.paiement.date': db.utils.between(_from, _to)
      })
      .select('id sst')
      .stream()
      .on('data', function(data)  {
        rtn.push(data);
        //  console.log('-->', data.id, i++)
      })
      .on('error', function(err) {
        //  console.log("=>", err)
      })
      .on('end', function(end) {
        var gp = _.groupBy(rtn, 'sst')
        async.mapLimit(gp, 1, function(e, cb) {
          db.model('artisan').findById(e[0].sst)
            .then(function(resp) {
              //  console.log('-->', resp && resp.id)
              cb(null, {
                ids: _.pluck(e, 'id'),
                nbr: e.length,
                com: Math.floor(e.length / 10),
                ceil: 10 - (e.length % 10),
                date: date,
                sst: resp.id,
                nomSociete: resp.nomSociete
              })
            })
        }, function(err, resp) {
          resp = _(resp).toArray().sortBy('nbr').reverse().value()
          cb(null, resp)
        })
      })

  }

  schema.statics.tableauCom = function(req, res) {
    var range = momentIterator(moment().startOf('year').toDate(), new Date()).range('months')
    var rtn = async.mapLimit(range, 1, getTableauComs, function(err, resp) {
        res.json(resp);
      })
      // getTableauComs(moment().add(-1, 'months').toDate(), function(err, resp) {
      //   console.log(err, resp)
      // })
  }
}
