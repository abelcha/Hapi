module.exports = function(db) {

    return new db.Schema({
        nom: String,
        prenom: String,
        portable: String,
        email: String,
        nom: String,
        prenom: String,
        pseudo: String,
        login: {
            type: String,
            required: true
        },
        oldLogin: String,
        _id: String,
        service: String,
        ligne: String,
        root: Boolean,
        password: String,
        passInit: {
            type: Boolean,
            default: false
        },
        activated: {
            type: Boolean,
            default: false
        }
    });

}
