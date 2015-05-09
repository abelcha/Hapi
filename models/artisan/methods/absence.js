module.exports = function(schema) {

  schema.statics.absence = function(id, req, res) {
    return new Promise(function(resolve, reject) {
      npm.mongoose.model('artisan').findOne({
        id: parseInt(id)
      }).then(function(doc) {
        doc.absence = {
          start: new Date(req.query.start),
          end: new Date(req.query.end)
        }
        doc.save()
          .then(function(re) {
            resolve(re)
          })
          //.catch(reject);
      }).catch(reject);
    })
  }

}
