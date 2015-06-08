module.exports = {
    etatsKV: {
        ENV: {
            n: 'Envoyé',
            c: 'orange'
        },
        RGL: {
            n: 'Reglé',
            c: 'green'
        },
        PAY: {
            n: 'Payé',
            c: 'green accent-4'
        },
        ATT: {
            n: 'Reglement En Attente',
            c: 'purple'
        },
        ATTC: {
            n: 'RC En Attente',
            c: 'purple'
        },
        ATTS: {
            n: 'RS En Attente',
            c: 'pink darken-4'
        },
        APR: {
            n: 'A Progr.',
            c: 'blue'
        },
        AVR: {
            n: 'A Vérifier',
            c: 'brown darken-3'
        },
        ANN: {
            n: 'Annuler',
            c: 'red'
        },
        DEV: {
            n: 'Devis',
            c: 'light-blue'
        },
    },
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
    civilitesTab: ['M.', 'Mme.', 'Soc.'],
    categoriesKV: {
        EL: {
            s: 'EL',
            o: 2,
            n: 'Electricité',
            c: 'yellow  accent-4 black-text'
        },
        PL: {
            s: 'PL',
            o: 0,
            n: 'Plomberie',
            c: 'blue white-text'
        },
        CH: {
            s: 'CH',
            o: 1,
            n: 'Chauffage',
            c: 'red white-text'
        },
        CL: {
            s: 'CL',
            o: 6,
            n: 'Climatisation',
            c: 'teal white-text'
        },
        SR: {
            s: 'SR',
            o: 3,
            n: 'Serrurerie',
            c: 'brown white-text'
        },
        VT: {
            s: 'VT',
            o: 4,
            n: 'Vitrerie',
            c: 'green white-text'
        },
        AS: {
            s: 'AS',
            o: 5,
            n: 'Assainissement',
            c: 'orange white-text'
        },
        PT: {
            s: 'PT',
            o: 7,
            n: 'Peinture',
            c: 'deep-orange white-text'
        }
    },
    categoriesAKV: [{
        s: 'PL',
        o: 0,
        n: 'Plomberie',
        c: 'blue white-text'
    }, {
        s: 'CH',
        o: 1,
        n: 'Chauffage',
        c: 'red white-text'
    }, {
        s: 'EL',
        o: 2,
        n: 'Electricité',
        c: 'yellow  accent-4 black-text'
    }, {
        s: 'SR',
        o: 3,
        n: 'Serrurerie',
        c: 'brown white-text'
    }, {
        s: 'VT',
        o: 4,
        n: 'Vitrerie',
        c: 'green white-text'
    }, {
        s: 'AS',
        o: 5,
        n: 'Assainissement',
        c: 'orange white-text'
    }, {
        s: 'CL',
        o: 6,
        n: 'Climatisation',
        c: 'teal white-text'
    }, {
        s: 'PT',
        o: 7,
        n: 'Peinture',
        c: 'deep-orange white-text'
    }],
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
        long_name: 10,
    }, {
        long_name: 20
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

    users: [{
        login: 'abel_c',
        oldLogin: 'abel',
        portable: '0633138868',
        email: "abel@chalier.me",
        service: 'INFORMATIQUE',
        root: true,
        nom: 'abel',
        prenom: 'chalier',
        activated: true
    }, {
        login: 'benjamin_b',
        oldLogin: 'boukris_b',
        portable: '0782903875',
        email: 'contact@edison-services.fr',
        service: 'INTERVENTION',
        root: true,
        nom: 'boukris',
        prenom: 'benjamin',
        activated: true

    }, {
        login: 'harald_x',
        oldLogin: 'harald',
        service: 'INTERVENTION',
        root: false,
        nom: 'xxx',
        prenom: 'harald',
        activated: false
    }, {
        login: 'jeremie_r',
        oldLogin: 'jeremie',
        service: 'INTERVENTION',
        root: false,
        nom: 'roudier',
        prenom: 'jeremie',
        activated: false
    }, {
        login: 'tayeb_g',
        oldLogin: 'tayeb',
        service: 'INTERVENTION',
        root: false,
        nom: 'guillot',
        prenom: 'taieb',
        activated: false
    }, {
        login: 'eliran_t',
        oldLogin: 'eliran',
        service: 'INTERVENTION',
        root: true,
        nom: 'taieb',
        prenom: 'eliran',
        activated: true
    }, {
        login: 'thomas_x',
        oldLogin: 'thomas',
        service: 'INTERVENTION',
        root: true,
        nom: 'xxx',
        prenom: 'thomas',
        activated: false
    }, {
        login: 'vincent_q',
        oldLogin: 'vincent',
        service: 'COMPTABILITE',
        root: true,
        nom: 'queudray',
        prenom: 'vincent',
        activated: false
    }, {
        login: 'yohann_r',
        oldLogin: 'yohann',
        service: 'PARTENARIAT',
        root: true,
        nom: 'rhoum',
        prenom: 'yohann',
        activated: true
    }]
}
