var ms = require('milliseconds');
var _each = require('lodash/collection/each');


FiltersFactory = function(model) {
    if (!(this instanceof FiltersFactory)) {
        return new FiltersFactory(model);
    }
    this.model = model

}

var today = function() {
    return new Date((new Date()).setHours(0));
}

var dateInter = function(inter) {
    return (new Date(inter.date.intervention)).getTime()
}

FiltersFactory.prototype.__getFilterBy = function(key, value) {
    var _this = this;
    var rtn;
    _each(_this.list[_this.model], function(e, k) {
        if (e[key] === value) {
            rtn = e
            return false;
        }
    })
    return rtn;
}

FiltersFactory.prototype.getFilterByName = function(name) {
    return this.__getFilterBy('short_name', name);
}


FiltersFactory.prototype.getFilterByUrl = function(url) {
    return this.__getFilterBy('url', url);
}

FiltersFactory.prototype.getAllFilters = function(model) {
    return this.list[model ||  this.model];
}


FiltersFactory.prototype.filter = function(inter) {
    var _this = this;
    this.fltr = {};

    _each(_this.list[_this.model], function(e, k) {
        if (!e.noCache && e.fn && typeof e.fn === 'function' && e.fn.bind(_this)(inter)) {
            _this.fltr[e.short_name] = 1;
        }
    })
    return _this.fltr;
}


FiltersFactory.prototype.list = {
    devis: [{
        short_name: 'd_all',
        long_name: 'Tous les devis',
        url: '',
        match: {},
        noCache: true,
        fn: function() {
            return true;
        }
    }, {
        short_name: 'd_tall',
        long_name: "Devis d'Aujourd'hui",
        url: 'ajd',
        match: function() {
            return {
                'date.ajout': {
                    $gt: today()
                }
            }
        },
        fn: function(devis) {
            return devis.date.ajout > today();
        }
    }, {
        short_name: 'd_tra',
        long_name: "Transferé",
        url: 'transfert',
        match: function() {
            return {
                'status': 'TRA',
            }
        },
        fn: function(devis) {
            return devis.status === 'TRA';
        }
    }, {
        short_name: 'd_ann',
        long_name: "Annulés",
        url: 'annules',
        match: function() {
            return {
                status: "ANN"
            }
        },
        fn: function(devis) {
            return devis.status === "ANN";
        }
    }, {
        short_name: 'd_aev',
        long_name: "à envoyer",
        url: 'aEnvoyer',
        match: function() {
            return {
                status: "AEV"
            }
        },
        fn: function(devis) {
            return devis.status === "AEV";
        }
    }, {
        short_name: 'd_att',
        long_name: "en attente",
        url: 'enAttente',
        match: function() {
            return {
                status: "ATT"
            }
        },
        fn: function(devis) {
            return devis.status === "ATT";
        }
    }],
    intervention: [{
        short_name: 'all',
        long_name: 'Toutes les Inters',
        url: '',
        match: {},
        noCache: true,
        fn: function(inter) {
            return true;
        }
    }, {
        short_name: 'tall',
        long_name: "Aujourd'hui",
        url: 'ajd',
        match: function() {
            return {
                'date.ajout': {
                    $gt: today()
                }
            }
        },
        fn: function(inter) {
            return inter.date.ajout > today();
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
        fn: function(inter) {
            return (inter.status === "ENV" ||  inter.status === "AVR") && inter.date.ajout > today();
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
        fn: function(inter) {
            return inter.status === "AVR" ||
                (inter.status === "ENV" && Date.now() > dateInter(inter));
        }
    }, {
        short_name: 'apr',
        long_name: 'A Programmer',
        url: 'aProgrammer',
        match: {
            'status': 'APR',
        },
        fn: function(inter) {
            return inter.status === "APR";
        }
    }, {
        short_name: 'att',
        long_name: 'Paiement en attente',
        url: 'paiementEnAttente',
        match: {},
        stats: false,
        fn: function(inter) {
            return inter.status === "ATT";

        }
    }, {
        short_name: 'atts',
        long_name: 'Paiement SST en attente',
        url: 'paiementArtisanEnAttente',
        match: {},
        stats: false,
        fn: function(inter) {
            return this.fltr.att &&
                inter.reglementSurPlace === true;

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
        fn: function(inter) {
            return this.fltr.atts &&
                Date.now() > dateInter(inter) + ms.weeks(2);
        }
    }, {
        short_name: 'attc',
        long_name: 'Paiement Client en attente',
        url: 'paiementClientEnAttente',
        match: {},
        stats: false,
        fn: function(inter) {
            return this.fltr.att &&
                inter.reglementSurPlace === false;

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
        fn: function(inter) {
            return this.fltr.attc &&
                Date.now() > dateInter(inter) + ms.weeks(3);
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
        fn: function(inter) {
            return this.fltr.avr &&
                inter.reglementSurPlace === false;
            !inter.date.envoiFacture;
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
        fn: function(inter) {
            return inter.sav && inter.sav.length > 0;
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
        fn: function(inter) {
            return inter.sav && inter.sav.length > 0 &&
                inter.sav[inter.sav.length - 1].status === "ENV"
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
        fn: function(inter) {
            return inter.sav && inter.sav.length > 0;
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
        fn: function(inter) {
            return inter.litiges && inter.litiges.length > 0 &&
                inter.litiges[inter.litiges.length - 1].regle === false
        }
    }]
}

module.exports = FiltersFactory;
