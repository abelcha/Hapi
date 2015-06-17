module.exports = function(db) {

    return new db.Schema({
        _id: Number,
        id: {
            type: Number,
            index: true
        },
        status: {
            type: String,
            index: true,
            default: 'APR'
        },
        causeAnnulation: String,
        login: {
            ajout: String,
            envoi: String,
            envoiFacture: String,
            intervention: String,
            verification: String,
            paiementCLI: String,
            paiementSST: String,
        },
        telepro: String,
        comments: [{
            login: String,
            text: String,
            date: Date
        }],
        date: {
            envoi: Date,
            ajout: {
                type: Date,
                default: Date.now
            },
            envoiFacture: Date,
            intervention: Date,
            verification: Date,
            paiementCLI: Date,
            paiementSST: Date,
        },
        historique: [{
            date: Date,
            login: String,
            data: {},
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
        facture: {
            payeur: String,
            nom: String,
            prenom: String,
            tel: String,
            email: String,
            address: {
                n: String,
                r: String,
                v: String,
                cp: String,
            },
            tva: Number
        },
        sav: [{
            status: String,
            description: String,
            login: String,
            artisan: {
                id: {
                    type: Number,
                    ref: 'artisan'
                },
                nomSociete: String,
            },
            date: Date,
        }],
        litiges: [{
            status: String,
            description: String,
            login: String,
            date: Date,
            regle: Boolean
        }],
        categorie: {
            type: String,
            required: true
        },
        artisan: {
            id: Number,
            nomSociete: String
        },
        description: {
            type: String,
            required: true
        },
        remarque: String,
        produits: [{
            pu: Number,
            quantite: Number,
            title: String,
            ref: String,
            desc: String
        }],
        fourniture: [{
            ref: String,
            pu: Number,
            quantite: Number,
            title: String,
            fournisseur: String
        }],
        modeReglement: {
            type: String,
            required: true
        },
        prixAnnonce: {
            type: Number,
            default: 0
        },
        prixFinal: {
            type: Number,
            default: 0
        },
        reglementSurPlace: {
            type: Boolean,
            default: true
        },
        aDemarcher: {
            type: Boolean,
            default: false
        },
        devisOrigine: Number,
        fournisseur: String,
        coutFourniture: {
            type: Number,
            default: 0
        },
        tva: {
            type: Number,
            default: 20
        }
    });
}
