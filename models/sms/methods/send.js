module.exports = function(schema) {
  schema.statics.send = function(req, res) {
    return new Promise(function(resolve, reject) {
      sms.send(req.query).then(function(params) {
        console.log(params);
        db.model('sms')(params).save().then(resolve, reject);
      }, reject);
    })
  }
}
