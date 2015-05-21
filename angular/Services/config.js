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

    config.status = function(inter) {
        return {
            intervention: config.etatsKV[inter.status]
        }
    }
    return config;

}]);
