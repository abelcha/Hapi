module.exports = {
    categories: {
        PL: {
            suffix: 'de',
            short_name: 'PL',
            long_name: 'Plomberie',
            order: 0,
            color: 'blue white-text'
        },
        CH: {
            suffix: 'de',
            short_name: 'CH',
            long_name: 'Chauffage',
            order: 1,
            color: 'red white-text'
        },
        EL: {
            suffix: "d'",
            short_name: 'EL',
            long_name: 'Électricité',
            order: 2,
            color: 'yellow  accent-4 black-text'
        },
        SR: {
            suffix: 'de',
            short_name: 'SR',
            long_name: 'Serrurerie',
            order: 3,
            color: 'brown white-text'
        },
        VT: {
            suffix: 'de',
            short_name: 'VT',
            long_name: 'Vitrerie',
            order: 4,
            color: 'green white-text'
        },
        AS: {
            suffix: 'de',
            short_name: 'AS',
            long_name: 'Assainissement',
            order: 5,
            color: 'orange white-text'
        },
        CL: {
            suffix: 'de',
            short_name: 'CL',
            long_name: 'Climatisation',
            order: 6,
            color: 'teal white-text'
        },
        PT: {
            suffix: 'de',
            short_name: 'PT',
            long_name: 'Peinture',
            order: 7,
            color: 'deep-orange white-text'
        }
    },
    categoriesHash: function() {
        return [this.categories.PL,
            this.categories.CH,
            this.categories.EL,
            this.categories.SR,
            this.categories.VT,
            this.categories.AS,
            this.categories.CL,
            this.categories.PT
        ]
    },
    categoriesArray: function() {
        var x = [];
        for (var i in this.categories)
            x.push(this.categories[i]);
        return x;
    },
    etats: {
        ENV: {
            order: 0,
            short_name: 'ENV',
            long_name: 'Envoyé',
            color: 'orange'
        },
        RGL: {
            order: 1,
            short_name: 'RGL',
            long_name: 'Reglé',
            color: 'green'
        },
        PAY: {
            order: 2,
            short_name: 'PAY',
            long_name: 'Payé',
            color: 'green accent-4'
        },
        ATT: {
            order: 3,
            short_name: 'ATT',
            long_name: 'En Attente',
            color: 'purple'
        },
        APR: {
            order: 4,
            short_name: 'APR',
            long_name: 'A Progr.',
            color: 'blue'
        },
        AVR: {
            order: 5,
            short_name: 'AVR',
            long_name: 'A Vérifier',
            color: 'brown darken-3'
        },
        ANN: {
            order: 6,
            short_name: 'ANN',
            long_name: 'Annuler',
            color: 'red'
        }
    },
    etatsHash: function() {
        return [this.etats.ENV,
            this.etats.RGL,
            this.etats.PAY,
            this.etats.ATT,
            this.etats.APR,
            this.etats.AVR,
            this.etats.ANN
        ]
    },
    colorEnvoisDevis: function(i) {
        if (i === 0)
            return 'white';
        if (i === 1)
            return 'grey';
        if (i === 2)
            return 'black'
        return 'red'
    },
    etatsDevis: {
        AEV: {
            short_name: 'ENV',
            long_name: 'A Envoyer',
            color: 'blue'
        },
        ANN: {
            short_name: 'ANN',
            long_name: 'Annuler',
            color: 'red'
        },
        TRA: {
            short_name: 'TRA',
            long_name: 'Transferé',
            color: 'green accent-4'
        },
        ATT: {
            short_name: 'ATT',
            long_name: 'En Attente',
            color: 'purple'
        }
    },
    fournisseur: [{
        short_name: 'ARTISAN',
        type: 'Fourniture Artisan'
    }, {
        short_name: 'CEDEO',
        type: 'Fourniture Edison'
    }, {
        short_name: 'BROSSETTE',
        type: 'Fourniture Edison'
    }, {
        short_name: 'REXEL',
        type: 'Fourniture Edison'
    }, {
        short_name: 'COAXEL',
        type: 'Fourniture Edison'
    }, {
        short_name: 'YESSS ELECTRIQUE',
        type: 'Fourniture Edison'
    }, {
        short_name: 'CGED',
        type: 'Fourniture Edison'
    }, {
        short_name: 'COSTA',
        type: 'Fourniture Edison'
    }, {
        short_name: 'FORUM DU BATIMENT',
        type: 'Fourniture Edison'
    }],
    modeDeReglements: [{
        short_name: 'CB',
        long_name: 'Carte Bancaire'
    }, {
        short_name: 'CH',
        long_name: 'Chèque'
    }, {
        short_name: 'CA',
        long_name: 'Espèces'
    }],
    tva: [{
        short_name: 10,
        long_name: "TVA: 10%"
    }, {
        short_name: 20,
        long_name: "TVA: 20%"
    }],
    typePayeur: [{
        short_name: 'SOC',
        long_name: 'Société'
    }, {
        short_name: 'PRO',
        long_name: 'Propriétaire'
    }, {
        short_name: 'LOC',
        long_name: 'Locataire'
    }, {
        short_name: 'IMO',
        long_name: 'Agence Immobilière'
    }, {
        short_name: 'CUR',
        long_name: 'Curatelle'
    }, {
        short_name: 'AUT',
        long_name: 'Autre'
    }],
    civilites: [{
        short_name: 'M.',
        long_name: 'Monsieur'
    }, {
        short_name: 'Mme.',
        long_name: 'Madame'
    }, {
        short_name: 'Soc.',
        long_name: 'Société'
    }],
    causeAnnulation: [{
        type: "client",
        short_name: "PB_RES",
        long_name: "Le problème est résolu"
    }, {
        type: "client",
        short_name: "PX_TP_CHR",
        long_name: "Le prix est trop cher"
    }, {
        type: "client",
        short_name: "CLI_REP_P",
        long_name: "Le client ne répond pas"
    }, {
        type: "sous-traitant",
        short_name: "SST_P_DSP",
        long_name: "Le sous-traitant n'est pas disponible"
    }, {
        type: "sous-traitant",
        short_name: "SST_REP_PS",
        long_name: "Le sous-traitant ne répond pas"
    }, {
        type: "sous-traitant",
        short_name: "SST_SHT_PS",
        long_name: "Le ne souhaite pas faire l'intervention"
    }, {
        type: "sous-traitant",
        short_name: "SST_PS_APL",
        long_name: "Le sous-traitant n'a jamais appelé le client"
    }, {
        type: "partenariat",
        short_name: "PS_SST",
        long_name: "Il n'y a pas de sst dans la zone"
    }, {
        type: "partenariat",
        short_name: "PS_SST",
        long_name: "Il n'y a pas de sst dans la zone"
    }],
    getCauseAnnulation: function(short_name) {
        var _find = require('lodash/collection/find');
        return _find(this.causeAnnulation, function(e) {
            return e.short_name === short_name
        })
    },
    formeJuridique: {
        AUT: {
            type: "TVA 0%",
            short_name: "AUT",
            long_name: "AUTO-ENTREPRENEUR",
        },
        SARL: {
            type: "TVA 20%",
            short_name: "SARL",
            long_name: "SARL"
        },
        SAS: {
            type: "TVA 20%",
            short_name: "SAS",
            long_name: "SAS"
        },
        SASU: {
            type: "TVA 20%",
            short_name: "SASU",
            long_name: "SASU"
        },
        EURL: {
            type: "TVA 20%",
            short_name: "EURL",
            long_name: "EURL"
        },
        ART: {
            type: "TVA 20%",
            short_name: "ART",
            long_name: "ARTISAN"
        },
        IND: {
            type: "TVA 20%",
            short_name: "IND",
            long_name: "ENTREPRENEUR INDIVIDUEL"
        }
    },
    formeJuridiqueHash: function() {
        return [
            this.formeJuridique.AUT,
            this.formeJuridique.SARL,
            this.formeJuridique.SAS,
            this.formeJuridique.SASU,
            this.formeJuridique.EURL,
            this.formeJuridique.ART,
            this.formeJuridique.IND,
        ]
    },
    etatsArtisan: {
        ACT: {
            long_name: "Actif",
            short_name: "ACT",
            color: 'green'
        },
        ARC: {
            long_name: "Archivé",
            short_name: "ACT",
            color: 'red'
        },
        POT: {
            long_name: "Potentiel",
            short_name: "POT",
            color: 'blue'
        }
    },
    cardType: {
        VS: {
            long_name: "Visa",
            short_name: "VS",
        },
        AE: {
            long_name: "American Express",
            short_name: "AE",
        },
        MC: {
            long_name: "MasterCard",
            short_name: "MC",
        }
    },
    cardTypeArray: function() {
        return [this.cardType.VS, this.cardType.AE, this.cardType.MC];
    },
    artisanFiles: [
        'contrat_2014',
        'contrat',
        'kbis',
        'autofacturation',
        'cni',
        'assurance',
        'rib',
        'ursaff',
        'autres'
    ],
    artisanOrigine: {
        DEM: {
            order: 0,
            short_name: 'DEM',
            color: 'red',
            long_name: "demarché"
        },
        CAND: {
            order: 1,
            color: 'yellow',
            short_name: 'CAND',
            long_name: "Candidat"
        }
    },
    artisanOrigineArray: function() {
        return [this.artisanOrigine.DEM, this.artisanOrigine.CAND];
    },
    artisanSubStatus: {
        NEW: {
            long_name: 'New',
            short_name: 'NEW',
            color: 'blue'
        },
        REG:{
            long_name:'Régulier',
            short_name:'REG',
            color:'green'
        },
        HOT:{
            long_name:'Hot',
            short_name:'HOT',
            color:'purple'
        }
    }
}
