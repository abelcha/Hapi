module.exports = function() {
	var socket = require('socket.io-client')('http://localhost:1995');
	return {
		emit: function(title, data) {
			socket.emit('bridge_message', {
				title: title,
				data: data
			})
		}
	}
}
