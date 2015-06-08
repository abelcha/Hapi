(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
FiltersFactory = function(inter) {
    if (!(this instanceof FiltersFactory)) {
        return new FiltersFactory(inter);
    }
    if (inter && typeof inter === 'object') {
        this.inter = inter;
        this.fltr = {};
        this.ms = require('milliseconds');
        this.today = new Date;
        this.today = this.today.setHours(0);
        this.dateInter = (new Date(inter.date.intervention)).getTime();
        this.now = Date.now();
        this.fltr = {};
    }

}


FiltersFactory.prototype.get = function(fltr) {
    var _this = this;
    for (var i = 0; i < _this.data.length; ++i) {
        if (_this.data[i][Object.keys(fltr)] === fltr[Object.keys(fltr)])
            return _this.data[i];
    }
    return null;
}

FiltersFactory.prototype.create = function() {
    var _this = this;
    for (var i = 0; i < _this.data.length; ++i) {
        if (_this.data[i].cache === true && _this.data[i].fn.bind(_this)() === true) {
            _this.fltr[_this.data[i].short_name] = 1;
        }
    }
    if (this.inter.date.ajout > _this.today) {
        _this.fltr.d = {
            t: 1
        }
    }
    return _this.fltr;
}

FiltersFactory.prototype.data = [{
    short_name: 'all',
    long_name: 'Toutes les Inters',
    url: '',
    cache: false,
    match: {},
    fn: function() {
        return true;
    }
}, {
    short_name: 'env',
    long_name: 'Envoyé',
    url: 'envoye',
    match: {},
    cache: true,
    fn: function() {
        return this.inter.status === "ENV";
    }
}, {
    short_name: 'avr',
    long_name: 'A Vérifier',
    url: 'aVerifier',
    match: {},
    cache: true,
    fn: function() {
        return this.inter.status === "AVR" ||
            (this.inter.status === "ENV" && this.now > this.dateInter);
    }
}, {
    short_name: 'apr',
    long_name: 'A Programmer',
    url: 'aProgrammer',
    match: {},
    cache: true,
    fn: function() {
        return this.inter.status === "APR";
    }
}, {
    short_name: 'att',
    long_name: 'Paiement en attente',
    url: 'paiementEnAttente',
    match: {},
    cache: true,
    fn: function() {
        return this.inter.status === "ATT";

    }
}, {
    short_name: 'atts',
    long_name: 'Paiement SST en attente',
    url: 'paiementArtisanEnAttente',
    match: {},
    cache: true,
    fn: function() {
        return this.fltr.att &&
            this.inter.reglementSurPlace === true;

    }
}, {
    short_name: 'sarl',
    long_name: 'SST à Relancer',
    url: 'relanceArtisan',
    match: {},
    cache: true,
    fn: function() {
        return this.fltr.atts &&
            this.now > this.dateInter + this.ms.weeks(2);
    }
}, {
    short_name: 'attc',
    long_name: 'Paiement Client en attente',
    url: 'paiementClientEnAttente',
    match: {},
    cache: true,
    fn: function() {
        return this.fltr.att &&
            this.inter.reglementSurPlace === false;

    }
}, {
    short_name: 'carl',
    long_name: 'Client à Relancer',
    url: 'relanceClient',
    match: {},
    cache: true,
    fn: function() {
        return this.fltr.attc &&
            this.now > this.dateInter + this.ms.weeks(3);
    }
}, {
    short_name: 'fact',
    long_name: 'Facture à envoyer',
    url: 'factureaEnvoyer',
    match: {},
    cache: true,
    fn: function() {
        return this.fltr.avr &&
            this.inter.reglementSurPlace === false;
            !this.inter.date.envoiFacture;
    }
}, {
    short_name: 'sav',
    long_name: 'Tous les S.A.V',
    url: 'serviceApresVente',
    match: {},
    cache: true,
    fn: function() {
        return this.inter.sav && this.inter.sav.length > 0;
    }
}, {
    short_name: 'savEnc',
    long_name: 'S.A.V En Cours',
    url: 'serviceApresVenteEnCours',
    match: {},
    cache: true,
    fn: function() {
        return this.inter.sav && this.inter.sav.length > 0 &&
        this.inter.sav[this.inter.sav.length - 1].status === "ENV"
    }
}, {
    short_name: 'lit',
    long_name: 'Tous les Litige',
    url: 'litiges',
    match: {},
    cache: true,
    fn: function() {
        return this.inter.sav && this.inter.sav.length > 0;
    }
}, {
    short_name: 'litEnc',
    long_name: 'Litiges non résolus',
    url: 'litigesEnCours',
    match: {},
    cache: true,
    fn: function() {
        return this.inter.litiges && this.inter.litiges.length > 0 &&
        this.inter.litiges[this.inter.litiges.length - 1].regle === false
    }
}]

module.exports = FiltersFactory;

},{"milliseconds":4}],2:[function(require,module,exports){
angular.module('browserify', [])
    .factory('config', [function() {
        "use strict";
        var config =  require("./dataList.js")
        config.filters = require('./FiltersFactory');
        return config;
            /*    config.civilites = [{
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
                }
                config.categoriesAKV = [{
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
                }]
                config.fournisseur = [{
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
                }]


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
                    short_name: 10,
                    long_name: "TVA: 10%"
                }, {
                    short_name: 20,
                    long_name: "TVA: 20%"
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
                return config;*/

    }]);

},{"./FiltersFactory":1,"./dataList.js":3}],3:[function(require,module,exports){
module.exports = {
    categories: {
        PL: {
            short_name: 'PL',
            long_name: 'Plomberie',
            order: 0,
            color: 'blue white-text'
        },
        CH: {
            short_name: 'CH',
            long_name: 'Chauffage',
            order: 1,
            color: 'red white-text'
        },
        EL: {
            short_name: 'EL',
            long_name: 'Electricité',
            order: 2,
            color: 'yellow  accent-4 black-text'
        },
        SR: {
            short_name: 'SR',
            long_name: 'Serrurerie',
            order: 3,
            color: 'brown white-text'
        },
        VT: {
            short_name: 'VT',
            long_name: 'Vitrerie',
            order: 4,
            color: 'green white-text'
        },
        AS: {
            short_name: 'AS',
            long_name: 'Assainissement',
            order: 5,
            color: 'orange white-text'
        },
        CL: {
            short_name: 'CL',
            long_name: 'Climatisation',
            order: 6,
            color: 'teal white-text'
        },
        PT: {
            short_name: 'PT',
            long_name: 'Peinture',
            order: 7,
            color: 'deep-orange white-text'
        }
    },
    categorieArray: function() {
        var x = [];
        for (var i in this.categories)
            x.push(this.categories[i]);
        return x;
    },
    etats: {
        ENV: {
            short_name: 'ENV',
            long_name: 'Envoyé',
            color: 'orange'
        },
        RGL: {
            short_name: 'RGL',
            long_name: 'Reglé',
            color: 'green'
        },
        PAY: {
            short_name: 'PAY',
            long_name: 'Payé',
            color: 'green accent-4'
        },
        ATT: {
            short_name: 'ATT',
            long_name: 'En Attente',
            color: 'purple'
        },
        ATTC: {
            short_name: 'ATTC',
            long_name: 'RC En Attente',
            color: 'purple'
        },
        ATTS: {
            short_name: 'ATTS',
            long_name: 'RS En Attente',
            color: 'pink darken-4'
        },
        APR: {
            short_name: 'APR',
            long_name: 'A Progr.',
            color: 'blue'
        },
        AVR: {
            short_name: 'AVR',
            long_name: 'A Vérifier',
            color: 'brown darken-3'
        },
        ANN: {
            short_name: 'ANN',
            long_name: 'Annuler',
            color: 'red'
        },
        DEV: {
            short_name: 'DEV',
            long_name: 'Devis',
            color: 'light-blue'
        },
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
        short_name:"CLI_REP_P",
        long_name: "Le client ne répond pas"
    }, {
        type: "sous-traitant",
        short_name:"SST_P_DSP",
        long_name: "Le sous-traitant n'est pas disponible"
    }, {
        type: "sous-traitant",
        short_name:"SST_REP_PS",
        long_name: "Le sous-traitant ne répond pas"
    }, {
        type: "sous-traitant",
        short_name:"SST_SHT_PS",
        long_name: "Le ne souhaite pas faire l'intervention"
    }, {
        type: "sous-traitant",
        short_name:"SST_PS_APL",
        long_name: "Le sous-traitant n'a jamais appelé le client"
    }]
}

},{}],4:[function(require,module,exports){
function calc(m) {
    return function(n) { return Math.round(n * m); };
};
module.exports = {
    seconds: calc(1e3),
    minutes: calc(6e4),
    hours: calc(36e5),
    days: calc(864e5),
    weeks: calc(6048e5),
    months: calc(26298e5),
    years: calc(315576e5)
};

},{}]},{},[1,2,3])

