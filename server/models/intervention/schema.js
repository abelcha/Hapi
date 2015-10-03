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
            annulation: String,
            verification: String,
            paiementCLI: String,
            paiementSST: String,
            demarchage: String,
        },
        date: {
            envoi: Date,
            ajout: {
                type: Date,
                default: Date.now
            },
            envoiFacture: Date,
            intervention: Date,
            verification: Date,
            annulation: Date,
            paiementCLI: Date,
            paiementSST: Date,
            demarchage: Date,
            dump: Date,
        },
        comments: [{
            login: String,
            text: String,
            date: Date
        }],
        historique: [],
        client: { //
            civilite: {
                type: String,
                required: true
            },
            prenom: {
                type: String,
                default: ""
            },
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
                tel3: String,
                origine: String,
                appel: String,
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
            sst: Number,
            date: Date,
        }],
        sst: {
            type: Number,
            ref: 'artisan'
        },
        litige: {
            openedBy: String,
            closedBy: String,
            opened: Date,
            closed: Date,
            description: String,
            open: Boolean
        },
        litiges: [{
            status: String,
            description: String,
            login: String,
            date: Date,
            regle: Boolean
        }],
        litigesEnCours: {
            type: Boolean,
            default: true
        },
        savEnCours: {
            type: Boolean,
            default: true
        },
        categorie: {
            type: String,
            required: true
        },
        artisan: {
            id: {
                type: Number,
                ref: 'artisan'
            },
            nomSociete: String
        },
        description: {
            type: String,
            required: true
        },
        descriptionTags: [
            String
        ],
        remarque: {
            type: String,
            default: 'PAS DE REMARQUES'
        },
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
        combo: String,
        modeReglement: {
            type: String,
            default: 'CH'
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
        enDemarchage: {
            type: Boolean,
            default: false
        },
        demarchePar: String,
        devisOrigine: {
            type: Number,
            ref: 'devis'
        },
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
            reglement: {
                date: Date,
                login: {
                    type: String,
                    default: 'vincent_q'
                },
                recu: {
                    type: Boolean,
                    default: false
                },
                montant: {
                    type: Number,
                    default: 0
                },
                avoir: {
                    _type: String,
                    montant: Number,
                    effectue: {
                        type: Boolean,
                        default: false
                    },
                    date: Date
                },
                historique: [{
                    _type: {
                        type: String,
                        default: 'ENCAISSEMENT'
                    },
                    _typeAvoir: String,
                    montant: Number,
                    login: {
                        type: String,
                        default: 'vincent_q'
                    },
                    date: {
                        type: Date,
                        default: Date.now
                    },
                }]
            },
            paiement: {
                mode: String,
                tva: {
                    type: Number,
                    default: 0
                },
                base: Number,
                montant: Number,
                pourcentage: {
                    deplacement: Number,
                    maindOeuvre: Number,
                    fourniture: Number
                },
                dette: {
                    type: Boolean,
                    default: false
                },
                effectue: {
                    index: true,
                    type: Boolean,
                    default: false
                },
                ready: {
                    index: true,
                    type: Boolean,
                    default: false
                },
                date: Date,
                login: {
                    type: String,
                    default: 'vincent_q'
                },
                historique: [{
                    tva:  {
                        type: Number,
                        default: 0
                    },
                    fourniture: {
                        artisan: Number,
                        edison: Number,
                    },
                    dateAjout: Date,
                    dateFlush: Date,
                    loginAjout: {
                        type: String,
                        default: 'vincent_q'
                    },
                    loginFlush: {
                        type: String,
                        default: 'vincent_q'
                    },
                    _type: {
                        type: String,
                        default: 'AUTO-FACT'
                    },
                    pourcentage: {
                        deplacement: {
                            type: Number,
                            default: 50
                        },
                        maindOeuvre: {
                            type: Number,
                            default: 30
                        },
                        fourniture: {
                            type: Number,
                            default: 30
                        }
                    },
                    mode: String,
                    base: Number,
                    montant: Number,
                    payed: Number,
                    'final': Number,
                    numeroCheque: String
                }]
            },
            info: {
                factureNC: Boolean, // facture de l'intervention (si reglemenet est sur place)
                tvaNC: Boolean, // attestation de tva (si tva=10%)
                devisNC: Boolean, // devis (> 150)
                fournitureNC: Boolean,

            },
        },
        recouvrement: {
            level: {
                type: Number,
                default: 0
            }
        },
        relance: {
            r1: Date,
            r2: Date,
            r3: Date,
        },
        sms: {
            ref: 'sms',
            type: String
        },
        smsStatus: Number,
        file: [{
            name: String,
            mimeType: String,
            origin: String, //SCAN, UPLOAD, AUTO

        }],
        cache: {

        }
    }, {
        versionKey: false
    });
    return schema
}
