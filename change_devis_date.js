require('./server/shared.js')();

var tels = [];
isWorker = true;
db.model('devis').find({
		id: {
			$gt: 38000
		}
	}).stream()
	.on('data', function(data) {
		console.log('-->', data.id)
		data.date.ajout = new Date(new Date(data.date.ajout).getTime() - 24 * 60 * 60 * 1000)
		data.save(function(err) {
			console.log(!err, data.id)
		})
	})
	.on('end', function() {
	})
