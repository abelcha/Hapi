module.exports = function(schema) {

    schema.statics.view = function(id, req, res) {
        var _this = this;
        id = parseInt(id);
        if (id == 0 || isNaN(id))
            return Promise.reject(id + "id no a valid ID")
        return new Promise(function(resolve, reject) {
            if (req.query.transform) {
                db.model('intervention').findOne({
                    id: id
                }).select('client categorie tva -_id').then(resolve, reject);
            } else {
                if (id === 'view') {
                    return db.model('intervention').find()
                        .then(function(docs) {
                            resolve(docs)
                        });
                }
                var promise = db.model('intervention').findOne({
                    id: id
                })
                if (req.query.devis ||  req.query.extended) {
                    promise = promise.populate('devisOrigine')
                }
                if (req.query.artisan ||  req.query.extended) {
                    promise = promise.populate('sst')
                }
                promise.then(function(doc)  {
                    if (doc === null)
                        return reject('not found')

                    rtn = doc.toObject();
/*                    if (typeof doc.artisan.id == "object") {
                        rtn.artisan = doc.artisan.id;
                    }*/
                    resolve(rtn);
                });
            }
        })
    }
}
