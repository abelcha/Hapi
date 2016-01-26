require('./server/shared.js')();

var tels = [];
isWorker = true;
db.model('artisan').find({

	}).stream()
	.on('data', function(data) {
		db.model('intervention').count({
			'sst': data.id,
			'compta.reglement.recu': true
		}).count(function(e, nbrIntervention) {
			data.nbrIntervention = nbrIntervention;
			console.log(data.nomSociete, nbrIntervention)
			data.save(function(e) {
				console.log(data.id, '[OK]')
			})
		})
	})
	.on('end', function() {
	})
