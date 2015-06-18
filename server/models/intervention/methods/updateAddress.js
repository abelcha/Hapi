module.exports = function(schema) {
    schema.statics.updateAddress = function(req, res) {
        var geocoder = require('geocoder');
        var request = require('request');
        return new Promise(function(resolve, reject) {
            db.model('intervention').find({
                'client.address.lt': 0,
                'client.address.lg': 0,
                'client.address.r': {
                    $ne: '.'
                }
            }).limit(100).then(function(doc) {
                doc.forEach(function(e) {
                    var add = e.client.address.n + ' ' + e.client.address.r + ', ' + e.client.address.cp + ' ' + e.client.address.v;
                    geocoder.geocode(add, function(err, data) {
                        if (!err && !data.error_message && data.results[0]) {
                            var obj = data.results[0].geometry.location;
                            obj.id = e.id;
                            request({
                                    url: 'http://electricien13003.com/alvin/updateAddress.php',
                                    qs: obj
                                }, function(a, b, body) {
                                    if (body && body.includes('true')) {
                                        e.client.address.lt = obj.lat;
                                        e.client.address.lg = obj.lng;
                                        e.save();
                                        console.log("SUCCESS")
                                        console.log(obj)
                                        console.log(body)
                                    }
                                })
                                //   return cb(null, data.results[0].geometry.location);
                        } else {
                            console.log("nope")
                        }
                    })
                });
            }, function(err) {
                console.log(err)
            })
            resolve("ok")
        })
    }
}
