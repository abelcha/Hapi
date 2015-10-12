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
    var _ = require('lodash')
    console.log('EVENT', _.omit(this.doc, 'data'));
    db.model('event')(this.doc).save(cb)
}


/*var z = new Event()
console.log('--<', z)*/

//var x = Event().login('chalie_a').type('ID_DESC').data({lol:'toto'}).save()
module.exports = Event;
