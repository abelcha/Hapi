module.exports = function(schema) {

  schema.statics.refreshStatus = function(req, res) {
    var _this = this;
    return new Promise(function(resolve, reject) {
    console.log("refresh")
      db.model('sms').find({
        status: {
          $in: [0, 100]
        },
        track: true
      }).then(function(docs) {
        docs.forEach(function(e) {
          sms.getStatus(e.id).then(function(status) {
            e.status = status;
            e.save()
          })
        })
        resolve("OK");
      }, reject)
    });
  }
}
