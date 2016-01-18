require('./server/shared')()
var _ = require('lodash')
var xmap = function(e) {
	try {
		var rtn = {
			login_ajout: e.login.ajout,
			categorie: e.categorie,
			heure_intervention: new Date(e.date.intervention).getHours(),
			heure_ajout: new Date(e.date.ajout).getHours(),
			departement: parseInt(e.client.address.cp.slice(0, 2)),
			facture: !e.reglementSurPlace,
			civilite: e.client.civilite,
			sst_subStatus: _.get(e, 'artisan.subStatus', null),
			sst_id: _.get(e, 'artisan.id', null),
			sst_origin: _.get(e, 'artisan.origin', null),
			distance: _.get(e, 'artisan.stats.direction.distance', null)
		};
		rtn.distance = rtn.distance && parseFloat(rtn.distance.slice(0, -3))
		return rtn;
	} catch (err) {
		console.log(err)
	}

}

db.model('intervention')
	.find({
		status: {
			$in: ['ANN', 'VRF']
		},
		id: {
			$gt: 39500
		}
	})
	.stream()
	.on('data', function(data)  {
		console.log('-->', data.id)
		db.model('event').findOne({
			id: data.id,
			type: 'NEW_INTERVENTION'
		}).select([
			'data.date',
			'data.client.civilite',
			'data.client.address.v',
			'data.client.address.cp',
			'data.reglementSurPlace',
			'data.categorie',
			'data.login.ajout',
			'data.artisan'
		].join(' ')).then(function(resp) {
			console.log('-->', xmap(resp.data))
		})
	})
