module.exports = function(schema) {

schema.statics.save = function(req, res) {
  var _this = this;
  var data = JSON.parse(req.query.data);
  return new Promise(function(resolve, reject) {
    var intervention = new _this.model('intervention')(data);
    if (data.id) {
      model.findOne({
        id: data.id
      }).exec(function(err, doc) {
        if (err)
          return reject(String(err));
        for (k in data) {
          doc[k] = data[k];
        }
        doc.save(function(err, result) {
          if (err)
            reject(String(err));
          resolve(result.id);
        });
      })
    } else {
      var inter = new _this.model('intervention')(data);
      inter.save(function(err, doc) {
        if (err)
          reject(String(err));
        else
          resolve(doc.id);
      })
    }
  });
}
}
