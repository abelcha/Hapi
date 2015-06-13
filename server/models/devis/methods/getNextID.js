module.exports = function(schema) {

    schema.statics.getNextID = function(cb) {
        db.model('devis').findOne({}).sort("-id")
            .exec(function(err, latestDoc) {
                cb(latestDoc.id + 1);
            })
    }
}
