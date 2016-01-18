var request = require('superagent');
var _ = require('lodash')

var Trello = function(key, secret) {
	this.key = key;
	this.secret = secret;
	this.url = 'https://api.trello.com/1/';

}

Trello.prototype.get = function(args) {
	var _this = this;
	var url = _(arguments).reject(_.isObject).toArray().join('/');
	var query = _(arguments).find(_.isObject);
	return function(cb) {
		return request.get(_this.url + url)
			.query(_this.auth())
			.query(query)
			.end(cb)
	}
}


Trello.prototype.put = function(args) {
	var _this = this;
	var url = _(arguments).reject(_.isObject).toArray().join('/');
	var query = _(arguments).find(_.isObject);
	return function(cb) {
		//console.log('PUT', url, query)
		request.put(_this.url + url)
			.send(trello.auth())
			.send(query)
			.end(cb)
	}
}


Trello.prototype.post = function(args) {
	var _this = this;
	var url = _(arguments).reject(_.isObject).toArray().join('/');
	var query = _(arguments).find(_.isObject);
	return function(cb) {
		//console.log('POST', url, query)
		request.post(_this.url + url)
			.send(trello.auth())
			.send(query)
			.end(cb)
	}
}

Trello.prototype.auth = function() {
	return {
		key: this.key,
		token: this.secret
	}
}

module.exports = Trello;
