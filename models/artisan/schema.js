module.exports = new npm.mongoose.Schema({
  id: {
    type: Number,
    index: true
  },
  nomSociete: String,
  formeJuridique: String,
  representant: {
    civilite: String,
    nom: String,
    prenom: String,
  },
  add: {
    n: String,
    r: String,
    v: String,
    cp: String,
    lt: Number,
    lg: Number,
  },
  pourcentage: {
    deplacement: Number,
    maindOeuvre: Number,
    fourniture: Number
  },
  zoneChalandise: Number,
  loc: {
    type: [Number, Number],
    index: '2d'
  },
  absence: {
    start:Date,
    end:Date
  },
  categories: [],
  email: String,
  telephone: {
    tel1: String,
    tel2: String
  },
  archive: Boolean
});
