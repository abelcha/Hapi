global.requireLocal = function(pth) {
	return require(process.cwd() + '/' + pth)
}

var request = require('request');
process.env.MONGOLAB_URI = "mongodb://heroku_app33756489:hrkm1jfvok3i2hsopg9t99jvvd@ds041981-a0.mongolab.com:41981/heroku_app33756489"

var db = require(process.cwd() + '/server/edison_components/db.js')()
var v1 = require(process.cwd() + '/server/edison_components/V1.js')
var _ = require('lodash');
var moment = require('moment')
var async = require('async')

var mapfn = function(e) {
	e.id = parseInt(e.id)
	e.pu = parseFloat(e.pu)
	e.quantite = parseInt(e.quantite)
	return e;
}

var getTotal = function(prods) {
	var total = 0;
	_.each(prods, function(e) {
		total += (e.pu * e.quantite);
	})
	return _.round(total, 2);
}

v1.get("SELECT l.id_intervention AS id, l.quantite, o.puht AS pu, o.reference AS ref,o.designation AS description  FROM ligne_facture AS l LEFT JOIN objetfacture AS o ON (l.id_objet_facture=o.id) where l.id_intervention>33",
	function(err, resp) {
		//console.log("==>", err, resp && resp.length)
		resp = _.map(resp, mapfn);
		resp = _.groupBy(resp, 'id')
		async.eachLimit(resp, 75, function(e, cb) {
			//console.log(e)
			//console.log("\n\n\n\n\n\n\n")
			var tmp = _.values(e);
			db.model('intervention').findOne({
				id: tmp[0].id
			}).select('-_id prixFinal status compta.paiement.effectue id produits').then(function(resp) {
				
				if (resp && resp.prixFinal === getTotal(resp.produits) && resp.produits[0] && resp.produits[0].ref === 'EDX121') {
					console.log('==>', resp.id)
				}

				/*if (resp &&  !_.get(resp, 'compta.paiement.effectue')) {

					var total = getTotal(resp.produits);
					if (total != resp.prixFinal) {

						console.log(resp.id, resp.status, _.get(resp, 'compta.paiement.effectue'), _.padRight(resp.prixFinal, 10, ' '), total);
					}
				} else {
					console.log('NULL', tmp[0].id)
				}*/
				cb(null);
			})
		}, process.exit.bind(process))
	})
