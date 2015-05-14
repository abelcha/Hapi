var Dropbox = function() {
  var DropboxAPI = require("dropbox")
  this.client = new DropboxAPI.Client({
    token: edison.config.dropboxKEY
  });
}


Dropbox.prototype.upload = function(params) {
  var _this = this;
  return new Promise(function(resolve, reject) {
    if (!params.type || !params.data || !params.link) {
      reject("Invalid params");
    } else {
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
      //var filename = "V2/Intervention/" + id + "/" + file_id + "." + file.extension;
      console.log(params);
      resolve("ok")
    }

  })
};
module.exports = Dropbox;
