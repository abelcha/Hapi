var socket = require('socket.io-client')('http://localhost:8080');
console.log('starting')
socket.on('connect', function(){
	console.log('connect')
});
socket.on('event', function(data){
	console.log('event')

});
socket.on('disconnect', function(){
	console.log('disconnect')

});
socket.on('error', function(err){
	console.log('error', new Date(), err)

});