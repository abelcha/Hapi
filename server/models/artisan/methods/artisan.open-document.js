module.exports = function(schema) {
    var mime = require("mime")
    schema.statics.openDocument = {
        unique: true,
        findBefore: true,
        method: 'GET',
        fn: function(artisan, req, res) {
            return new Promise(function(resolve, reject) {
                var file = artisan.document[req.query.file];
                if (!file)
                    return reject("Le document est introuvable");

                document.get('/V2/artisan/' + artisan.id + '/' + req.query.file + file.extension, function(err, resp) {
                    if (err)
                        return reject("Erreur");
                    var contentType = mime.lookup(file.extension);
                  /*  if (this.extension == '.pdf' || this.mimeType.startsWith('image')) {

                    }*/
                    res.contentType(contentType);
                    res.send(resp);
                    console.log(err, resp)
                })
            });
        }
    }
}
