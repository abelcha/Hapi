var uuid = require('uuid');


var Dropbox = function() {
  var DropboxAPI = require("dropbox")
  this.client = new DropboxAPI.Client({
    token: edison.config.dropboxKEY
  });
}


Dropbox.prototype.getFilename = function(p) {
  return '/V2/' + p.type + '/' + p.link + '/' + p.id + '.' + p.extension;
};

Dropbox.prototype.download = function(file_id) {
  var _this = this;
  return new Promise(function(resolve, reject) {
    db.model('document').findOne({
      id: file_id
    }).then(function(doc) {
      if (!doc)
        return reject("Document not found");
      _this.client.readFile(doc.filename, {
        buffer: true
      }, function(error, data) {
        if (error)
          return reject(error);
        doc.data = data;
        return resolve(doc);
      });
    }, reject)
  })
}

Dropbox.prototype.upload = function(params) {
  var _this = this;
  return new Promise(function(resolve, reject) {
    if (!params.type || !params.data || !params.link || !params.extension)
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
