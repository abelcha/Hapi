var supertest = require('supertest')
var _ = require('lodash')

var apiurl = "http://127.0.0.1:8080";
var api = supertest(apiurl);
var bot_usr = {
	password: 'bb8',
	username: 'bot'
}
module.exports = {
	bot_usr: bot_usr,
	api: api,
	regularize: function(inst) {
		var tmp = _.omit(inst, 'id', '_id', 'date');
		tmp.cache = _.omit(inst.cache, 'da', 'id');
		return tmp;
	},
	connectSocket: function(done) {
		this.socket = require('socket.io-client')('http://localhost:1995');
		this.socket.on('connect', done);
	},

	delayMessage: function(socket, name, time) {
		socket.on(name, _.once(function(data) {
			setTimeout(function() {
				socket.emit('___bridge_message___', {
					title: name,
					data: data
				})
			}, time || 500)
		}))
	},
	login: function(cb) {
		var _this = this;
		api.post('/login')
			.send(bot_usr)
			.end(function(err, resp) {
				_this.sessionCookies = resp.headers['set-cookie'];
				cb(null, resp.headers['set-cookie'])
			})
	}
}
