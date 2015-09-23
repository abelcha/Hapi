module.exports = function(schema) {

    schema.statics.checkArchived = function(req, res) {
        edison.v1.get('SELECT COUNT(*) FROM scanner WHERE archived=1', function(err, resp) {
            res.json([err, resp])
        });
    }

    schema.statics.archiveScan = function(req, res) {
        var _ = require('lodash');
        // if (!isWorker) {
        //     return edison.worker.createJob({
        //         name: 'db',
        //         model: 'document',
        //         method: 'archiveScan',
        //         req: _.pick(req, 'query', 'session')
        //     })
        // }

        return new Promise(function(resolve, reject) {
            var request = require('request');
            var requestP = require('request-promise');
            var async = require('async');
            var forEach = require('async-foreach').forEach;
            var moment = require('moment');
            var closest = require('closest-to')
                /*  edison.v1.set("update ecritures set t_stasmp='" + _.random(10, 100) + "' WHERE 1=1",function(err, resp) {
                      console.log(err, resp)
                  });*/
            var i = 0;
            var limit = req.query.limit || 100;
            var archiveFile = function(file, cb) {
                console.log(String(i++) + '/' + String(limit))
                document.move('/SCAN/' + file.name, '/SCAN_ARCHIVES/' + file.name)
                    .then(function(resp) {
                        console.log('MV', file.name)
                        edison.v1.set("UPDATE scanner SET archived='1' WHERE id='" + file.id + "'", function() {
                            console.log('SAVED', file.name)
                            cb(null)
                        })
                    }, function(err) {
                        console.log('ERR', file.name, err)
                        if (_.includes(String(err), '404')) {
                            document.move('/SCAN_ARCHIVES/' + file.name, '/SCAN/' + file.name).then(function(resp) {
                                console.log('YEPYEPYEP')
                                cb(null)
                            }, function() {
                                console.log('SECERR')
                                cb(null);
                            })
                        }
                    });
            }


            var i = 0;
            edison.v1.get("SELECT * FROM scanner WHERE checked='1' AND archived='0' AND moved='1' LIMIT " + limit, function(err, resp) {
                    limit = resp.length;

                    /* for (var i = 0; i < resp.length; i+= 5) {
                         requestP
                     };*/
                    async.eachLimit(resp, 4, archiveFile, function(err, resp) {
                        console.log(err, resp)
                        resolve('ok')
                    })
                })
                /*            var convert = function(ts) {
                                var dt = ts.replace('.', '-').split('-').slice(0, -4).join('-');
                                var hr = ts.replace('.', '-').split('-').slice(3, 6).join(':');
                                var z = moment(dt + " " + hr).unix() * 1000
                                return z;
                            }


                            var locals = requireLocal('config/scan-dump')._locals;
                            var dtb = requireLocal('config/scan-dump')._dtb;
                            var dataBaseTs = _(dtb).pluck('start').map(function(e) {
                                return Number(e)
                            }).value();
                            locals = _.filter(locals, function(e) {
                                return e.endsWith('.pdf') && e.length === 23
                            }).reverse()


                            var rnd = _.random(0, 4000);

                            _.each(locals.slice(rnd, rnd + 500), function(e) {
                                var x = convert(e);
                                var cls = closest(x, dataBaseTs);
                                var diff = x - cls
                                var query = "UPDATE scanner SET checked='1', diff='" + diff + "', name='" + e + "' WHERE start='" + cls + "'";
                                console.log(query);
                                request.get("http://electricien13003.com/alvin/query.php?q=" + query,
                                        function(err, resp, body) {
                                            console.log('-->', body);
                                        })
                            })
                            resolve('ok')*/


            /*

                        request.get('http://electricien13003.com/alvin/dumpScanner.php', function(err, resp, datab) {
                            datab = JSON.parse(datab)
                            forEach(datab, function(e) {
                                var done = this.async();
                                setTimeout(done, req.query.timeout || 220);
                               // console.log('/SCAN/' + e.name, '/V2_PRODUCTION/intervention/' + e.id_inter+ '/' + e.name)
                               console.log(e.id_inter)
                                document.copy('/SCAN/' + e.name, '/V2_PRODUCTION/intervention/' + e.id_inter + '/' + e.name)
                                .then(function(x) {
                                    console.log('OK=>');
                                    var query = "UPDATE scanner SET moved='1' WHERE id='" + e.id + "'";
                                    console.log(query);
                                    request.get("http://electricien13003.com/alvin/query.php?q=" + query,
                                        function(err, resp, body) {
                                            console.log('-->', body);
                                        })
                                }, function() {
                                    console.log('ERRROROROR')
                                })
                            });
                        }, function() {
                            resolve('ok')
                        });*/



            // console.log(locals.length)
            /*            _.each(locals, function(e) {
                            
                            console.log(e);
                        })*/


            /*
                        async.each(locals.slice(rnd, rnd + 100), function(e, cb) {

                        })*/












            /*

                        var convert = function(ts) {
                            var z = ts.split('-')
                            return z;
                        }

                        var srch = function(date, locals) {
                            return 0;
                            _.each(locals, function(e) {
                                console.log('-->', e)
                            })
                        } 

                        var z = requireLocal('config/scan-dump');
                        var ee = function(dtb, locals) {
                            locals = _.filter(locals, function(e) {
                                return e.endsWith('.pdf') && e.length === 23
                            })

                            _.each(locals.slice(100, 101), function(e) {
                                var x = convert(e.start);
                                srch(x, locals);
                            })
                            resolve('ok')
                        }
            */
            // ee(z._dtb, z._locals)
            /*   request.get('http://electricien13003.com/SCAN/list.php', function(err, resp, locals) {
            locals = JSON.parse(locals);
                   request.get('http://electricien13003.com/alvin/dumpScanner.php', function(err, resp, dtb) {
                       dtb = JSON.parse(dtb)
                       console.log(dtb);
                       ee(dtb, locals)

                   })
               });*/

            /* db.model('document').update({
                     link: options.oldID
                 }, {
                     link: options.newID
                 }, {
                     multi: true
                 })
                 .then(function(e) {
                     if (e.nModified > 0) {
                         var x = "/V2/" + options.model + '/';
                         document.move(x + options.oldID, x + options.newID)
                             .then(resolve, reject);
                     }
                 }, reject);*/
        }).catch(__catch)
    }
}
