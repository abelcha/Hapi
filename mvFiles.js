var walk = require('walk');
var path = require('path');
var fs = require('fs');
var _ = require('lodash');
var files = [];

// Walker options
var walker = walk.walk('./server/models', {
	followLinks: false
});

walker.on('file', function(root, stat, next) {
	// Add this file to the list of files
	files.push(root + '/' + stat.name);
	next();
});

walker.on('end', function() {
	_.each(files, function(e) {
		if (!_.endsWith(e, 'js'))
			return 0;
		var dir = path.dirname(e)
		var base = path.basename(e)
		var model = dir.split('/')[3]
		var mv = require('mv');
		console.log('MV', dir + '/' + base, dir + '/' + model + '.' + base)

		mv(dir + '/' + base, dir + '/' + model + '.' + base, function(err) {
			console.log(err);
			// done. it tried fs.rename first, and then falls back to 
			// piping the source file to the dest file and then unlinking 
			// the source file. 
		});
	})
});
