module.exports = function(schema) {

  schema.statics.view = function(id, req, res) {
    var _this = this;
    return new Promise(function(resolve, reject) {
      db.model('intervention').findOne({
        id: id
      }).then(function(doc)  {

        if (req.query.extend && doc.artisan.id) {
          db.model('artisan').findOne({
            id: doc.artisan.id
          }).then(function(sst) {
            doc = JSON.parse(JSON.stringify(doc));
            doc.artisan = sst;
            resolve(doc);
          })
        } else {
          return resolve(doc);
        }
      }, reject)
    });
  }
}
