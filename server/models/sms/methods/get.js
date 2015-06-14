module.exports = function(schema) {
    schema.statics.get = function(req, res) {
        return new Promise(function(resolve, reject) {
        	var query = JSON.parse(req.query.q)
            db.model('sms').find(query).sort('-date').then(function(docs) {
                resolve(docs)
            })
        })
    }
}
