
var schema = new npm.mongoose.Schema({
  id: Number,
  telepro: String,
  dateAjout: Date,
  dateInter: Date,
  cat: String,
  sst: Number,
  etat:  String,
  desc: String,
  prixAnn: Number,
  prixFin: Number,
  modeRegl: String,
  reglSP: Boolean,
  facture: {},
  remarque: String,
  comments: [],
  produits: {},
  civ: String,
  prenom: String,
  nom: String,
  email: String,
  tel1: String,
  tel2: String,
  add: {
    n: Number,
    r: String,
    v: String,
    cp: String,
    lt: Number,
    lg: Number,
  },
  pmntCli: Date,
  pmntSst: Date
});

schema.statics.test = function(query) {

  return (new Promise(function(resolve, reject) {
    resolve({title:'swag', query:query});
  }));
/*
  return new promise(function(resolve, reject) {
    resolve("swag");
  });*/

}

var model = npm.mongoose.model('intervention', schema);

/*model.schema.path('sst').validate(function(value, callback) {
  artisanModel.findOne({id:value}, function(err, doc) {
    callback(err || doc.length == 0);
  });
}, "Le sous-traitant n'existe pas.");
*/

/* CARTE BANCAIRE | CHEQUE | CASH */
/*model.schema.path('modeRegl').validate(function(value) {
  return /CB|CH|CA/i.test(value);
}, 'Mode de reglement inconnu.');
*/


/*CARRELAGE|MENUISERIE|MACONNERIE|PEINTURE|PLOMBERIE|SERRURERIE|CLIMATISATION|CHAUFFAGE|VITRERIE|ELECTRICITE */
// model.schema.path('cat').validate(function(value) {
//   return /CR|MN|MC|PT|PL|SR|CL|CH|VT|EL/i.test(value);
// }, 'Categorie inconnue.');


module.exports = model;
