module.exports = function(schema) {
    schema.statics.add = function(req, res) {
        return new Promise(function(resolve, reject)  {
            var params = req.query;
            params.date = Date.now();
            db.model('task')(params).save().then(resolve, reject);
        })
    }
}
