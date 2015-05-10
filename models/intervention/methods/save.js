module.exports = function(schema) {

  function mongooseError(reject) {
    return function(err) {
      var str = String(err).split('Path').join('Le champs');
      str = str.split('is required').join('est requis');
       str = str.split('.,').join("\r\n\r\n");
      reject(str);
    }
  }

  var updateInter = function(data) {
    return new Promise(function(resolve, reject) {
      npm.mongoose.model('intervention').findOne({
        id: data.id
      }).then(function(doc) {
        for (k in data) {
          doc[k] = data[k];
        }
        doc.save().then(function(result) {
          npm.mongoose.model('intervention').cacheActualise(doc.id);
          resolve(result.id);

        }, mongooseError(reject));
      }, mongooseError(reject))
    })
  }

  var createInter = function(data) {
    return new Promise(function(resolve, reject) {
      var inter = npm.mongoose.model('intervention')(data);
      inter.save().then(function(doc) {
        resolve(doc.id);
        npm.mongoose.model('intervention').cacheActualise(doc.id);
      }, mongooseError(reject))
    })
  }



  schema.statics.save = function(req, res) {
    var data = JSON.parse(req.query.data);
    return data.id ? updateInter(data) : createInter(data);
  }
}
