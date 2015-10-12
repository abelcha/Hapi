var _ = require('lodash')

var Event = function(type) {
    if (!(this instanceof Event)) {
        return new Event(type);
    }
    this.doc = {
        login: 'auto',
        date: new Date,
        type: type ||  'UNKNOWN',
    }
}

Event.prototype.login = function(login) {
    this.doc.login = login;
    return this;
}

Event.prototype.type = function(type) {
    this.doc.type = type;
    return this;
}

Event.prototype.id = function(id) {
    this.doc.id = id;
    return this;
}

Event.prototype.data = function(data) {
    this.doc.data = data;
    return this;
}
Event.prototype.date = function(date) {
    this.doc.date = date;
    return this;
}
Event.prototype.save = function(cb) {
    db.model('event')(this.doc).save(console.log)
    return this
}

Event.prototype.broadcast = function(dest) {
    this.brDest = dest
    return this
}

Event.prototype.color = function(color) {
    this.brColor = color
    return this
}
Event.prototype.message = function(message) {
    this.brMessage = message
    this.doc.message = message
    return this
}

Event.prototype.send = function() {
    var _this = this;
    if (typeof io !== 'undefined') {

        io.sockets.emit('notification', {
            message: _this.brMessage,
            dest: _this.brDest,
            color: _this.brColor || 'blue',
            origin: _this.doc.login
        })
    } else {
        console.log('SOCKET UNAVAILABLE')
    }
    return this;
}


/*var z = new Event()
console.log('--<', z)*/

//var x = Event().login('chalie_a').type('ID_DESC').data({lol:'toto'}).save()
module.exports = Event;
