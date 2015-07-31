module.exports = function(schema) {
    var _ = require('lodash')

    schema.statics.flushAvoirs = function(req, res) {
        var _this = this;
        return new Promise(function(resolve, reject) {
            var date = new Date();
            _.each(req.body, function(e) {
                db.model('intervention').findOne({
                    id: e.id,
                }).then(function(doc) {
                    var hist = {
                        date: date,
                        login: req.session.login,
                        _type: 'AVOIR',
                        _typeAvoir: e.compta.reglement.avoir._type,
                        numeroCheque: e.numeroCheque,
                        montant: e.compta.reglement.avoir.montant,
                    }
                    doc.compta.reglement.avoir.ready = false;
                    doc.compta.reglement.avoir.montant = 0;
                    doc.compta.reglement.historique.push(hist)
                    doc.save();
                }, function(err) {
                    reject(err);
                })
            })
            resolve(req.body.length + ' avoirs ont été flushé')
        })
    }

    schema.statics.avoirs = function(req, res) {
        var _this = this;
        return new Promise(function(resolve, reject) {
            _this.find({
                    /*     'compta.reglement.avoir.montant': {
                             $gt: 0
                         },*/
                    'compta.reglement.avoir.ready': true
                })
                .then(function(docs) {
                    resolve(docs)
                })
        })
    }

}
