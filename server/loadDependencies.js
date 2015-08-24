var fs = require('fs');
var _ = require('lodash');
module.exports = {
	loadJson: function(file) {
		var ret = {};
		var deps = JSON.parse(fs.readFileSync(file, 'utf8')).dependencies;
		for (var mods in deps) {
			ret[_.camelCase(mods)] = require(mods);
		};
	 	return (ret);	
	},
	loadDir: function(dir) {
		var ret = {};
		var files = fs.readdirSync(dir);
		for (var i in files) {
		    if (files[i].slice(-3) === ".js")
		        ret[_.camelCase(files[i].slice(0, -3))] = require(dir+'/'+files[i]);
		}
		return (ret);
	}

}

