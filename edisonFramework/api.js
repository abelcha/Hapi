module.exports =  {

	getIntersPublicData:function(options) {
		console.log("method");
		return new Promise(function(resolve, reject) {
		console.log("new promise");
		    edison.redisCli.get("Interventions", function(err, reply) {
		console.log("redis get");
		      if (!err && reply && options && options.cache) {
		console.log("is on redis");
		        resolve(JSON.parse(reply));
		      } else {
		console.log("get from db");
		        edison.db.interventionModel.find().sort('-id').limit().exec(function (err, interList) {
		console.log("resolve db data");
		            resolve(interList);
		console.log("set redis");

		            edison.redisCli.set("Interventions", JSON.stringify(interList))
		console.log("expire on redis");
		            edison.redisCli.expire("Interventions", options.expire || 600)
		        }); 
		      }
		    });
		});
	},
	getArtisansPublicData:function(options) {
		return new Promise(function(resolve, reject) {
		    edison.redisCli.get("Artisans", function(err, reply) {
		      if (!err && reply && options && options.cache) {
		        resolve(JSON.parse(reply));
		      } else {
		        edison.db.artisanModel.find().sort('-id').limit().exec(function (err, interList) {
		            resolve(interList);
		            edison.redisCli.set("Artisans", JSON.stringify(interList))
		            edison.redisCli.expire("Artisans", options.expire || 600)
		        }); 
		      }
		    });
		});
	}

}
