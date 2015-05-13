module.exports = function(db) {

  return new db.Schema({
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
  });

}
