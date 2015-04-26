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

schema.statics.rank = function(req, req) {
  var self = this;
  return new Promise(function(resolve, reject) {
    /*var point = {
      type: "Point",
      coordinates: [parseFloat(query.lat), parseFloat(query.lng)]
    };*/
    res.json([req, res])
    var options = {
      distanceMultiplier: 100,
      maxDistance: (parseFloat(query.maxDistance) || 30) * 0.01
    }
    self.geoNear(point, options, function(err, docs) {
      if (err)
        return resolve(err);
      var rtn = [];
      for (var i = 0; i < docs.length; i++) {
        if (!query.categorie || docs[i].obj.categories.indexOf(query.categorie) >= 0) {
          if (i > query.limit)
            break;
          rtn.push({
            distance: docs[i].dis.toFixed(1),
            categories: docs[i].obj.categories,
            address: docs[i].obj.add,
            id: docs[i].obj.id,
            nomSociete: docs[i].obj.nomSociete
          })
        }
      };
      resolve(rtn);
    });
  })
}


var model = npm.mongoose.model('artisan', schema);

module.exports = model;
