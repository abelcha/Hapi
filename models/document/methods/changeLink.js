module.exports = function(schema) {

  schema.statics.changeLink = function(options) {

    return new Promise(function(resolve, reject) {
      db.model('document').update({
          link: options.oldID
        }, {
          link: options.newID
        }, {
          multi: true
        })
        .then(resolve, reject);
    })
  }
}
