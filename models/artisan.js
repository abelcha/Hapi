var schema = new npm.mongoose.Schema({
  id: Number,
  civ: String,
  nomSociete: String,
  nomRep: String,
  prenomRep: String,
  categories: [],
  formeJuridique: String,
  email: String,
  tel1: String,
  tel2: String,
  archive: Boolean,
  dateAjout: Date,
  ajoutePar: String,
  add: {
    n: String,
    r: String,
    v: String,
    cp: String,
    lt: Number,
    lg: Number,
  },
  loc: [Number, Number]
});

schema.statics.rank = function(query) {
  var self = this;
  return new Promise(function(resolve, reject) {
    var point = {
      type: "Point",
      coordinates: [parseFloat(query.lat), parseFloat(query.lng)]
    };
    var options = {
      distanceMultiplier: 100,
      limit: parseInt(query.limit) || 20,
      maxDistance: (parseFloat(query.maxDistance) || 30) * 0.01
    }
    self.geoNear(point, options, function(err, docs) {
      if (err)
        return resolve(err);
      var rtn = docs.map(function(e) {
        return {
          distance: e.dis.toFixed(1),
          address: e.obj.add,
          id: e.obj.id,
          nomSociete: e.obj.nomSociete
        }
      });
      resolve(rtn);
    });
  })
}


var model = npm.mongoose.model('artisan', schema);

module.exports = model;
