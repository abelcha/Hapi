module.exports = function(schema) {

    var _ = require('lodash');
    var geocoder = require('geocoder');
    var request = require('request');
    var async = require('async');

    schema.statics.geolocateAddress = function(e, cb) {
        cb = cb || _.noop;

        var add = e.client.address.n + ' ' + e.client.address.r + ', ' + e.client.address.cp + ' ' + e.client.address.v;
        geocoder.geocode(add, function(err, data) {
            if (!err && !data.error_message && data.results[0]) {
                console.log('first')
                var obj = data.results[0].geometry.location;
                obj.id = e.id;
                e.client.address.lt = obj.lat;
                e.client.address.lg = obj.lng;
                e.save(cb);
                //   return cb(null, data.results[0].geometry.location);
            } else {
                geocoder.geocode(e.client.address.cp + ", France", function(err, data) {
                    if (!err && !data.error_message && data.results[0]) {
                        console.log('second')
                        var obj = data.results[0].geometry.location;
                        e.client.address.lt = obj.lat;
                        e.client.address.lg = obj.lng;
                        e.save(cb);
                    } else {
                        console.log('noop')
                        cb(null)
                    }
                })
            }
        })
    }

    schema.statics.updateAddress = function(req, res) {

        return new Promise(function(resolve, reject) {
            db.model(req.query.model || 'devis').find({
                'client.address.lt': 0,
                'client.address.lg': 0
                    //id: 26237
            }).limit(25).then(function(doc) {
                try {
                    console.log("-->", doc.length)
                    async.each(doc, db.model('intervention').geolocateAddress, function() {
                        resolve('ok')
                    });
                } catch (e) {}

            }, function(err) {
                resolve('ok')
            })
        })
    }
}
