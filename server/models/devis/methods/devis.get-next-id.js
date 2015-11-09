module.exports = function(schema) {

    schema.statics.getNextID = function(data, cb) {
        db.model('intervention').findOne({}).sort("-id")
            .exec(function(err, latestDoc) {
                db.model('devis').findOne({}).sort("-id")
                    .exec(function(err2, latestDoc2) {
                        cb((latestDoc.id > latestDoc2.id ?  latestDoc.id : latestDoc2.id) + 1);
                    })
            })
    }
}
