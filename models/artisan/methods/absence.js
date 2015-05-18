module.exports = function(schema) {

  schema.statics.absence = function(id, req, res) {
    return new Promise(function(resolve, reject) {
      db.model('artisan').findOne({
        id: parseInt(id)
      }).then(function(doc) {
        doc.absence ={
          start: new Date(req.query.start),
          end: new Date(req.query.end),
          login: req.session.login
        }
        doc.save()
          .then(function(re) {
            resolve(re)
          }, reject)
      }, reject);
    })
  }
  schema.virtual('disponible').get(function() {
    if (!this.absence || !this.absence.start)
      return true;
    var d = new Date();
    return !(d.compareTo(new Date(this.absence.start)) === 1 && d.compareTo(new Date(this.absence.end)) === -1);
  });
  schema.set('toJSON', {
    virtuals: true
  });
}
