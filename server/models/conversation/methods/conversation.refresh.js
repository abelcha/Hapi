module.exports = function(schema) {


	schema.statics.refresh = function(req, res) {
		var _ = require('lodash')
		var moment = require('moment');
		var async = require('async');

		if (!isWorker) {
			return edison.worker.createJob({
				name: 'db',
				model: 'conversation',
				method: 'refresh',
				req: _.pick(req, 'query', 'session')
			})
		}
		return new Promise(function(resolve, reject) {

			db.model('conversation').find({
				//archived: false,
				from: {
					$ne: 'Anonymous'
				},
				/*date: {
					$gt: moment().startOf('day').toDate()
				}*/
			}, function(err, resp) {
				async.eachLimit(resp, 1, function(call, big_callback) {
					var external_num = (call.io === 'incoming' ? call.from : call.to);
					async.parallel([
						function getIntervention(cb) {
							db.model('intervention').findOne({
								$or: [{
									'client.telephone.tel1': external_num
								}, {
									'client.telephone.tel2': external_num
								}, {
									'client.telephone.tel3': external_num
								}, {
									'facture.tel': external_num
								}, {
									'facture.tel2': external_num
								}]
							}).exec(cb)
						},
						function getDevis(cb) {
							db.model('devis').findOne({
								$or: [{
									'client.telephone.tel1': external_num
								}, {
									'client.telephone.tel2': external_num
								}, {
									'client.telephone.tel3': external_num
								}]
							}).exec(cb)
						},
						function getArtisan(cb) {
							db.model('artisan').findOne({
								$or: [{
									'telephone.tel1': external_num
								}, {
									'telephone.tel2': external_num
								}, {
									'telephone.tel3': external_num
								}]
							}).exec(cb)
						}
					], function(err, resp) {
						if (resp[0]) {
							console.log('INTERVENTION', resp[0]._id)
							resp[0].conversations.push(call.toObject())
							resp[0].save();
						} else if (resp[1]) {
							console.log('DEVIS', resp[1]._id)
							resp[1].conversations.push(call.toObject())
							resp[1].save();
						}
						if (resp[2]) {
							console.log('SST', resp[2]._id)
						}
						if (!resp[0] && !resp[1]) {
							console.log('NOOP',  external_num)
							big_callback(null)
						} else {
							call.archived = true;
							call.save(big_callback)
						}
					})


				}, function(err, resp) {
					console.log(JSON.stringify(err, null, 2), resp)
					resolve([err, resp])
				})
			})
		})
	};
}
