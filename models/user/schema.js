module.exports = function(db) {

    return new db.Schema({
        nom: String,
        prenom: String,
        portable: String,
        email: String,
        nom: String,
        prenom: String,
        pseudo: String,
        login: String,
        _id: String,
        service: String,
        ligne: String,
        root: Boolean,
        password: String,
        activated: Boolean
    });

}
