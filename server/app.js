'use strict'

var cluster = require('cluster')

if (cluster.isMaster) {
    console.log('MASSTER')

    // Count the machine's CPUs
    var cpuCount = require('os').cpus().length;
    console.log("CPU", cpuCount)
        // Create a worker for each CPU
    for (var i = 0; i < process.env.CLUSTER_PROCESS_NBR; i++) {
        console.log('FORK')
        setTimeout( cluster.fork.bind(cluster), i * 1000)

    }
    return 0;
    // Code to run if we're in a worker process
}
console.log('==>SLAVE', process.pid)





var express = require('express');
var app = express();
var http = require('http').Server(app);
var port = (process.env.PORT || 8080);
var path = require('path');
var io_redis = require('socket.io-redis');

global.io = require('socket.io')(http);
io.set('transports', ['polling']);
io.adapter(io_redis({
    host: 'localhost',
    port: 6379
}));



require('./shared.js')(express);
edison.expressMiddleware(express)
global.jobs = edison.worker.initJobQueue();
global.isWorker = false;
new edison.timer();
require('./base-route.js')(app, express)
require('./routes.js')(app);
require('./error-route.js')(app)
process.on('uncaughtException', __catch);

http.listen(port, function() {
    console.log('listening on *:' + port);
    return !envDev && edison.event('REBOOT').save()
});

module.exports = app;
