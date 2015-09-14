module.exports = function(schema) {

  schema.statics.view = function(id, req, res) {
    var _this = this;
    return new Promise(function(resolve, reject) {
      db.model('artisan').findOne({
        id: id
      }).then(function(doc)  {
        if (doc)
          return resolve(doc);
        return resolve(db.model('artisan')({}));
      }, reject)
    });
  }
}
