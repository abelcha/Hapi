module.exports = function(schema) {
	var async = require('async');
	var _ = require('lodash');
	var moment = require('moment');
	schema.statics.com = function(req, res) {
		db.model('artisan').find({
			nbrIntervention: {
				$lte: 20,
				$gt: 0
			},
			'date.ajout': {
				$gt: new Date(2015, 11, 1)
			}
		}, {
			status: 1,
			nbrIntervention: 1,
			nomSociete: 1
		}).then(function(resp) {
			var rtn = _(resp).groupBy('nbrIntervention')
				.value()
			var x = _.map(rtn, function(e, k) {
					return {
						nbrInter: k,
						total_actif: _.filter(e, 'status', 'ACT').length,
						total_archive: _.filter(e, 'status', 'ARC').length
					}
				})
				/*x = _.map(x, function(e) {
					return (_.toArray(e))
				})*/
			res.xtable(x);
			//console.log(x)
		})
	}
}
