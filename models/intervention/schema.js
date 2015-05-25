module.exports = function(db) {

    return new db.Schema({
        id: {
            type: Number,
            index: true
        },
        status: {
            type: String,
            index: true,
            default: 'APR'
        },
        login: {
            ajout:String,
            envoi: String,
            envoiFacture:String,
            intervention: String,
            verification: String,
            paiementCLI: String,
            paiementSST: String,
        },
        telepro: String,
        comments: [
            /*
            {login, text, date},
            */
        ],
        date: {
            envoi: Date,
            ajout: {
                type: Date,
                default: Date.now()
            },
            envoiFacture:Date,
            intervention: Date,
            verification: Date,
            paiementCLI: Date,
            paiementSST: Date,
        },
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
                /*
                t1: String,
                t2: String,
                */
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
                lt: String,
                lg: String,
            },
            location: [],
        },
        facture: {
            /*    type: String,
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
                tva:Number
            */
        },
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
        modeReglement: {
            type: String,
            required: true
        },
        prixAnnonce: {
            type: Number,
            default: 0
        },
        prixFinal: Number,
        reglementSurPlace: Boolean,
        aDemarcher: Boolean,
        fournisseur: String,
        coutFourniture: Number,
        tva: Number
    });
}
