//process.env.MONGOLAB_URI = 'mongodb://heroku_app33756489:hrkm1jfvok3i2hsopg9t99jvvd@ds041981-a0.mongolab.com:41981'

require('./server/shared.js')();
var fs = require('fs');
var path = require('path');
var _ = require('lodash')

var d2015 = new Date(2015, 8, 0, 0);

console.log(d2015)

/*

db.model('intervention').find({
	'date.ajout': {
		$gt: d2015
	},
	'status':'ANN'
}, {
	'client.address': 1
}).then(function(resp) {
	lol = _.map(resp, function(e) {
		return ({
			lt: e.client.address.lt,
			lg: e.client.address.lg
		})
	})

	console.log(lol)
	process.exit
})

return 0;*/

db.model('intervention')
	.aggregate()
	.match({
		'date.ajout': {
			$gt: d2015
		},
	})
	.project({
		_id: 0,
		id: 1,
		status: 1,
		sst: 1,
		artisan: 1,
		ann: {
			$cond: [{
				$eq: ['$status', 'ANN']
			}, 1, 0]
		},
		all: {
			$cond: [{
				$ne: ['$status', 'toto']
			}, 1, 0]
		}
	})
	.group({
		_id: '$artisan.nomSociete',
		ann: {
			$sum: '$ann'
		},
		all: {
			$sum: '$all'
		},
	})
	.exec(function(err, resp) {
		//resp = _.sortBy(resp, 'total').reverse()
		resp = _.map(resp, function(e) {
			return {
				nom: e._id,
				ratio: _.round(e.ann / e.all, 2)
			}
		})
		resp = _

		_.each(resp, function(e) {
			console.log(e.ratio.toFixed(2) +' - ' + e.nom)
		})
		process.exit()
	})
