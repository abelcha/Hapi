'use strict'

var async = require('async');

module.exports = function(schema) {

    var selectedFields = [
        '-_id',
        'id',
        'address',
        'nomSociete',
        'categories'
    ]
    var s = "";
    selectedFields.forEach(function(e)  {
        s += (' ' + e);
    })
    schema.statics.list = function(req, res) {
        var _this = this;
        return new Promise(function(resolve, reject) {
            redis.get('artisanList', function(err, reply) {
                if (!err && reply && !req.query.cache) {
                    return resolve(JSON.parse(reply));
                }
                _this.model('artisan').find({
                    'categories': 'PL',
                    archive: false
                }).sort('-id').select(s).then(function(docs) {
                    async.map(docs, function(e, cb) {
                        cb(null, {
                            id: e.id,
                            n: e.nomSociete,
                            c: e.categories,
                            add: {
                                lt: e.address.lt,
                                lg: e.address.lg
                            }
                        });
                    }, function(err, result)  {
                        resolve(result);
                        //console.timeEnd('interList')
                        //console.log('nocache')
                        redis.set("artisanList", JSON.stringify(result))
                        redis.expire("artisanList", 6000)
                    });
                })
            });
        });
    }
}
