(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var ms = require('milliseconds');

FiltersFactory = function(inter) {
    if (!(this instanceof FiltersFactory)) {
        return new FiltersFactory(inter);
    }
    if (inter && typeof inter === 'object') {
        this.inter = inter;
        this.fltr = {};
        this.dateInter = (new Date(inter.date.intervention)).getTime();
    }

}

var today = function() {
    return new Date((new Date()).setHours(0));
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
    return _this.fltr;
}

FiltersFactory.prototype.list = function() {
    return this.data;
}

FiltersFactory.prototype.data = [{
    short_name: '',
    long_name: 'Toutes les Inters',
    url: '',
    cache: false,
    match: {},
    fn: function() {
        return true;
    }
}, {
    short_name: 'tall',
    long_name: "uAjourd'hui",
    url: 'ajd',
    match: function() {
        return {
            'date.ajout': {
                $gt: today()
            }
        }
    },
    cache: true,
    fn: function() {
        return this.inter.date.ajout > today();
    }
}, {
    short_name: 'tenv',
    long_name: 'Envoyé',
    url: 'envoyeAjd',
    match: function() {
        return {
            'status': 'ENV',
            'date.ajout': {
                $gt: today()
            }
        }
    },
    cache: true,
    fn: function() {
        return (this.inter.status === "ENV" || this.inter.status === "AVR") && this.inter.date.ajout > today();
    }
}, {
    short_name: 'avr',
    long_name: 'A Vérifier',
    url: 'aVerifier',
    match: function() {
        return {
            status: 'ENV',
            'date.intervention': {
                $lt: new Date(Date.now() + ms.hours(1))
            }
        }
    },
    cache: true,
    fn: function() {
        return this.inter.status === "AVR" ||
            (this.inter.status === "ENV" && Date.now() > this.dateInter);
    }
}, {
    short_name: 'apr',
    long_name: 'A Programmer',
    url: 'aProgrammer',
    match: {
        'status': 'APR',
    },
    cache: true,
    fn: function() {
        return this.inter.status === "APR";
    }
}, {
    short_name: 'att',
    long_name: 'Paiement en attente',
    url: 'paiementEnAttente',
    match: {},
    stats: false,
    cache: true,
    fn: function() {
        return this.inter.status === "ATT";

    }
}, {
    short_name: 'atts',
    long_name: 'Paiement SST en attente',
    url: 'paiementArtisanEnAttente',
    match: {},
    stats: false,
    cache: true,
    fn: function() {
        return this.fltr.att &&
            this.inter.reglementSurPlace === true;

    }
}, {
    short_name: 'sarl',
    long_name: 'SST à Relancer',
    url: 'relanceArtisan',
    match: {
        status: 'ATT',
        reglementSurPlace: true,
        'date.intervention': {
            $lt: new Date(Date.now() - ms.weeks(2)),
        }
    },
    stats: true,
    cache: true,
    fn: function() {
        return this.fltr.atts &&
            Date.now() > this.dateInter + ms.weeks(2);
    }
}, {
    short_name: 'attc',
    long_name: 'Paiement Client en attente',
    url: 'paiementClientEnAttente',
    match: {},
    stats: false,
    cache: true,
    fn: function() {
        return this.fltr.att &&
            this.inter.reglementSurPlace === false;

    }
}, {
    short_name: 'carl',
    long_name: 'Client à Relancer',
    url: 'relanceClient',
    match: {
        status: 'ATT',
        reglementSurPlace: false,
        'date.intervention': {
            $lt: new Date(Date.now() - ms.weeks(2)),
        }
    },
    cache: true,
    fn: function() {
        return this.fltr.attc &&
            Date.now() > this.dateInter + ms.weeks(3);
    }
}, {
    short_name: 'fact',
    long_name: 'Facture à envoyer',
    url: 'factureaEnvoyer',
    match: {
        'date.intervention': {
            $lt: new Date(Date.now() + ms.hours(1))
        },
        status: 'ENV',
        reglementSurPlace: false
    },
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
    match: {
        sav: {
            $gt: {
                $size: 0
            }
        }
    },
    cache: true,
    fn: function() {
        return this.inter.sav && this.inter.sav.length > 0;
    }
}, {
    short_name: 'savEnc',
    long_name: 'S.A.V En Cours',
    url: 'serviceApresVenteEnCours',
    match: {
        sav: {
            $elemMatch:  {
                status: 'ENV'
            }
        }
    },
    cache: true,
    fn: function() {
        return this.inter.sav && this.inter.sav.length > 0 &&
            this.inter.sav[this.inter.sav.length - 1].status === "ENV"
    }
}, {
    short_name: 'lit',
    long_name: 'Tous les Litige',
    url: 'litiges',
    match: {
        litiges: {
            $elemMatch:  {
                regle: false
            }
        }
    },
    cache: true,
    fn: function() {
        return this.inter.sav && this.inter.sav.length > 0;
    }
}, {
    short_name: 'litEnc',
    long_name: 'Litiges non résolus',
    url: 'litigesEnCours',
    match: {
        litiges: {
            $gt: {
                $size: 0
            }
        }
    },
    cache: true,
    fn: function() {
        return this.inter.litiges && this.inter.litiges.length > 0 &&
            this.inter.litiges[this.inter.litiges.length - 1].regle === false
    }
}]

module.exports = FiltersFactory;

},{"milliseconds":6}],2:[function(require,module,exports){
angular.module('browserify', [])
    .factory('config', [function() {
        "use strict";
        var config = require("./dataList.js")
        config.filters = require('./FiltersFactory');
        return config;
    }])
    .factory('contextMenuData', [function() {
    	return require('./contextMenuData.js')
    }])
    .factory('textTemplate', [function() {
        return require('./textTemplate.js')
    }])

},{"./FiltersFactory":1,"./contextMenuData.js":3,"./dataList.js":4,"./textTemplate.js":5}],3:[function(require,module,exports){
module.exports = {
    intervention: [{
        hidden: false,
        title: 'Ouvrir Fiche',
        action: function(inter) {
            $location.url('/intervention/' + inter.id)
        }
    }, {
        hidden: false,
        title: "Appeler l'artisan",
        action: 'callArtisan',
        hide: function(inter) {
            return !inter.ai
        }
    }, {
        hidden: false,
        title: "SMS artisan",
        action: 'smsArtisan',
        hide: function(inter) {
            return !inter.ai
        }
    }, {
        hidden: false,
        title: "Envoyer",
        action: 'envoi',
        hide: function(inter) {
            return inter.s !== "APR" && inter.s !== 'ANN'
        }
    }, {
        hidden: false,
        title: "Vérifier",
        action: 'verification',
        hide: function(inter) {
            return inter.s !== "AVR" && inter.s !== 'ENV'
        }
    }, {
        hidden: false,
        title: "Annuler",
        action: 'annulation'

    }]
}

},{}],4:[function(require,module,exports){
module.exports = {
    categories: {
        PL: {
            suffix:'de',
            short_name: 'PL',
            long_name: 'Plomberie',
            order: 0,
            color: 'blue white-text'
        },
        CH: {
            suffix:'de',
            short_name: 'CH',
            long_name: 'Chauffage',
            order: 1,
            color: 'red white-text'
        },
        EL: {
            suffix:"d'",
            short_name: 'EL',
            long_name: 'Électricité',
            order: 2,
            color: 'yellow  accent-4 black-text'
        },
        SR: {
            suffix:'de',
            short_name: 'SR',
            long_name: 'Serrurerie',
            order: 3,
            color: 'brown white-text'
        },
        VT: {
            suffix:'de',
            short_name: 'VT',
            long_name: 'Vitrerie',
            order: 4,
            color: 'green white-text'
        },
        AS: {
            suffix:'de',
            short_name: 'AS',
            long_name: 'Assainissement',
            order: 5,
            color: 'orange white-text'
        },
        CL: {
            suffix:'de',
            short_name: 'CL',
            long_name: 'Climatisation',
            order: 6,
            color: 'teal white-text'
        },
        PT: {
            suffix:'de',
            short_name: 'PT',
            long_name: 'Peinture',
            order: 7,
            color: 'deep-orange white-text'
        }
    },
    categoriesArray: function() {
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
    }]
}

},{}],5:[function(require,module,exports){
module.exports = {
    mail: {
        devis: {
            envoi: function(user) {
                var config = require('./dataList.js')
                var categorieClean = config.categories[this.categorie].suffix + " " + config.categories[this.categorie].long_name.toLowerCase()
                var pseudo = _.startCase(user.pseudo)
                var intro;
                if (this.client.civilite === "Soc.") {
                    intro = _.template("À l'intention du responsable de la société {{_.startCase(client.nom.toLowerCase())}},\n\n")(this);
                } else {
                    intro = _.template("{{client.civilite}} {{client.nom}},\n\n")(this);
                }
                var start = intro + "Suite à notre conversation téléphonique de tout à l'heure, ";
                var end = "Avez-vous reçu le devis ?\n" +
                    "Je n'ai pas eu de retour de votre part, devons nous planifier une intervention ?\n\n" +
                    "Merci de revenir vers moi pour me tenir au courant de la suite que vous donnerez à ce devis.\n\n" +
                    "Je reste à votre disposition pour toutes les demandes de renseignement\n\n" +
                    "Cordialement, \n\n" +
                    pseudo +
                    "\n<strong>Ligne direct : 09.72.42.30.00</strong>\n";

                if (this.historique && this.historique.length === 1) {
                    var cont;
                    if (this.categorie == 'VT')
                        cont = "je vous ai envoyé le devis que vous m'avez demandé pour le remplacement de votre vitrage, vous deviez le transmettre directement à votre compagnie d'assurance.\n\n";
                    else if (this.categorie == 'AS')
                        cont = "je vous ai transmis comme convenue le devis de remplacement de votre ballon d'eau chaude sanitaire.\n\n";
                    else
                        cont = "je vous ai transmis comme convenue le devis " + categorieClean + " que vous avez souhaité.\n\n";
                    var text = start + cont + end;

                } else if (this.historique && this.historique.length > 1) {
                    var text = intro + "je vous ai transmis un devis " + categorieClean + " en date du " + moment(this.historique[0].date).format('L') + ".\n\n" + end;
                } else if (this.categorie == 'VT') {
                    var text = intro +
                        "Suite à notre échange téléphonique concernant le remplacement de votre vitrage.\n\n" +
                        "Veuillez trouver ci-joint la pièce commerciale Devis n°" + this.id + ".\n\n" +
                        "Merci de bien vouloir transmettre ce devis de remplacement de vitrage directement à votre compagnie d’assurance, afin d'obtenir leurs accords (si nécessaire).\n" +
                        "Merci de nous renvoyer le devis signé accompagné de la mention « BON POUR ACCORD » par mail.\n\n" +
                        "Nous interviendrons dans les plus brefs délais.\n\n" +
                        "Je reste à votre entière disposition pour toutes les demandes de renseignement et les remarques que vous pourriez avoir.\n\n" +
                        "Cordialement, \n\n" +
                        pseudo +
                        "\n<strong>Ligne direct : 09.72.42.30.00</strong>\n"
                } else if (_.find(this.produits, function(e) {
                        return _.startsWith(e.ref, "BAL");
                    })) {
                    var text = intro +
                        "Suite à notre échange téléphonique concernant le remplacement de votre ballon d'eau chaude sanitaire.\n\n" +
                        "Veuillez trouver ci-joint la pièce commerciale Devis n°" + this.id + ".\n\n" +
                        "Je reste à votre entière disposition pour tous renseignements complémentaires ou remarques que vous pourriez avoir (technique/prix).\n\n" +
                        "Sachez par ailleurs, que votre installation sera éligible aux règles de notre assurance RC PRO et notre assurance décennale.\n" +
                        "Dès votre accord, nous interviendrons rapidement.\n\n" +
                        "Meilleures salutations,\n\n" +
                        pseudo +
                        "\n<strong>Ligne direct : 09.72.42.30.00</strong>\n\n";
                } else {
                    var text = intro +
                        "Suite à notre dernier échange concernant la réalisation d'un devis " + categorieClean + ", \n" +
                        "vous trouverez ci-joint le devis n°" + this.id + " correspondant à ce que nous avons vu ensemble. \n\n" +
                        "Je reste à votre entière disposition pour tous renseignements complémentaires ou remarques que vous pourriez avoir (technique/prix). \n\n" +
                        "Merci de me tenir au courant de la suite que vous donnerez à ce devis. \n\n" +
                        "Cordialement, \n\n" +
                        pseudo + "\n<strong>Ligne direct : 09.72.42.30.00</strong>\n\n";
                }
                return text;
            }
        }
    }

};

},{"./dataList.js":4}],6:[function(require,module,exports){
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

},{}]},{},[1,2,3,4,5])

