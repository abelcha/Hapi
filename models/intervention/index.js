module.exports = function() {

  var path = "./models/intervention/";
  var schema = require('./schema');

  var files = require('fs').readdirSync(__dirname + "/methods");
  for (var i in files) {
    require(__dirname + "/methods/" + files[i].slice(0, -3))(schema);
  }

  var model = npm.mongoose.model('intervention', schema);
  require("./validator")(model);
  return model;
}
