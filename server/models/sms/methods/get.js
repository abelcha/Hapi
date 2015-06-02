module.exports = function(schema) {
    schema.statics.get = function(req, res) {
        return new Promise(function(resolve, reject) {
            db.model('sms').find(req.query).sort('-date').then(function(docs) {
                resolve(docs)
            })
        })
    }
}
