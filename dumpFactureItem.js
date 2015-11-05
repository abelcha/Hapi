global.requireLocal = function(pth) {
	return require(process.cwd() + '/' + pth)
}

var request = require('request');

var db = require(process.cwd() + '/server/edison_components/db.js')()
var v1 = require(process.cwd() + '/server/edison_components/V1.js')
var _ = require('lodash');
var moment = require('moment')
var async = require('async')

console.log('okok')
var mapfn = function(e) {
	e.id = parseInt(e.id)
	e.pu = parseFloat(e.pu)
	e.quantite = parseInt(e.quantite)
	return e;
}

v1.get("SELECT l.id_intervention AS id, l.quantite, o.puht AS pu, o.reference AS ref,o.designation AS description  FROM ligne_facture AS l LEFT JOIN objetfacture AS o ON (l.id_objet_facture=o.id) where l.id_intervention>33000",
	function(err, resp) {
		//console.log("==>", err, resp && resp.length)
		resp = _.map(resp, mapfn);
		resp = _.groupBy(resp, 'id')
		async.eachLimit(resp, 1, function(e, cb) {
			//console.log(e)
			//console.log("\n\n\n\n\n\n\n")
			var tmp = _.values(e);
			console.log("==>", tmp[0].id)
			db.model('intervention').find({
				id: tmp[0].id
			}).then(function(resp) {
				console.log(resp.prixFinal);
				cb(null);
			},)
		}, process.exit.bind(exit))
	})
