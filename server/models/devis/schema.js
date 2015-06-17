module.exports = function(db) {

    return new db.Schema({
        _id: Number,
        id: Number,
        isDevis: {
            type: Boolean,
            default: true
        },
        status: {
            type: String,
            index: true,
            default: 'AEV' // ANN ATT AEV TRA
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
        prixAnnonce: Number,
        historique: [{
            date: {
                type: Date,
                default: Date.now,
            },
            login: String,
            mail: {}
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
                lt: Number,
                lg: Number,
            },
            location: [],
        },
        transfertId: Number,
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
