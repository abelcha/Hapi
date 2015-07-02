module.exports = function(schema) {

    var __filter = function(doc, i) {
        var d = doc.obj;
        return d.status !== 'ARC' && (!this.categorie || d.categories.indexOf(this.categorie) !== -1);
    }

    var __map = function(doc, i) {
        var d = doc.obj;
        return {
            id: d.id,
            nomSociete: d.nomSociete,
            distance: doc.dis.round(1),
            categories: d.categories,
            status: d.status,
            subStatus:d.subStatus,
            zoneChalandise:d.zoneChalandise,
            address: {
                lt: d.address.lt,
                lg: d.address.lg,
            },
        }
    }


    schema.statics.rankArtisans = function(options) {
        var self = this;
        return new Promise(function(resolve, reject) {
            var _ = require('lodash')
            db.model('artisan').geoNear({
                type: "Point",
                coordinates: [parseFloat(options.lat), parseFloat(options.lng)]
            }, {
                distanceMultiplier: 0.001,
                maxDistance: (parseFloat(options.maxDistance) || 100) / 0.001
            }).then(function(docs) {
                resolve(_.chain(docs).filter(__filter.bind(options)).map(__map).take(options.limit || 50).value())
            }, reject)
        })
    }
    schema.statics.rank = function(req, res) {

        return this.rankArtisans(req.query)
    }

}
