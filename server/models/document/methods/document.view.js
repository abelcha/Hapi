var mime = require('mime')

module.exports = function(schema) {

  schema.statics.view = function(id, req, res) {
    return new Promise(function(resolve, reject) {
      document.download(id)
        .then(function(file) {
          var contentType = mime.lookup(file.extension);
          res.contentType(contentType);
          res.send(file.data);
        }, reject)
    });
  };
};
