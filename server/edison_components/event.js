    var argx = require('argx');


    var Event = function(type, login, id, data, cb) {
        var model = db.model('event');
        var args = argx(arguments);
        var Ev = {};
        var cb = args.pop('function') ||   function() {}
        Ev.data = args.pop('object');
        Ev.id = args.pop('number');
        Ev.login = args.pop('string');
        Ev.type = args.pop('string');
        if (!Ev.type) {
            Ev.type = Ev.login;
            Ev.login = undefined;
        }
        Ev.login = (Ev.login || "auto");
        new model(Ev).save(cb)
    }


    module.exports = Event;
