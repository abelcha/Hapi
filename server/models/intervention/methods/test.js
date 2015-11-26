module.exports = function(schema) {
		schema.statics.xtest = function(req, res) {
			db.model('intervention').aggregate()
				.match({
					'artisan.id': 7
				})
				.group({

				})
				/*
						{
							$group: {
								_id: {
									// week: '$date.intervention'
								},
								mnt: {
									$sum: "$prixAnnonce"
								},
								fnl: {
									$sum: "$prixAnnonce"
								},
								px: {
									$sum: "$compta.paiement.montant"
								},
								total: {
									$sum: 1
								}
							}
						}, {
							$project: {
								_id: 0,
								total: 1,
								paye: db.utils.round("$px"),
								'final': db.utils.round("$fnl"),
								montant: db.utils.round("$mnt")
							}
						}])
				}*/
		}
