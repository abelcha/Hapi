module.exports = function(schema) {
    var _ = require('lodash')

    schema.statics.avoirs = function(req, res) {
        var _this = this;
        return new Promise(function(resolve, reject) {
            _this.find({
                'compta.reglement.avoir': {
                    $gt: 0
                },
                'compta.paiement.ready': true
            }).then(function(docs) {
                console.log(docs)
                resolve('ok')
            })


        })

    }

}
