module.exports = function(schema) {
    schema.statics.add = function(req, res) {
        return new Promise(function(resolve, reject)  {
            var params = req.body;
            console.log('==<', params)
            params.date = Date.now();
            db.model('task')(params).save().then(resolve, reject);
        })
    }
}
