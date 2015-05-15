module.exports = function(schema) {

  schema.statics.upload = function(req, res) {
    return new Promise(function(resolve, reject) {
      if (!req.files || !req.files.file || !req.files.file.buffer || !req.files.file.extension) {
        return reject("Invalid File");
      }
      if (req.files.file.size > 5000000)
        return reject("File is too big");
      document.upload({
        name: req.files.file.originalname,
        type: req.body.type,
        link: req.body.link,
        data: req.files.file.buffer,
        extension: req.files.file.extension
      }).then(function(params) {
        db.model('document')(params).save().then(resolve, reject);
      }, reject);

    })
  }
}
