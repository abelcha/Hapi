module.exports = function(schema) {

    var _ = require('lodash')

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
            blocked: d.blocked,
            categories: d.categories,
            ajout: d.date.ajout,
            star: d.star,
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
        if (!isWorker) {
            return edison.worker.createJob({
                name: 'db',
                model: 'artisan',
                priority: 'high',
                method: 'rankArtisans',
                req: options
            })
        }
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
            try {
                console.log('a')
                db.model('artisan').geoNear({
                    type: "Point",
                    coordinates: [parseFloat(options.lat), parseFloat(options.lng)]
                }, {
                    spherical: true,
                    query: query,
                    limit: options.categorie ? 100 : 25,
                    distanceMultiplier: 0.001,
                    maxDistance: (parseFloat(options.maxDistance) || 100) / 0.001
                }).then(function(docs) {
                    console.log('b')
                    try {
                        resolve(_.map(docs, __map));
                    } catch (e) {
                        __catch(e);
                    }
                }, function(err) {
                    console.log('-->', err)
                })
            } catch (err) {
                console.log(err)
            }

        })
    }
    schema.statics.rank = function(req, res) {
        console.log('alpha');
        return this.rankArtisans(req.query)
    }

}
