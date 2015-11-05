module.exports = function(schema) {

    schema.statics.doStuff = function(req, res) {
        var _ = require('lodash')
        if (!isWorker) {
            return edison.worker.createJob({
                name: 'db',
                model: 'intervention',
                method: 'doStuff',
                req: _.pick(req, 'query', 'session')
            })
        }
        var async = require('async')
        db.model('intervention').find({
            $where: "return this.produits.length && this.produits.every(function(v) { return !v.quantite })"
        }, {
            id: 1
        }).then(function(resp) {
            async.eachLimit(_.pluck(resp, "id"), 10, function(id, callback) {
                db.model('intervention').dump({
                    query: {
                        id: id,
                        login: "CMD"
                    }
                }).then(function() {
                    callback(null)
                })
            }, res.send.bind(res))
        })
    }


    schema.statics.CB = {
        unique: true,
        findBefore: true,
        method: 'GET',
        fn: function(inter, req, res) {
            return new Promise(function(resolve, reject) {
                var key = requireLocal("config/_keys")
                var encryptor = require('simple-encryptor')(key.salt);
                if (!inter)
                    return reject("Impossible de retrouver les informations")
                if (inter.modeReglement !== "CB")
                    return reject("Le mode de reglement n'est pas CB")
                if (!inter.cb || !inter.cb.hash)
                    return reject("Pas de CB enregistré")
                if (req.session.root === false) {
                    return reject("Access refusé")
                }
                var cb = encryptor.decrypt(inter.cb.hash);
                return resolve(JSON.parse(cb))
            })
        }
    }
}
