var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
app.get('/', function(req, res) {
	res.sendFile("heythere");
});


io.on('connection', function(socket) {
	socket.on('___bridge_message___', function(message) {
		io.emit(message.title, message.data)
		console.log(new Date, '[BRIDGE]', 'Emited', message.title)
	});

});

http.listen(1995, function() {
	console.log('listening on *:1995');
});
