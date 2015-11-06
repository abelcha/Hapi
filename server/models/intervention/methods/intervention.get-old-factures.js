module.exports = function(schema) {
	schema.statics.getOldFactures = function(req, res) {
		var _ = require('lodash');
		var moment = require('moment')
		var async = require('async')

		var mapfn = function(e) {
			e.id = parseInt(e.id)
			e.pu = parseFloat(e.pu)
			e.quantite = parseInt(e.quantite);

			e.ref = (e.ref ||  "").replace(' ', '');
			if (e.ref.startsWith("CAM"))
				e.ref = "CAM001";
			if (e.ref.startsWith("EDI003") || e.ref.startsWith("FRN"))
				e.ref = "FRN001";
			e.title = (e.desc || "").toUpperCase().split(' ').slice(0, 3).join(' ')
			if (!e.ref || e.ref == 'AUT001')
				e.ref = (e.desc ||  "").toUpperCase().slice(0, 3) + '0' + _.random(9, 99)
			e.title = e.title.replaceAll('\n', ' ').replaceAll('\r', '')
			return e;
		}

		var getTotal = function(prods) {
			var total = 0;
			_.each(prods, function(e) {
				total += (e.pu * e.quantite);
			})
			return _.round(total, 2);
		}

		edison.v1.get("SELECT l.id_intervention AS id, l.quantite, o.puht AS pu, o.reference AS ref,o.designation AS 'desc'  FROM ligne_facture AS l LEFT JOIN objetfacture AS o ON (l.id_objet_facture=o.id) where l.id_intervention>33",
			function(err, resp) {
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
							resp.produits = tmp;
							console.log(resp.id);
							resp.save(function(err, resp) {
								console.log('==>', !!err, !!resp)
							});
						}
						cb(null);
					})
				}, function() {
					res.send('okok')
				})
			})

	}
}
