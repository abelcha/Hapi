module.exports = function(schema) {
    schema.virtual('mimeType').get(function() {
        var mime = require('mime')
        return mime.lookup(this.extension);
    })
    schema.virtual('isBinary').get(function() {
        return this.extension == 'pdf' || this.mimeType.startsWith('image')
    })
}
