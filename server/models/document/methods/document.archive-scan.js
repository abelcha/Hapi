module.exports = function(schema) {

    schema.statics.checkArchived = function(req, res) {
        edison.v1.get('SELECT COUNT(*) FROM scanner WHERE archived=1', function(err, resp) {
            res.json([err, resp])
        });
    }

    schema.statics.archiveScan = function(req, res) {
        var _ = require('lodash');
        if (!isWorker) {
            return edison.worker.createJob({
                name: 'db',
                model: 'document',
                method: 'archiveScan',
                req: _.pick(req, 'query', 'session')
            })
        }

        return new Promise(function(resolve, reject) {
            var request = require('request');
            var requestP = require('request-promise');
            var async = require('async');
            var moment = require('moment');
                /*  edison.v1.set("update ecritures set t_stasmp='" + _.random(10, 100) + "' WHERE 1=1",function(err, resp) {
                      console.log(err, resp)
                  });*/
            var i = 0;
            var limit = req && req.query && req.query.limit || 1000;
            var archiveFile = function(file, cb) {
                //console.log(String(i++) + '/' + String(limit))
                document.move('/SCAN/' + file.name, '/SCAN_ARCHIVES/' + file.name)
                    .then(function(resp) {
                       // console.log('MV', file.name)
                        edison.v1.set("UPDATE scanner SET archived='1' WHERE id='" + file.id + "'", function() {
                            //console.log('SAVED', file.name)
                            cb(null)
                        })
                    }, function(err) {
                  //      console.log('ERR', file.name, err)
                        if (_.includes(String(err), '404')) {
                            document.move('/SCAN_ARCHIVES/' + file.name, '/SCAN/' + file.name).then(function(resp) {
                    //            console.log('YEPYEPYEP')
                                cb(null)
                            }, function() {
                      //          console.log('SECERR')
                                cb(null);
                            })
                        }
                    });
            }


            var i = 0;
            edison.v1.get("SELECT * FROM scanner WHERE checked='1' AND archived='0' AND moved='1' LIMIT " + limit, function(err, resp) {
                    limit = resp.length;
                    async.eachLimit(resp, 3, archiveFile, function(err, resp) {
                        console.log(err, resp)
                        resolve('ok')
                    })
                })
        }).catch(__catch)
    }
}
