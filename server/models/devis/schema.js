module.exports = function(db) {

    return new db.Schema({
        _id: Number,
        id: Number,
        status: {
            type: String,
            index: true,
            default: 'APR' // ANN ATT AEV TRA
        },
        causeAnnulation: String,
        login: {
            annulation: String,
            ajout: String,
            transfert: String
        },
        date: {
            annulation: String,
            ajout: {
                type: Date,
                default: Date.now
            },
            transfert: Date
        },
        historique: [{
            date: Date,
            login: String,
        }],
        client: { //
            civilite: {
                type: String,
                required: true
            },
            prenom: String,
            nom: {
                type: String,
                required: true
            },
            email: String,
            telephone: {
                tel1: {
                    type: String,
                    required: true
                },
                tel2: String
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
                lt: String,
                lg: String,
            },
            location: [],
        },
        categorie: String,
        produits: [{
            pu: Number,
            quantite: Number,
            title: String,
            ref: String,
            desc: String
        }],
        tva: {
            type: Number,
            default: 20
        }
    });
}
