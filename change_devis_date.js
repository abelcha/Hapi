require('./server/shared.js')();

var tels = [];
isWorker = true;
db.model('artisan').find({
    'date.ajout': {
      $gt: new Date(2015, 11, 1)
    },
    'nbrIntervention': {
      $gt: 10
    },
  }).stream()
  .on('data', function(data) {
		console.log('ok')
    db.model('intervention').find({
      'sst': data.id,
      'compta.reglement.recu': true
    }).then(function(resp) {
      console.log('==>', data.id, data.nomSociete, resp.length)
    })
  })
  .on('end', function() {
    console.log('DONE')
  })
