module.exports = function(schema) {

    var __filter = function(doc, i) {
        var d = doc.obj;
        return d.status !== 'ARC' && (!this.categorie || d.categories.indexOf(this.categorie) !== -1);
    }

    var isAbsent = function(abs) {
        var moment = require('moment')
        if (!abs || !abs.length) {
            return false;
        }
        return moment().isAfter(abs[abs.length - 1].start) && moment().isBefore(abs[abs.length - 1].end)
    }

    var __map = function(doc, i) {
        var d = doc.obj;
        return {
            id: d.id,
            nomSociete: d.nomSociete,
            distance: doc.dis.round(1),
            categories: d.categories,
            ajout: d.date.ajout,
            status: d.status,
            subStatus: d.subStatus,
            quarantained: d.quarantained,
            zoneChalandise: d.zoneChalandise,
            absent: isAbsent(d.absence),
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

            var query = {
                status: {
                    $ne: 'ARC'
                },
            }
            if (options.categorie) {
                query.categories = {
                    $in: [options.categorie]
                }
            }

            db.model('artisan').geoNear({
                type: "Point",
                coordinates: [parseFloat(options.lat), parseFloat(options.lng)]
            }, {
                query: query,
                limit: options.categorie ? 100 : 25,
                distanceMultiplier: 0.001,
                maxDistance: (parseFloat(options.maxDistance) || 100) / 0.001
            }).then(function(docs) {
                console.log('-->', docs.length)
                try {
                    resolve(_.map(docs, __map));
                    //resolve(_.chain(docs).filter(__filter.bind(options)).map(__map).take(options.limit || 150).value())

                } catch (e) {
                    __catch(e);
                }
            }, reject)
        })
    }
    schema.statics.rank = function(req, res) {

        return this.rankArtisans(req.query)
    }

}
