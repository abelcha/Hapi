module.exports = function(req, res) {
	var _ = require('lodash')
	var regexpAccents = require('regexp-accents');
	var rgx = {
		$regex: regexpAccents(req.params.text, true, 'e', 'E')
	}
	var _int = parseInt(req.params.text) ||  0;
	console.log(rgx)
	var queries = [{
		'_id': _int
	}, {
		'client.nom': rgx,
	}, {
		'client.prenom': rgx,
	}, {
		'client.address.v': rgx,
	}, {
		'client.address.r': rgx,
	}, {
		'client.address.cp': rgx,
	}, {
		'client.telephone.tel1': rgx,
	}, {
		'client.telephone.tel1': rgx,
	}, {
		'client.telephone.tel3': rgx,
	}, {
		'comments': {
			$elemMatch: {
				text: rgx
			},
		}
	}, {
		'facture.nom': rgx,
	}, {
		'facture.prenom': rgx,
	}, {
		'artisan.id': _int,
	}, {
		'artisan.nomSociete': rgx,
	}, {
		'description': rgx,
	}, {
		'remarque': rgx,
	}]
	db.model('intervention').find({
		$or: queries
	}, {
		id: 1
	}).exec(function(err, resp) {
		console.log('-->', err, _.pluck(resp, 'id'))
	})
	res.send('ok')
}
