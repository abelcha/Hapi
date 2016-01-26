module.exports = function(schema) {
	var async = require('async');
	var _ = require('lodash');
	var moment = require('moment');
	schema.statics.com = function(req, res) {
		return new Promise(function(resolve, reject) {

			db.model('intervention').aggregate()
				.match({
					'compta.reglement.recu': true,
				}).group({
					_id: '$artisan.id',
					count: {
						$sum: 1
					},
					nm: {
						$addToSet: '$artisan.nomSociete'
					}
				}).exec(function(err, resp) {
					var rtn = [];
					async.eachLimit(resp, 100, function(e, cb) {
								db.model('artisan').findOne({
									id: e._id
								}, function(err, artisan) {
									if (err || !artisan ||  artisan.status !== 'ACT') {
										return cb(null)
									}
									rtn.push({
										count: e.count,
										nomSociete: artisan.nomSociete,
										id: artisan.id
									})
									cb(null)
								})

							},
							function(err) {
								var rsp = _(rtn).filter(function(e) {
										return e.count <= 20
									})
									.groupBy(function(e) {
										return e.count
									}).map(function(e, k) {
										var rtn = {};
										rtn[k] = e.length
										return rtn;
									}).map(_.toArray).map(function(e, k) {
										console.log(e);
										return (k + 1) + ';' + e[0] + '\n\r'
									}).join('')
								res.setHeader('Content-disposition', 'attachment; filename=comission.csv');
								res.send(rsp)
							})
						/*
						resolve('ok')*/
				})
		})
	}
}
