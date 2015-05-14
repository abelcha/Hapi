module.exports = function(schema) {

  schema.statics.uploadFile = function(id, req, res) {
    var uuid = require('uuid');
    return new Promise(function(resolve, reject) {
    	console.log('here')
      if (req.files && req.files.file && req.files.file.buffer) {
    	console.log('here213')
        document.upload({
          type: 'Intervention',
          link: id,
          data: req.files.file.buffer,
        }).then(console.log, console.log);
        //var file = req.files.file;

        /*        dropbox.writeFile(filename, file.buffer, function(error, stat) {
                  if (error) {
                  	console.log("reject", error);
                    reject(error);
                  } else {
                  	console.log("resolve", stat);
                  	resolve(stat);
                  }
                });
              } else {
              	console.log(req.files.file);
              	reject('lol')
              }*/
      }
    })
  };
};
