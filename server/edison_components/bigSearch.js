var interQuery = function(rgx, _int, callback) {
	return function(callback) {

		var queries = [{
			'_id': _int
		}, {
			'client.nom': rgx,
		}, {
			'client.prenom': rgx,
		}, {
			'client.email': rgx,
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
			'produits': {
				$elemMatch: {
					title: rgx
				}
			}
		}, {
			'facture.nom': rgx,
		}, {
			'facture.prenom': rgx,
		}, {
			'facture.email': rgx,
		}, {
			'facture.address.v': rgx,
		}, {
			'facture.address.r': rgx,
		}, {
			'facture.address.cp': rgx,
		}, {
			'facture.tel1': rgx,
		}, {
			'facture.tel1': rgx,
		}, {
			'description': rgx,
		}, {
			'remarque': rgx,
		}]
		db.model('intervention').find({
			$or: queries
		}, {
			'id': 1,
			'client.nom': 1,
			'client.prenom': 1,
			'client.civilite': 1,
			'date.intervention': 1,
			'artisan.nomSociete': 1,
			'artisan.id': 1,
			'status': 1,
			'categorie': 1,

		}).limit(1000).exec(callback)
	}
}


var devisQuery = function(rgx, _int) {
	return function(callback) {
		var queries = [{
			'_id': _int
		}, {
			'client.nom': rgx,
		}, {
			'client.prenom': rgx,
		}, {
			'client.email': rgx,
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
		}]
		db.model('devis').find({
			$or: queries
		}, {
			'id': 1,
			'client.nom': 1,
			'client.prenom': 1,
			'client.civilite': 1,
			'status': 1,
			'status': 1,
			'categorie': 1,
		}).limit(1000).exec(callback)
	}
}

var artisanQuery = function(rgx, _int) {
	return function(callback) {
		var queries = [{
			'_id': _int
		}, {
			'representant.nom': rgx,
		}, {
			'representant.prenom': rgx,
		}, {
			'email': rgx,
		}, {
			'nomSociete': rgx,
		}, {
			'address.r': rgx,
		}, {
			'address.cp': rgx,
		}, {
			'address.v': rgx,
		}, {
			'telephone.tel1': rgx,
		}]
		db.model('artisan').find({
			$or: queries
		}, {
			'id': 1,
			'representant.nom': 1,
			'representant.prenom': 1,
			'nomSociete': 1,
			'status': 1,
			'subStatus':1,
			'categorie':1
		}).limit(1000).exec(callback)
	}
}




module.exports = function(req, res) {
	var _ = require('lodash')
	var async = require('async')
	var regexpAccents = require('regexp-accents');

	var rgx = {
		$regex: regexpAccents(req.params.text, true, 'eE')
	}
	var _int = parseInt(req.params.text) ||  0;

	async.parallel([
		interQuery(rgx, _int),
		devisQuery(rgx, _int),
		artisanQuery(rgx, _int),
	], function(err, resp) {
		var rtn = {
			intervention: resp[0],
			devis: resp[1],
			artisan: resp[2],
		}
		res.send(rtn)
	})

}
