module.exports = function(schema) {

    schema.statics.scan = {
        unique: true,
        findBefore: true,
        method: 'POST',
        fn: function(inter, req, res) {
            var moment = require('moment-timezone');
            return new Promise(function(resolve, reject) {
                var query = "INSERT INTO scanner (id_inter, start) VALUES (" + inter.id + ", '" + moment.tz('Europe/Paris').valueOf() + "')";
                edison.v1.set(query, function(err, resp) {
                    console.log(err, resp);
                    resolve("ok");
                    setTimeout(function() {
                        db.model('document').check(req).then(function() {
                            db.model('document').archiveScan(req).then(function() {
                                db.model('document').order(req).then(function() {
                                    console.log('DocumentFullCheck [DONE]')
                                })
                            })
                        })
                    }, 30000)
                })

            })
        }
    }
}
