module.exports = function(schema) {
    var _ = require('lodash')

    schema.statics.lpa = function(req, res) {
        return new Promise(function(resolve, reject) {
            db.model('intervention').find({
                    'compta.paiement.ready': true
                }).select('id compta artisan prixFinal')
                .exec(function(err, docs) {
                    resolve(docs)
                })
        })
    }

}
