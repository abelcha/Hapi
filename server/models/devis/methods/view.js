module.exports = function(schema) {
    var _ = require('lodash')
    schema.statics.view = function(id, req, res) {
        return new Promise(function(resolve, reject) {
            id = parseInt(id);
            if (id == 0 || isNaN(id))
                return reject("Invalid ID")
            var prm = db.model('devis').findOne({
                _id: id
            });
            if (req.query.transform) {
                prm.select('produits tva client categorie -_id').then(function(resp) {
                    if (!resp)
                        reject('Not Found');
                    var rtn = resp.toObject();
                    rtn.devisOrigine = id;
                    rtn.reglementSurPlace = true;
                    rtn.date = {
                        ajout: Date.now(),
                        intervention: Date.now()
                    }
                    resolve(rtn)
                }, reject)
            } else {
                prm.then(resolve, reject);
            }
        })
    }
}
