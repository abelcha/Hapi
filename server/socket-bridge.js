var Server = require('socket.io');
var io = new Server();
io.on('connection', function(socket) {
	socket.on('___bridge_message___', function(message) {
		io.emit(message.title, message.data)
		console.log('SOCKET', message.title)
		//console.log(new Date, '[BRIDGE]', 'Emited', message.title, message.data)
	});

});
io.listen(1995)