module.exports = npm.mongoose.model('user', new npm.mongoose.Schema({
  portable: String,
  email: String,
  nom: String,
  prenom: String,
  pseudo: String,
  login: String,
  service: String,
  ligne: String,
  root: Boolean,
  password: String,
  activated: Boolean
}));
