require('dotenv').config();
require('./server/shared.js')();
var _ = require('lodash')
var tels = [];

db.model('intervention')
  .aggregate()
  .match({
    'compta.paiement.effectue': true
  })
  .group({
    _id: {
      m: {
        $month: '$compta.paiement.date'
      },
      y: {
        $year: '$compta.paiement.date'
      },
    },
    average: {
      $avg: '$compta.paiement.pourcentage.maindOeuvre',
    },
    count: {
      $sum: 1
    }
  })
  .group({
    _id: {
      px: '$compta.paiement.pourcentage.maindOeuvre',
    }
  })
  .exec(function(err, resp) {
    var rs = _.groupBy(resp, (e) => new Date(e._id.y, e._id.m - 1, 15))
    console.log(JSON.stringify(rs, undefined, 2))
    process.exit()
  })


// db.model('artisan').find({
//     'date.ajout': {
//       $gt: new Date(2015, 11, 1)
//     },
//     'nbrIntervention': {
//       $gt: 10
//     },
//   }).stream()
//   .on('data', function(data) {
// 		console.log('ok')
//     db.model('intervention').find({
//       'sst': data.id,
//       'compta.reglement.recu': true
//     }).then(function(resp) {
//       console.log('==>', data.id, data.nomSociete, resp.length)
//     })
//   })
//   .on('end', function() {
//     console.log('DONE')
//   })
