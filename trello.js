var request = require('superagent')
var _ = require('lodash')
var moment = require('moment')
var async = require('async')

//https://api.trello.com/1/boards/569bb7d5ae494faaa939b6ec/lists?key=5a9e1889d35e915be9d70f3950005704&token=27c943dc7534fade34f5cd1363257d945ee4dfa20b205770bb26202bc3a3dedc


var rest = require('restler');
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
			.query(_.extend(_this.auth(), query))
			.end(cb)
	}
}


Trello.prototype.post = function(args) {
	var _this = this;
	var url = _(arguments).reject(_.isObject).toArray().join('/');
	var query = _(arguments).find(_.isObject);
	return function(cb) {
		return rest.post(_this.url + url, {
			data: _.extend(_this.auth(), query)
		}).on('complete', cb);
	}
}

Trello.prototype.auth = function() {
	return {
		key: this.key,
		token: this.secret
	}
}

var trello = new Trello('5a9e1889d35e915be9d70f3950005704', '27c943dc7534fade34f5cd1363257d945ee4dfa20b205770bb26202bc3a3dedc')
	/*
	trello.post('boards', '569bb7d5ae494faaa939b6ec', 'list', {
		name: 'loltest'
	})(function(body, resp) {
		console.log('==>', body, resp)
	})*/


