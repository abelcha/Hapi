module.exports = function(schema) {

    schema.statics.getNextID = function(cb) {
        db.model('intervention').findOne({}).sort("-id")
            .exec(function(err, latestDoc) {
                cb(latestDoc.id + 1);
            })
    }
}
