module.exports = function(schema) {
    schema.statics.updateAddress = function(req, res) {
        var geocoder = require('geocoder');
        var request = require('request');
        var async = require('async');
        return new Promise(function(resolve, reject) {
            db.model(req.query.model || 'devis').find({
                'client.address.lt': 0,
                'client.address.lg': 0
                    //id: 26237
            }).limit(25).then(function(doc) {
                console.log(doc.length);
                try {

                    async.each(doc, function(e, cb) {
                        var add = e.client.address.n + ' ' + e.client.address.r + ', ' + e.client.address.cp + ' ' + e.client.address.v;
                        geocoder.geocode(add, function(err, data) {
                            if (!err && !data.error_message && data.results[0]) {
                                console.log('get first')
                                var obj = data.results[0].geometry.location;
                                obj.id = e.id;
                                e.client.address.lt = obj.lat;
                                e.client.address.lg = obj.lng;
                                e.save(cb);
                                //   return cb(null, data.results[0].geometry.location);
                            } else {
                                geocoder.geocode(e.client.address.cp + ", France", function(err, data) {
                                    if (!err && !data.error_message && data.results[0]) {
                                        var obj = data.results[0].geometry.location;
                                        e.client.address.lt = obj.lat;
                                        e.client.address.lg = obj.lng;
                                        e.save(cb);
                                        console.log('get second');
                                    } else {
                                        cb(null)
                                        console.log('nope')
                                    }
                                })
                            }
                        })
                    }, function() {
                        resolve('ok')
                    });
                } catch (e) {
                    console.log(e)
                }

            }, function(err) {
                resolve('ok')
                console.log(err)
            })
        })
    }
}
