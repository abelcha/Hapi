module.exports = function(schema) {
	schema.statics.refresh = function(req, res) {
		
		db.model('call').find({
			'_id': {
				$gt: moment().startOf('day')
			},
			archived:false
		}, function(err, resp) {
			console.log(err, respc)
		})
	};
}
