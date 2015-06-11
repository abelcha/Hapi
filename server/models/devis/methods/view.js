module.exports = function(schema) {

    schema.statics.view = function(id, req, res) {
        return new Promise(function(resolve, reject) {
            id = parseInt(id);
            if (id == 0 || isNaN(id))
                return reject("Invalid ID")
            db.model('devis').find({
                _id: id
            }).exec(function(err, doc) {
                if (err)
                    return reject(err);
                return resolve(doc);
            })
        })
    }
}
