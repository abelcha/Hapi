
var getFileFromPath = function(str) { return str.substring(str.lastIndexOf('/'));}

module.exports = function(req, res) {

	this.getAllTheRoutes = function(){
		var rtn = [];
		var deferred = npm.q.defer();
		npm.glob( 'views/**/index.ejs', function(err, files) {
			for (var i = 0; i < files.length; i++) {
				if (req.url === getFileFromPath(files[i].slice(0, -10)))
					return deferred.resolve(files[i].substring("views/".length));
			};
			return deferred.reject();
		});
		return deferred.promise;
	};

	this.getAllTheRoutes()
	.then(function(result) {
		console.log(result)
		return res.render(result);
	}, function(err) {
		console.log(err);
		return res.status(404).send('Not found');
	});
	
}