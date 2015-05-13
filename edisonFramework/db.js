module.exports = function() {
  var mongoose = require("mongoose");
  var fs = require('fs');
  var path = require('path');

  mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/EDISON');

  function getDirectories(srcpath) {
    return fs.readdirSync(srcpath).filter(function(file) {
      return fs.statSync(path.join(srcpath, file)).isDirectory();
    });
  }
  getDirectories(rootPath + '/models/').forEach(function(model) {
    var folder = rootPath + '/models/' + model;
    var schema = require(folder + '/schema')(mongoose);
    fs.readdirSync(folder + '/methods').forEach(function(method) {
      if (method.endsWith('.js')) {
        require(folder + '/methods/' + method)(schema)
      }
    });
    mongoose.model(model, schema);
  })

  return mongoose;

}
