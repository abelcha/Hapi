module.exports = function(schema) {

  schema.statics.view = function(id, req, res) {
    return new Promise(function(resolve, reject) {
      document.download(id)
        .then(function(file) {
          if (file.extension === "pdf")
            res.contentType("application/pdf");
          res.send(file.data);
        }, reject)
    });
  };
};
