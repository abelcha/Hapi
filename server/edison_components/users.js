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

Users.prototype.search = function(oldLogin) {
    var _ = require('lodash')
    if (!this.data) {
        return 'auto_x';
    }
    var rtn = _.find(this.data, function(e) {
        console.log(e, oldLogin)
        return e.oldLogin === oldLogin;
    })
    console.log(rtn)
    if (!rtn) {
        return oldLogin;
    } else {
        return rtn.login
    }

}
module.exports = Users;
