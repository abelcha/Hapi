module.exports = function(schema) {
  schema.statics.send = function(req, res) {
  	var options = (req.text ? req : req.query);
    return new Promise(function(resolve, reject) {
      sms.send(options).then(function(params) {
        db.model('sms')(params).save().then(resolve, reject);
      }, reject);
    })
  }
}
