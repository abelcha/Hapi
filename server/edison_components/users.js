var Users = function() {
    var _this = this;
    db.model('user').find().then(function(resp) {
        _this.data = resp;
    })
}
Users.prototype.data = null;
Users.prototype.list = function() {
    return this.data
}

Users.prototype.search = function(oldLogin) {
    var _ = require('lodash')
    if (!this.data) {
        return 'auto_x';
    }
    var rtn = _.find(this.data, function(e) {
        return e.oldLogin === oldLogin;
    })
    if (!rtn) {
        return oldLogin;
    } else {
        return rtn.login
    }

}
module.exports = Users;
