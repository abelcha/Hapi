module.exports = {
    categories: {
        PL: {
            id_compta: 2,
            suffix: 'de',
            short_name: 'PL',
            long_name: 'Plomberie',
            order: 0,
            color_hex: '#2196F3',
            color: 'blue white-text'
        },
        CH: {
            id_compta: 3,
            suffix: 'de',
            short_name: 'CH',
            long_name: 'Chauffage',
            order: 1,
            color_hex: '#F44336',
            color: 'red white-text'
        },
        EL: {
            id_compta: 1,
            suffix: "d'",
            short_name: 'EL',
            long_name: 'Électricité',
            order: 2,
            color_hex: '#ffeb3b',
            color: 'yellow  accent-4 black-text'
        },
        SR: {
            id_compta: 5,
            suffix: 'de',
            short_name: 'SR',
            long_name: 'Serrurerie',
            order: 3,
            color_hex: "#795548",
            color: 'brown white-text'
        },
        VT: {
            id_compta: 4,
            suffix: 'de',
            short_name: 'VT',
            long_name: 'Vitrerie',
            order: 4,
            color_hex: "#4CAF50",
            color: 'green white-text'
        },
        AS: {
            id_compta: 7,
            suffix: 'de',
            short_name: 'AS',
            long_name: 'Assainissement',
            order: 5,
            color_hex: "#ff9800",
            color: 'orange white-text'
        },
        CL: {
            id_compta: 6,
            suffix: 'de',
            short_name: 'CL',
            long_name: 'Climatisation',
            order: 6,
            color_hex: "#e0f2f1",
            color: 'teal white-text'
        },
        PT: {
            id_compta: 9,
            suffix: 'de',
            short_name: 'PT',
            long_name: 'Peinture',
            order: 7,
            color_hex: "#ff5722",
            color: 'deep-orange white-text'
        }
    },
    paiementArtisan: [{}, {
        title: 'En Cours',
        color: 'orange',
        icon: 'ellipsis-h',
        id: 1
    }, {
        title: 'Payé',
        color: 'green',
        icon: 'check',
        id: 1
    }],
    reglementClient: [{
        title: '',
        id: ''
    }, {
        title: 'Réglé',
        id: 1,
        color: "green",
        icon: 'check'
    }, {
        id: 2,
        title: 'Sst Att. Urgent',
        color: 'red',
        icon: 'truck'
    }, {
        id: 3,
        title: 'Sst Att.',
        color: 'orange',
        icon: 'truck'
    }, {
        id: 4,
        title: 'Cli. Att. Urgent',
        color: 'red',
        icon: 'user'
    }, {
        id: 5,
        title: 'Cli. Att.',
        color: 'orange',
        icon: 'user'
    }],
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
    libellePaiement: {
        'AUTO-FACT': {
            long_name: 'auto-facture',
            short_name: 'STF'
        },
        'AVOIR': {
            long_name: 'avoir',
            short_name: 'STA'
        },
        'COMPLEMENT': {
            long_name: 'complement',
            short_name: 'STC'
        }
    },
    categoriesArray: function() {
        var x = [];
        for (var i in this.categories)
            x.push(this.categories[i]);
        return x;
    },
    etats: {
        ENC: {
            order: 0,
            short_name: 'ENC',
            long_name: 'En Cours',
            old_name: 'EN COURS',
            color: 'orange'
        },
        VRF: {
            order: 1,
            short_name: 'VRF',
            long_name: 'Vérifié',
            old_name: 'INTERVENU',
            color: 'green'
        },
        APR: {
            order: 2,
            short_name: 'APR',
            long_name: 'A Progr.',
            old_name: 'A PROGRAMMER',
            color: 'blue'
        },
        AVR: {
            order: 3,
            short_name: 'AVR',
            long_name: 'A Vérifier',
            old_name: 'EN COURS',
            color: 'brown darken-3'
        },
        ANN: {
            order: 4,
            short_name: 'ANN',
            long_name: 'Annuler',
            old_name: 'ANNULE',
            color: 'red'
        }
    },
    etatsHash: function() {
        return [this.etats.ENC,
            this.etats.VRF,
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
            short_name: 'ENC',
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
    }, {
        short_name: 'EDISON',
        type: 'Fourniture Edison'
    }],
    modePaiement: [{
        short_name: 'VIR',
        long_name: 'Virement'
    }, {
        short_name: 'CHQ',
        long_name: 'Chèque'
    }],
    modeDeReglements: [{
        short_name: 'CB',
        long_name: 'Carte Bancaire',
        old_name: 'cb'
    }, {
        short_name: 'CH',
        long_name: 'Chèque',
        old_name: 'cheque'
    }, {
        short_name: 'CA',
        long_name: 'Espèces',
        old_name: 'especes'
    }],
    tva: [{
        short_name: 10,
        value: 0.1,
        long_name: "TVA: 10.00%"
    }, {
        short_name: 20,
        value: 0.2,
        long_name: "TVA: 20.00%"
    }, {
        short_name: 0,
        value: 0.0,
        long_name: "TVA: 0.00%"
    }],
    tvaSST: [{
        short_name: 0,
        value: 0,
        long_name: "PAS DE TVA"
    }, {
        short_name: 20,
        value: 0.2,
        long_name: "TVA: 20%"
    }],
    typeClient: [
        "AUT",
        "SOC",
        "PRO",
        "LOC",
        "IMO",
        "CUR"
    ],
    typePayeur: [{
        short_name: 'SOC',
        long_name: 'Société'
    }, {
        short_name: 'PRO',
        long_name: 'Propriétaire'
    }, {
        short_name: 'IMO',
        long_name: 'Agence Immobilière'
    }, {
        short_name: 'CUR',
        long_name: 'Curatelle'
    }, {
        short_name: 'AUT',
        long_name: 'Autre'
    }, {
        short_name: 'GRN',
        long_name: 'Grands Comptes'
    }],
    typePayeurObj: {
        SOC: 'SOCIÉTÉ',
        PRO: 'PROPRIÉTAIRE',
        IMO: 'AGENCE IMMOBILIÈRE',
        CUR: 'CURATELLE',
        AUT: 'AUTRE',
        GRN: 'GRAND COMPTE'
    },
    compteFacturation: [{
        short_name: 'FRN_LSR',
        long_name: 'France Loisir',
        compte: 'FRN_LSR',
        nom: 'France Loisir',
        tel: '010101010101',
        address: {
            n: '1',
            r: 'rue test',
            v: 'PARIS',
            cp: "75012"
        },
        email: "test@test.fr"
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
        oldId: '2',
        long_name: "Le problème est résolu"
    }, {
        type: "client",
        oldId: '1',
        short_name: "PX_TP_CHR",
        long_name: "Le prix est trop cher"
    }, {
        type: "client",
        short_name: "CLI_REP_P",
        long_name: "Le client ne répond pas"
    }, {
        type: "client",
        short_name: "CLI_PAS_PAYE",
        long_name: "Le client n'a pas voulu payer le sous-traitant"
    }, {
        type: "client",
        short_name: "CLI_ANN_RDV",
        long_name: "Le client a annulé juste avant le rendez-vous"
    }, {
        type: "sous-traitant",
        short_name: "SST_P_DSP",
        oldId: '4',
        long_name: "Le sous-traitant n'est pas disponible"
    }, {
        type: "sous-traitant",
        oldId: '3',
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
        type: "sous-traitant",
        short_name: "RETARD_SST",
        long_name: "Retard du sous-traitant"
    }, {
        type: "sous-traitant",
        short_name: "SST_PS_CMPT",
        long_name: "Le sous-traitant n'est pas compétent pour cette intervention"
    }, {
        type: "partenariat",
        short_name: "PS_SST_DISPO",
        long_name: "Il n'y a pas de sous-traitant disponible dans la zone"
    }, {
        type: "partenariat",
        oldId: '5',
        short_name: "PS_SST",
        long_name: "Il n'y a pas de sous-traitant dans la zone"
    }, {
        type: "partenariat",
        short_name: "RVL_LIENS_SST",
        long_name: "Le sous-traitant a dévoilé les liens de sous-traitance au client"
    }, {
        type: "partenariat",
        short_name: "PS_BON",
        long_name: "Le sous-traitant démarché n'est pas bon"
    }, {
        type: 'Autre',
        short_name: 'AUTRE',
        long_name: 'Autre'
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
            color: 'blue',
            long_name: "Demarché"
        },
        CAND: {
            order: 1,
            color: 'yellow black-text',
            short_name: 'CAND',
            long_name: "Candidat"
        }
    },
    artisanOrigineArray: function() {
        return [this.artisanOrigine.DEM, this.artisanOrigine.CAND];
    },
    typeAvoir: [{
        short_name: 'ERR_FACT',
        long_name: 'Erreur de facturation',
    }, {
        short_name: 'REM_COM',
        long_name: 'Remise Commercial'
    }, {
        short_name: 'TROP_PERCU',
        long_name: 'Trop Percu'
    }],
    avoir: function(short_name) {
        var _find = require('lodash/collection/find');
        return _find(this.typeAvoir, function(e) {
            return e.short_name === short_name
        })
    },
    savStatus: [{
        short_name: 'ENC',
        long_name: 'En Cours',
    }, {
        short_name: 'EFF',
        long_name: 'Effectué'
    }],
    artisanSubStatus: {
        NEW: {
            long_name: 'New',
            short_name: 'NEW',
            color: 'light-blue'
        },
        REG: {
            long_name: 'Régulier',
            short_name: 'REG',
            color: 'green'
        },
        HOT: {
            long_name: 'Hot',
            short_name: 'HOT',
            color: 'purple'
        },
        QUA: {
            long_name: "<Quarantaine>",
            short_name: "QUA",
            color: 'red'
        }
    }
}
