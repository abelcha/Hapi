angular.module('edison').factory('config', [function() {

    var config = {};

    config.filters = {
        all:  {
            short: 'all',
            long: 'Toutes les Inters',
            url: ''
        },
        envoye: {
            short: 'env',
            long: 'Envoyé',
            url: '/envoye'
        },
        aVerifier: {
            short: 'avr',
            long: 'A Vérifier',
            url: '/aVerifier'
        },
        clientaRelancer: {
            short: 'carl',
            long: 'Client A Relancer',
            url: '/clientaRelancer'
        },
        clientaRelancerUrgent: {
            short: 'Ucarl',
            long: 'Client A Relancer Urgent',
            url: '/clientaRelancerUrgent'
        },
        sstaRelancer: {
            short: 'sarl',
            long: 'SST A Relancer',
            url: '/sstaRelancer'
        },
        sstaRelancerUrgent: {
            short: 'Usarl',
            long: 'SST A Relancer Urgent',
            url: '/sstaRelancerUrgent'
        },
    }

    config.civilites = [{
        short_name: 'M.',
        long_name: 'Monsieur'
    }, {
        short_name: 'Mme.',
        long_name: 'Madame'
    }, {
        short_name: 'Soc.',
        long_name: 'Société'
    }];

    config.civilitesTab = ['M.', 'Mme.', 'Soc.'];

    config.categoriesKV = {
        EL: {
            o: 2,
            n: 'Electricité',
            c: 'yellow  accent-4 black-text'
        },
        PL: {
            o: 0,
            n: 'Plomberie',
            c: 'blue white-text'
        },
        CH: {
            o: 1,
            n: 'Chauffage',
            c: 'red white-text'
        },
        CL: {
            o: 6,
            n: 'Climatisation',
            c: 'teal white-text'
        },
        SR: {
            o: 3,
            n: 'Serrurerie',
            c: 'brown white-text'
        },
        VT: {
            o: 4,
            n: 'Vitrerie',
            c: 'green white-text'
        },
        AS: {
            o: 5,
            n: 'Assainissement',
            c: 'orange white-text'
        },
        PT: {
            o: 7,
            n: 'Peinture',
            c: 'deep-orange white-text'
        }
    }

    config.fournisseur = [{
        short_name: 'EDISON SERVICES',
        type: 'Fourniture Edison'
    }, {
        short_name: 'CEDEO',
        type: 'Fourniture Artisan'
    }, {
        short_name: 'BROSSETTE',
        type: 'Fourniture Artisan'
    }, {
        short_name: 'REXEL',
        type: 'Fourniture Artisan'
    }, {
        short_name: 'COAXEL',
        type: 'Fourniture Artisan'
    }, {
        short_name: 'YESSS ELECTRIQUE',
        type: 'Fourniture Artisan'
    }, {
        short_name: 'CGED',
        type: 'Fourniture Artisan'
    }, {
        short_name: 'COSTA',
        type: 'Fourniture Artisan'
    }, {
        short_name: 'FORUM DU BATIMENT',
        type: 'Fourniture Artisan'
    }]

    config.categories = [{
        short_name: 'EL',
        long_name: 'Electricité'
    }, {
        short_name: 'PL',
        long_name: 'Plomberie'
    }, {
        short_name: 'CH',
        long_name: 'Chauffage'
    }, {
        short_name: 'CL',
        long_name: 'Climatisation'
    }, {
        short_name: 'SR',
        long_name: 'Serrurerie'
    }, {
        short_name: 'VT',
        long_name: 'Vitrerie'
    }, {
        short_name: 'CR',
        long_name: 'Carrelage'
    }, {
        short_name: 'MN',
        long_name: 'Menuiserie'
    }, {
        short_name: 'MC',
        long_name: 'Maconnerie'
    }, {
        short_name: 'PT',
        long_name: 'Peinture'
    }];

    config.modeDeReglements = [{
        short_name: 'CB',
        long_name: 'Carte Bancaire'
    }, {
        short_name: 'CH',
        long_name: 'Chèque'
    }, {
        short_name: 'CA',
        long_name: 'Espèces'
    }];

    config.tva = [{
        long_name: 10,
    }, {
        long_name: 20
    }];
    config.typePayeur = [{
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
    }];

    config.etatsKV = {
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
    }

    config.status = function(inter) {
        return {
            intervention: config.etatsKV[inter.status]
        }
    }
    return config;

}]);
