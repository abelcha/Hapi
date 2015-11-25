module.exports = function(schema) {
    var _ = require('lodash')
    var moment = require('moment-timezone')
    var request = require('request')
    var async = require('async')
    var V1 = requireLocal('config/_convert_V1');


    schema.statics.dmp = function(req, res) {

        if (!isWorker) {
            return edison.worker.createJob({
                name: 'db',
                model: 'intervention',
                method: 'dmp',
                req: _.pick(req, 'query', 'session')
            })
        }
        // var lol = req.query.ids.split(',')
        return new Promise(function(resolve, reject) {
            db.model(req.query.model || "intervention").find({
                /*   id: {
                       $in: lol
                   }*/
            }).then(function(resp) {
                async.eachLimit(resp, 1, function(e, callback) {
                            // e.status = "ANN";
                            // e.causeAnnulation = "PERTE"
                        e.save(callback);
                    }, function() {
                        resolve('lolok')
                    })
                    /*console.log(_.pluck(resp, 'id').join(','))
                    var i = 0;
                    async.eachLimit(resp, 5, function(e, cb) {
                        console.log(i++, resp.length)
                        var v1 = new V1(e);
                        v1.send(function() {
                            cb(null);
                        });
                    }, resolve)*/
            })
        })
    }
}
