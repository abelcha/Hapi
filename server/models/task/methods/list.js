module.exports = function(schema) {
    schema.statics.get = function(req, res) {
        return new Promise(function(resolve, reject) {
            db.model('task').find({}).sort('-date').then(function(docs) {
                resolve(docs)
            })
        })
    }
}
