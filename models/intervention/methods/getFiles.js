module.exports = function(schema) {

  schema.statics.getFiles = function(id, req, res) {
    return new Promise(function(resolve, reject) {

      db.model('document')
        .find({
          model: 'intervention',
          link: id,
          deleted:false
        })
        .then(resolve, reject)

    })
  }
}
