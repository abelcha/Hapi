var uuid = require('uuid');
var mime = require('mime')

var Dropbox = function() {
  var DropboxAPI = require("dropbox")
  this.client = new DropboxAPI.Client({
    token: edison.config.dropboxKEY
  });
}
Dropbox.prototype.getFilename = function(p) {
  return '/V2/' + p.model + '/' + p.link + '/' + p.id + '.' + p.extension;
};

Dropbox.prototype.download = function(file_id) {
  var _this = this;
  return new Promise(function(resolve, reject) {
    db.model('document').findOne({
      id: file_id
    }).then(function(doc) {
      if (!doc)
        return reject("Document not found");
      var isBinary = doc.extension == 'pdf' || mime.lookup(doc.extension).startsWith('image');
      _this.client.readFile(doc.filename, {
        buffer: isBinary
      }, function(error, data) {
        if (error)
          return reject(error);
        doc.data = data;
        return resolve(doc);
      });
    }, reject)
  })
}

Dropbox.prototype.move = function(from, to) {
  var _this = this;
  return new Promise(function(resolve, reject) {
    console.log("move", from, to);
    _this.client.move(from, to, function(err, stats) {
      console.log(err, stats)

      if (err)
        reject(err);
      resolve(stats);
    })
  
  })
}

Dropbox.prototype.upload = function(params) {
  var _this = this;
  return new Promise(function(resolve, reject) {
    if (!params.model || !params.data || !params.link || !params.extension)
      reject("Invalid params");
    params.id = uuid.v4();
    params.filename = _this.getFilename(params);
    _this.client.writeFile(params.filename, params.data, function(error, stat) {
      if (error)
        return reject(error);
      return resolve(params);
    });
  })

}
module.exports = Dropbox;
