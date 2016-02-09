require('./server/shared.js')();

var tels = [];
isWorker = true;

db.model('intervention')
	.aggregate()
	.match({
		'compta.paiement.effectue': true
	})
	// .group({
	// 	_id: {
	// 		m: {
	// 			$month: '$compta.paiement.date'
	// 		},
	// 		y: {
	// 			$year: '$compta.paiement.date'
	// 		},
	// 	},
	// 	lol: {
	// 		$avg: '$compta.paiement.pourcentage.maindOeuvre',
	// 	},
	// 	count: {
	// 		$sum: 1
	// 	}

	// })
	.exec(function(err, resp) {
		console.log("->", err, resp)
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
