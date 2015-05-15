module.exports = function(schema) {

  function dbError(reject) {
    return function(err) {
      var str = String(err).split('Path').join('Le champs');
      str = str.split('is required').join('est requis');
      str = str.split('.,').join("\r\n\r\n");
      reject(str);
    }
  }

  var updateInter = function(data) {
    return new Promise(function(resolve, reject) {
      db.model('intervention').findOne({
        id: data.id
      }).then(function(doc) {
        for (k in data) {
          doc[k] = data[k];
        }
        doc.save().then(function(result) {
          db.model('intervention').cacheActualise(doc.id);
          resolve(result.id);

        }, dbError(reject));
      }, dbError(reject))
    })
  }

  var createInter = function(data) {
    return new Promise(function(resolve, reject) {
      var inter = db.model('intervention')(data);
      inter.save().then(function(doc) {
        resolve(doc.id);
        db.model('intervention').cacheActualise(doc.id);
        db.model('document').changeLink({
            oldID: data.tmpID,
            newID: doc.id
          })
          .then(console.log, console.log);
      }, dbError(reject))
    })
  }



  schema.statics.save = function(req, res) {
    var data = JSON.parse(req.query.data);
    return data.id ? updateInter(data) : createInter(data);
  }
}
