module.exports = function(db) {

    return new db.Schema({
        _id: Number,
        id: {
            type: Number,
            index: true

        },
        status: {
            type: String,
            default: 'POT'
        },
        date: {
            ajout: {
                type: Date,
                default: Date.now
            }
        },
        login: {
            ajout: String,
        },
        origine: String, //CND/PRP
        nomSociete: {
            type: String,
            required: true,
        },
        formeJuridique: {
            type: String,
            required: true
        },
        representant: {
            civilite: String,
            nom: {
                type: String,
                required: true
            },
            prenom: String,
        },
        address: {
            n: {
                type: String,
                required: true
            },
            r: {
                type: String,
                required: true
            },
            v: {
                type: String,
                required: true
            },
            cp: {
                type: String,
                required: true
            },
            etage: String,
            code: String,
            lt: Number,
            lg: Number,
        },
        pourcentage: {
            deplacement: {
                type: Number,
                required: true
            },
            maindOeuvre: {
                type: Number,
                required: true
            },
            fourniture: {
                type: Number,
                required: true
            },
        },
        zoneChalandise: {
            type: Number,
            required: true
        },
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
        email: {
            type: String,
            required: true
        },
        telephone: {
            tel1: {
                type: String,
                required: true
            },
            tel2: String
        },
        archive: Boolean
    });
}
