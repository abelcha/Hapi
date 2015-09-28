module.exports = function(schema) {
    var _ = require('lodash')

    schema.statics.comptesArtisan = function(req, res) {
        var _this = this;
        return new Promise(function(resolve, reject) {
            db.model('artisan').find({}, {

            }).then(function(docs) {
                var rtn = docs.map(function(e) {
                    return [
                        '401401' + _.padLeft(e.id, 5, '0'),
                        e.formeJuridique,
                        e.nomSociete,
                        e.address.n,
                        e.address.r,
                        e.address.v,
                        e.address.cp
                    ]
                });
                return res.sage(rtn);
            });
        });
    };

    schema.statics.comptesClient = function(req, res) {
        var _this = this;
        return new Promise(function(resolve, reject) {
            db.model('intervention').find({}, {

            }).limit(100).then(function(docs) {
                var rtn = docs.map(function(e) {
                    return [
                        '411CLT' + _.padLeft(e.id, 6, '0'),
                        e.client.civilite,
                        e.client.nom + ' ' + e.client.prenom,
                        e.client.address.n,
                        e.client.address.r,
                        e.client.address.v,
                        e.client.address.cp,
                    ]
                })
                return res.sage(rtn);
            })
        })
    }

}
