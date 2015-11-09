module.exports = function(schema) {

    schema.statics.getNextID = function(data, cb) {
        db.model('artisan').findOne({}).sort("-id")
            .exec(function(err, latestDoc) {
                cb(latestDoc.id + 1);
            })
    }
}
