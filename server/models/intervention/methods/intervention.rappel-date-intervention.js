module.exports = function(schema) {
	schema.statics.rappelDateIntervention = function(req, res) {
		return new Promise(function(resolve, reject) {
			var moment = require('moment')
			var _ = require('lodash')
			var now = moment().toDate();
			var oneHourAgo = moment().add('-60', 'minutes').toDate()
			var halfHourAgo = moment(oneHourAgo).add('-30', 'minutes').toDate()
			var twoDaysAgo = moment().add('-3', 'days').toDate()
			var textTemplate = requireLocal('config/textTemplate');


			db.model('intervention').find({
				'date.intervention': {
					$gt: oneHourAgo,
					$lt: now
				},
				'date.ajout': {
					$lt: twoDaysAgo
				},
			}).lean().populate('sst').then(function(resp) {

				_.each(resp, function(e) {
					if (!e.sst)
						return 0
					var text = _.template(textTemplate.sms.intervention.rappelArtisan())({
						e: e,
						datePlain: moment(e.date.intervention).format("H[h]mm")
					})
					sms.send({
						to: '0633138868',
						text: text
					})

				})
				return resolve('ok')
			})
		})
	}
}
