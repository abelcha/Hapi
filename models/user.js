var schema = new npm.mongoose.Schema({
  portable: String,
  email: String,
  nom: String,
  prenom: String,
  pseudo: String,
  login: String,
  service: String,
  ligne: String,
  root: Boolean,
  password: String,
  activated: Boolean
});

schema.statics.validateCredentials = function(req, res) {
  return new Promise(function(resolve, reject) {
     
     if ((req.body.username == "abel" || req.body.username == "boukris_b") && req.body.password === "toto42") {
      resolve({login:req.body.username, dzz:'lol'})
     }
    else {
      reject()
    }
  });

};

var model = npm.mongoose.model('user', schema);
module.exports = model;
