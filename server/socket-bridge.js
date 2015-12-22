var io = require('socket.io').listen(8001);

io.on('connection', function(socket) {
	socket.on('___bridge_message___', function(message) {
		io.emit(message.title, message.data)
		console.log(new Date, '[BRIDGE]', 'Emited', message.title)
	});

});
