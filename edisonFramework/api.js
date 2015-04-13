module.exports = {

	getIntersPublicData: function(options) {
		return new Promise(function(resolve, reject) {
			edison.redisCli.get("Interventions", function(err, reply) {
				if (!err && reply && options && options.cache) {
					resolve(JSON.parse(reply));
				} else {
					edison.db.interventionModel.find().select('-_id  -__v').sort('-id').limit(1000).exec(function(err, interList) {
						resolve(interList);
						edison.redisCli.set("Interventions", JSON.stringify(interList))
						edison.redisCli.expire("Interventions", options.expire ||  600)
					});
				}
			});
		});
	},
	getArtisansPublicData: function(options) {
		return new Promise(function(resolve, reject) {
			edison.redisCli.get("Artisans", function(err, reply) {
				if (!err && reply && options && options.cache) {
					resolve(JSON.parse(reply));
				} else {
					edison.db.artisanModel.find().sort('-id').limit().exec(function(err, interList) {
						resolve(interList);
						edison.redisCli.set("Artisans", JSON.stringify(interList))
						edison.redisCli.expire("Artisans", options.expire ||  600)
					});
				}
			});
		});
	}

}