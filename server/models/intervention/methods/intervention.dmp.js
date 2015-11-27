module.exports = function(schema) {
    var _ = require('lodash')
    var moment = require('moment-timezone')
    var request = require('request')
    var async = require('async')
    var V1 = requireLocal('config/_convert_V1');


    schema.statics.dmp = function(req, res) {
        return new Promise(function(resolve, reject) {
            try {
                var q = JSON.parse(req.query.q);
            } catch (e) {
                var q = {}
            }
            console.log('-->', q)
            db.model(req.query.model || 'artisan').find(q, {}).populate('sst').then(function(resp) {
                console.log('==>', resp.length)
                var i = 0;
                async.eachLimit(resp, 10, function(e, cb) {
                        try {
                            if (i++ % 100 === 0) {
                                console.log(Math.round(i * 100 / resp.length) + '%')
                            }
                            e.save().then(function() {
                                cb(null)
                            })
                        } catch (e) {
                            __catch(e)
                        }
                    },
                    function(err) {
                        if (err) {
                            return reject(err);
                        }
                        resolve('ok')
                    })
            }, reject)
        })
    }
}
