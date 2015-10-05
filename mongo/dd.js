var inf = ISODate("2015-10-02T20:09:11.392Z");
var sup = ISODate("2015-10-02T12:09:11.392Z");

db.events.find({date:{$gt:sup, $lt:inf}}, {'data.v2.id':true, date:true, login:true})forEach(function(e){ print(e.data.v2.id); });