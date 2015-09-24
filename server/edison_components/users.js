var Users = function() {
	var _this = this;
	db.model('user').find().then(function(resp) {
		_this.data = resp;
	})
}
Users.prototype.data = null;
Users.prototype.list = function() {
	return this.resp
}

module.exports = Users;