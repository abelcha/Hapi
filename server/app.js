'use strict'

var cluster = require('cluster')

if (cluster.isMaster) {
    var cpuCount = require('os').cpus().length;
    for (var i = 0; i < process.env.CLUSTER_PROCESS_NBR; i++) {
        setTimeout(cluster.fork.bind(cluster), i * 1000)
    }
    return 0;
}
var express = require('express');
var app = express();
var http = require('http').Server(app);
var port = (process.env.PORT || 8080);
var path = require('path');
global.isWorker = false;


global.workerID = cluster.worker.id;
require('./shared.js')(express);

edison.expressMiddleware(express)

global.io = edison.socket()
global.jobs = edison.worker.initJobQueue();
require('./base-route.js')(app, express)
require('./routes.js')(app);
require('./error-route.js')(app)
process.on('uncaughtException', __catch);


if (cluster.worker.id == 1 && process.env.PLATFORM === 'DIGITAL_OCEAN') {
    new edison.timer();
}
http.listen(port, function() {
    console.log('listening on *:' + port);
    return !envDev && edison.event('REBOOT').save()
});

module.exports = app;
