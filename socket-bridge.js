var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
app.get('/', function(req, res) {
	res.sendFile("heythere");
});

var socketlist = []
io.sockets.on('connection', function(socket) {
    socketlist.push(socket);
    socket.emit('socket_is_connected','You are connected!');
    socket.on('close', function () {
      console.log('socket closed');
      socketlist.splice(socketlist.indexOf(socket), 1);
    });
})
/*
io.on('connection', function(socket) {
	socket.on('___bridge_message___', function(message) {
		io.emit(message.title, message.data)
		console.log(new Date, '[BRIDGE]', 'Emited', message.title)
	});

});
*/
http.listen(1995, function() {
	console.log('listening on *:1995');
});
