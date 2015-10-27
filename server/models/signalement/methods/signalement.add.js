module.exports = function(schema) {
	schema.statics.add = function(req, res) {
		return new Promise(function(resolve, reject)  {
			var params = db.model('signalement')(req.body);
			params.login.ajout = req.session.login;
			params.date.ajout = new Date;
			params.save().then(function() {
				db.model('artisan').findOne({
					id: params.sst_id
				}).then(function(resp) {
					resp && resp.save().then(resolve, reject)
				})
			})
		})
	}


}
