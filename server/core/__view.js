var _ = require('lodash');

module.exports = function(core) {
    /* 'client categorie tva -_id' */
    return function(id, req, res) {
        var _this = this;
        id = parseInt(id);
        if (id == 0 || isNaN(id))
            return Promise.reject(id + "id no a valid ID")
        return new Promise(function(resolve, reject) {

            var prm = core.model().findOne({
                id: id
            });
            if (req.query.populate) {
                var pops = req.query.populate.removeAll(' ').split(',')
                _.each(pops, function(e) {
                    prm = prm.populate(e);
                })
            }
            if (req.query.select) {
                prm = prm.select(req.query.select);
            }
            prm.then(resolve, reject);

            /*            if (req.query.transform) {
                            db.model('intervention').findOne({
                                id: id
                            }).select().then(resolve, reject);
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
                                resolve(rtn);
                            });
                        }*/
        })
    }
}
