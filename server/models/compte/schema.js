module.exports = function(db) {

    return new db.Schema({
        relance: String,
        compte: String,
        ref: String,
        payeur: String,
        nom: String,
        prenom: String,
        tel: String,
        tel2: String,
        email: String,
        address: {
            n: String,
            r: String,
            v: String,
            cp: String,
        },
    });

}
