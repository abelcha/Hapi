require('./server/shared.js')();

var tels = [];

db.model('artisan').find({}, {
		'telephone': 1
	}).stream()
	.on('data', function(data) {
		console.log('-->', data.nomSociete)
		if (data.telephone.tel1) {
			tels.push(data.telephone.tel1)
		}
		if (data.telephone.tel2) {
			tels.push(data.telephone.tel2)
		}
	})
	.on('end', function() {
		console.log(tels)

		db.model('intervention').update({
			'client.telephone.tel1': {
				$in: tels
			}
		}, {
			$set: {
				'client.telephone.tel1': '0000000000'
			}
		}, {
			multi: true
		}, function(err, resp) {
			console.log('-->', err, resp)
		})
		db.model('intervention').update({
			'client.telephone.tel2': {
				$in: tels
			}
		}, {
			$set: {
				'client.telephone.tel2': '0000000000'
			}
		}, {
			multi: true
		}, function(err, resp) {
			console.log('-->', err, resp)
		})
		db.model('intervention').update({
			'client.telephone.tel3': {
				$in: tels
			}
		}, {
			$set: {
				'client.telephone.tel3': '0000000000'
			}
		}, {
			multi: true
		}, function(err, resp) {
			console.log('-->', err, resp)
		})
	})
