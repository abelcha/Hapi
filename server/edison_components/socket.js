module.exports = function() {

	var socket = require('socket.io-client')('http://localhost:1995');
	return {
		sockets: {
			emit: function(title, data) {
			    console.log('herelol')
				socket.emit('___bridge_message___', {
					title: title,
					data: data
				})
			}
		}
	}

}
