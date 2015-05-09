module.exports = function() {

  var path = "./models/artisan/";
  var schema = require('./schema');

  var files = require('fs').readdirSync(__dirname + "/methods");
  for (var i in files) {
    require(__dirname + "/methods/" + files[i].slice(0, -3))(schema);
  }

  return npm.mongoose.model('artisan', schema);

}
