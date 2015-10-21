module.exports = function(schema) {
    var _ = require('lodash')

    var getMonthRange = function(m, y) {
        var date = new Date(y, m);
        return {
            $gte: new Date(date.getFullYear(), date.getMonth(), 1, -1),
            $lt: new Date(date.getFullYear(), date.getMonth() + 1, 1)
        }
    }

    schema.statics.comptesArtisan = function(req, res) {
        var _this = this;
        return new Promise(function(resolve, reject) {
            db.model('artisan').find({}, {}).then(function(docs) {
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
                return req.query.download ? res.sage(rtn) : res.table(rtn);
            });
        });
    };

    schema.statics.comptesClient = function(req, res) {
        var _this = this;
        var dateRange = getMonthRange(req.query.m - 1, req.query.y)
        return new Promise(function(resolve, reject) {
            db.model('intervention').find({
                'date.ajout': dateRange
            }, {}).then(function(docs) {
                var rtn = docs.map(function(e) {
                    return [
                        '411CLT' + _.padLeft(e.id, 6, '0'),
                        e.client.civilite,
                        e.client.nom + ' ' + e.client.prenom,
                        e.client.address.n,
                        e.client.address.r,
                        e.client.address.v,
                        e.client.address.cp,
                    ];
                })
                return req.query.download ? res.sage(rtn) : res.table(rtn);
            })
        })
    }
}
