module.exports = function(schema) {

  schema.statics.validateCredentials = function(req, res) {
    return new Promise(function(resolve, reject) {
    	console.log("promise");
      if ((req.body.username == "abel" || req.body.username == "boukris_b") && req.body.password === "toto42") {
        resolve({
          login: req.body.username,
          dzz: 'lol'
        })
      } else {
        reject()
      }
    });

  };
}
