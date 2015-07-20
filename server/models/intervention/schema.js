module.exports = function(db) {

    var schema = new db.Schema({
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
        subStatus: String,
        causeAnnulation: String,
        login: {
            ajout: String,
            envoi: String,
            envoiFacture: String,
            intervention: String,
            verification: String,
            paiementCLI: String,
            paiementSST: String,
            demarchage: String,
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
            demarchage: Date
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
                tel2: String,
                tel3: String

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
                batiment: String,
                lt: Number,
                lg: Number,
            },
            location: [],
        },
        facture: {
            compte: String,
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
        cb: {
            hash: String,
            preview: String,
            /* never clear*/
            cardType: String,
            number: String,
            expMonth: Number,
            expYear: Number,
            cvc: Number,
        },
        fourniture: [{
            bl: String,
            pu: Number,
            quantite: Number,
            title: String,
            fournisseur: String
        }],
        modeReglement: {
            type: String
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
        demarchePar: String,
        devisOrigine: Number,
        fournisseur: String,
        coutFourniture: {
            type: Number,
            default: 0
        },
        tva: {
            type: Number,
            default: 20
        },
        compta: {
            paiement: {
                pourcentage: {
                    deplacement: Number,
                    maindOeuvre: Number,
                    fourniture: Number
                },
                ready: {
                    type: Boolean,
                    default: false
                }
            },
            historique: [{
                flushed: Date,
                pourcentage: {
                    deplacement: Number,
                    maindOeuvre: Number,
                    fourniture: Number
                },
                montantFinal: Number,
                prixFinal: Number,
            }]
        }
    });
    return schema
}
