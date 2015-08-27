module.exports = function(schema) {
    schema.statics.updateAddress = function(req, res) {
        var geocoder = require('geocoder');
        var request = require('request');
        return new Promise(function(resolve, reject) {
            db.model(req.query.model || 'devis').find({
                $or: [{
                        'client.address.lt': 0
                    }, {
                        'client.address.lg': 0
                    }]
                    //id: 26237
            }).limit(100).then(function(doc) {
                doc.forEach(function(e) {
                    var add = e.client.address.n + ' ' + e.client.address.r + ', ' + e.client.address.cp + ' ' + e.client.address.v;
                    geocoder.geocode(add, function(err, data) {
                        console.log(err, data)
                        if (!err && !data.error_message && data.results[0]) {
                            console.log('get first')
                            var obj = data.results[0].geometry.location;
                            obj.id = e.id;
                            e.client.address.lt = obj.lat;
                            e.client.address.lg = obj.lng;
                            e.save();
                            //   return cb(null, data.results[0].geometry.location);
                        } else {
                            geocoder.geocode(e.client.address.cp + ", France", function(err, data) {
                                if (!err && !data.error_message && data.results[0]) {
                                    var obj = data.results[0].geometry.location;
                                    e.client.address.lt = obj.lat;
                                    e.client.address.lg = obj.lng;
                                    e.save();
                                    console.log('get second');
                                } else {
                                    console.log('nope')
                                }
                            })
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
