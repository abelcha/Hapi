module.exports = function(schema) {

  schema.statics.view = function(id, req, res) {
    var _this = this;
    return new Promise(function(resolve, reject) {
      if (id === 'view') {
        return db.model('intervention').find()
          .then(function(docs) {
            resolve(docs)
          });
      }
      db.model('intervention').findOne({
        id: id
      }).then(function(doc)  {
        if (doc === null)
          return reject('not found')
        rtn = doc.toObject();
        rtn.etat = doc.etat;
        if (req.query.extend && doc.artisan.id) {
          db.model('artisan').findOne({
            id: doc.artisan.id
          }).then(function(sst) {
            rtn.artisan = sst;
            resolve(rtn);
          })
        } else {
          return resolve(rtn);
        }
      }, reject)
    });
  }
}
