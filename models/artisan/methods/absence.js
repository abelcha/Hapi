module.exports = function(schema) {

  schema.statics.absence = function(req, res) {
    var _this = this;
    return new Promise(function(resolve, reject) {
      var type = req.query.type;

      _this.find({
        id: parseInt(req.query.id)
      }).then(function(doc) {
        return resolve(doc)
      }).catch(reject);
    })
  }

}
