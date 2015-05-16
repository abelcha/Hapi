module.exports = function(schema) {

  schema.statics.uploadFile = function(id, req, res) {
    var uuid = require('uuid');
    return new Promise(function(resolve, reject) {
      if (req.files && req.files.file && req.files.file.buffer) {
        db.model('document').upload({
          type: 'intervention',
          link: id,
          data: req.files.file.buffer,
        }).then(resolve, reject);
      }
    })
  };
};
