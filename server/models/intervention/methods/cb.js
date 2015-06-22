module.exports = function(schema) {

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
