module.exports = {
    ttl: (60 * 60 * 12),
    alvinKEY: "AZKgNeVldZetmZh0Te5iF7Rb9Ry38N2Vph7ehGAs9wJUut4OggwVGHCx4Nt4G7BW",
    alvinURL: "http://electricien13003.com/alvin/",
    mobytID: "F09086",
    mobytPASS: "2n3jwunu",
    locatDB: 'mongodb://localhost/EDISON',
    dropboxKEY: "vPCwuQ_iHHkAAAAAAAAEYXCJS5OETTlvzmXbhc1kjFOsMKO2futzgS-VM8p8S1un",
    categoriesKV: {
        EL: {
            n: 'Electricité',
            c: 'yellow  darken-2 black-text'
        },
        PL: {
            n: 'Plomberie',
            c: 'blue'
        },
        CH: {
            n: 'Chauffage',
            c: 'red'
        },
        CL: {
            n: 'Climatisation',
            c: ' teal darken-3'
        },
        SR: {
            n: 'Serrurerie',
            c: 'brown'
        },
        VT: {
            n: 'Vitrerie',
            c: ' green darken-3'
        },
        CR: {
            n: 'Carrelage',
            c: ''
        },
        MN: {
            n: 'Menuiserie',
            c: ''
        },
        MC: {
            n: 'Maconnerie',
            c: ''
        },
        PT: {
            n: 'Peinture',
            c: ''
        }
    },
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
        ATTC: {
            n: 'RC En Attente',
            c: 'purple'
        },
        ATTS: {
            n: 'RS En Attente',
            c: 'pink darken-4'
        },
        APR: {
            n: 'A Programmer',
            c: 'blue'
        },
        AVR: {
            n: 'A Vérifier',
            c: 'brown darken-3'
        },
        ANN: {
            n: 'Annulé',
            c: 'red'
        },
        DEV: {
            n: 'Devis',
            c: 'light-blue'
        },
    },
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
