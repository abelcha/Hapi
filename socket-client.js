var socket = require('socket.io-client')('http://localhost:1995');
socket.on('connect', function() {

	console.log('connected')

});

socket.on('filterStatsReload', function(message) {
	console.log(new Date, '[CLIENT] - RELOAD STATS')
});

socket.on('disconnect', function() {
	console.log('disconnect')

});

socket.on('event', function() {
	console.log('event')
})

socket.on('error', function(err) {
	console.log('error', new Date(), err)

});
/*
socket.on('bridge_message', function(err) {
	console.log('bridge_message')
});
*/
