module.exports = function(db) {

    return new db.Schema({
        _id: Number,
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
        address: {
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
            type: [Number],
            index: '2d'
        },
        absences: {
            start: Date,
            end: Date,
            login: String,
            date: {
                type: Date,
                default: Date.now
            }
        },
        categories: [],
        email: String,
        telephone: {
            tel1: String,
            tel2: String
        },
        archive: Boolean
    });
}
