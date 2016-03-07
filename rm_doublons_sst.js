process.env.DB_NAME = "EDISON"
require('./server/shared.js')();
var async = require('async')
var tels = [];
db.model('artisan').find({
    nbrIntervention: {
      $gt: 0
    }
  })
  .sort('id')
  .stream()
  .on('data', function(data) {
    console.log('-->', data.id)
    db.model("intervention").count({
      'artisan.id': data.id,
      'compta.paiement.effectue': false,
      status: 'VRF'
    }).count(function(er, r) {
      console.log('==->', er, r)
      if (r === 0) {
        return 0;
      }
      console.log(data.id)
      db.model('artisan').update({
        id: data.id,
      }, {
        $set: {
          nbrComissionPotentiel: r
        }
      }, function(err, resp) {
        console.log('->', err, resp)
      })
    })
  })
  .on('end', function() {
    console.log('ok')
  })
