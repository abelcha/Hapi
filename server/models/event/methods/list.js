module.exports = function(schema) {
    schema.statics.list = function(req, res) {
        return new Promise(function(resolve, reject) {
           db.model('event').find().then(resolve, reject)
        })
    }
}
