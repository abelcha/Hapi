    var _ = require('lodash');

    module.exports = function(core) {


        var Dump = function(req, res) {
            if (req.query.id) {
                return singleDump(req.query.id, req.query.login || req.session.login, req.query.convert)
            } else if (!isWorker) {
                console.log('dump worker')
                return edison.worker.createJob({
                    name: 'db',
                    model: core.name,
                    method: 'dump',
                    req: _.pick(req, 'query', 'session')
                })
            } else {
                return multiDump(req.query.limit ||  0)
            }
        }


        var multiDump = function(limit) {
            return new Promise(function(resolve, reject) {
                core.model().remove({}, function() {
                    var request = require("request");
                    console.time('request')
                    request(core.multiDumpUrl(limit), function(err, rest, body) {
                        var async = require('async')
                        console.timeEnd('request')
                        var data = JSON.parse(body);
                        var i = 0;
                        console.time('dump')
                        async.eachLimit(data, 50, function(e, callback) {
                            console.log(e.id)
                            if (++i % 100 == 0)
                                console.log(_.round(i / data.length * 100, 2), "%")
                            core.model()(core.toV2(e)).save(function(err, resp) {
                                if (err) console.log('=>', e.id, err);
                                callback(null);
                            });
                        }, function(err, resp) {
                            console.timeEnd('dump')
                            if (err) {
                                return resolve(err);
                            }
                            core.model().fullReload().then(resolve, reject)
                        })
                    });
                });


            });
        }

        var singleDump = function(id, login, convert) {
            console.log('dumpOne', id)
            return new Promise(function(resolve, reject) {
                var V1 = requireLocal('config/_convert_V1');
                var request = require("request");
                _.delay(function() {
                    request.get(core.singleDumpUrl(id), function(err, resp, body) {
                        if (err || resp.statusCode !== 200 || !body || body == 'null') {
                            console.log('rejected', id)
                            return reject('nope')
                        }
                        var v1 = JSON.parse(body)
                        var v2 = core.toV2(v1)
                        if (!convert)
                            v2.date.dump = Date.now();
                        edison.event('DUMP_' + core.NAME).login(edison.users.search(login)).id(id).data({
                            v1: v1,
                            v2: v2
                        }).save()
                        core.model().findById(parseInt(id), function(err, doc) {
                            if (doc) {
                                doc = _.assign(doc, v2);
                            } else {
                                doc = core.model()(v2);
                            }
                            doc.save().then(resolve, reject);
                        })
                    });
                }, login === "CMD" || 1000)
            })
        }
        return Dump;
    }
