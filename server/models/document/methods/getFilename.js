module.exports = function(schema) {
  schema.virtual('filename').get(function() {
    return '/V2/' + this.model + '/' + this.link + '/' + this._id + '.' + this.extension;
  })
}
