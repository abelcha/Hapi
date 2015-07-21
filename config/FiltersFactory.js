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
    artisan: [{
        short_name: 'a_all',
        long_name: 'Tous les Artisans',
        url: '',
        match: {},
        noCache: true,
        fn: function() {
            return true;
        }
    }, {
        short_name: 'a_arc',
        long_name: 'archivés',
        url: 'archives',
        match: {
            status: 'ARC'
        },
        fn: function(artisan) {
            return artisan.status === "ARC";
        }
    }, {
        short_name: 'a_pot',
        long_name: 'potentiel',
        url: 'potentiel',
        match: {
            status: 'POT'
        },
        fn: function(artisan) {
            return artisan.status === "POT";
        }
    }, {
        short_name: 'a_dos',
        long_name: 'DossierIncomplet',
        url: 'dossierIncomplet',
        match: {
            $or: [{
                'document.cni.file': {
                    $exists: false
                }
            }, {
                'document.contrat.file': {
                    $exists: true
                }
            }, {
                'document.kbis.file': {
                    $exists: true
                }
            }]
        },
        fn: function() {
            return true;
        }
    }, {
        short_name: 'a_act',
        long_name: 'actifs',
        url: 'actif',
        match: {
            status: 'ACT'
        },
        fn: function(artisan) {
            return artisan.status === "ACT";
        }
    }],
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
        match: {
            status: "ANN"
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
        short_name: 'i_all',
        long_name: 'Toutes les Inters',
        url: '',
        match: {},
        noCache: true,
        fn: function(inter) {
            return true;
        }
    }, {
        short_name: 'i_tall',
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
        short_name: 'i_tenv',
        long_name: 'Envoyé',
        url: 'envoyeAjd',
        match: function() {
            return {
                'status': 'ENC',
                'date.ajout': {
                    $gt: today()
                }
            }
        },
        fn: function(inter) {
            return (inter.status === "ENC" ||  inter.status === "AVR") && inter.date.ajout > today();
        }
    }, {
        short_name: 'i_avr',
        long_name: 'A Vérifier',
        url: 'aVerifier',
        match: function() {
            return {
                status: 'ENC',
                'date.intervention': {
                    $lt: new Date(Date.now() + ms.hours(1))
                }
            }
        },
        fn: function(inter) {
            return inter.status === "AVR" ||
                (inter.status === "ENC" && Date.now() > dateInter(inter));
        }
    }, {
        short_name: 'i_apr',
        long_name: 'A Programmer',
        url: 'aProgrammer',
        match: {
            'status': 'APR',
        },
        fn: function(inter) {
            return inter.status === "APR";
        }
    }, {
        short_name: 'i_pay',
        long_name: 'Payés',
        url: 'paye',
        stats: false,
        fn: function(inter) {
            return inter.compta.paiement.effectue
        }
    }, {
        short_name: 'i_rgl',
        long_name: 'Réglé',
        url: 'regle',
        stats: false,
        fn: function(inter) {
            return inter.compta.reglement.recu
        }
    },{
        short_name: 'i_vrf',
        long_name: 'Verifié',
        url: 'verifie',
        match: function() {
            return {
                status: 'VRF',
            }
        },
        stats: true,
        fn: function(inter) {
            return inter.status === 'VRF'
        }
    }, {
        short_name: 'i_sarl',
        long_name: 'Relance sous-traitant',
        url: 'relanceArtisan',
        match: function() {
            return {
                status: 'VRF',
                reglementSurPlace: true,
                'compta.reglement.recu': false,
                'date.intervention': {
                    $lt: new Date(Date.now() - ms.weeks(2)),
                }
            }
        },
        stats: true,
        fn: function(inter) {
            return inter.status === 'VRF' && inter.reglementSurPlace &&
                !inter.compta.reglement.recu && Date.now() > dateInter(inter) + ms.weeks(2);
        }
    }, {
        short_name: 'i_carl',
        long_name: 'Client à Relancer',
        url: 'relanceClient',
        match: function() {
            return {
                status: 'VRF',
                'compta.reglement.recu': false,
                reglementSurPlace: false,
                'date.intervention': {
                    $lt: new Date(Date.now() - ms.weeks(2)),
                }
            }
        },
        fn: function(inter) {
            return inter.status === 'VRF' && !inter.reglementSurPlace &&
                !inter.compta.reglement.recu && Date.now() > dateInter(inter) + ms.weeks(2);
        }
    }, {
        short_name: 'i_fact',
        long_name: 'Facture à envoyer',
        url: 'factureaEnvoyer',
        match: function() {
            return {
                'date.intervention': {
                    $lt: new Date(Date.now() + ms.hours(1))
                },
                status: 'ENC',
                reglementSurPlace: false
            }
        },
        fn: function(inter) {
            return this.fltr.i_avr &&
                inter.reglementSurPlace === false
        }
    }, {
        short_name: 'i_sav',
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
        short_name: 'i_savEnc',
        long_name: 'S.A.V En Cours',
        url: 'serviceApresVenteEnCours',
        match: {
            sav: {
                $elemMatch:  {
                    status: 'ENC'
                }
            }
        },
        fn: function(inter) {
            return inter.sav && inter.sav.length > 0 &&
                inter.sav[inter.sav.length - 1].status === "ENC"
        }
    }, {
        short_name: 'i_lit',
        long_name: 'Tous les Litige',
        url: 'litiges',
        match: {
            litiges: {
                $gt: {
                    $size: 0
                }
            }
        },
        fn: function(inter) {
            return inter.litiges && inter.litiges.length > 0;
        }
    }, {
        short_name: 'i_litEnc',
        long_name: 'Litiges non résolus',
        url: 'litigesEnCours',
        match: {
            litiges: {
                $elemMatch:  {
                    regle: false
                }
            }
        },
        fn: function(inter) {
            return inter.litiges && inter.litiges.length > 0 &&
                inter.litiges[inter.litiges.length - 1].regle === false
        }
    }, {
        short_name: 'i_mar',
        long_name: 'MARKET',
        url: 'market',
        match: {
            aDemarcher: true,
            status: 'APR',
            'login.demarchage': {
                $exists: false
            }
        },
        fn: function(inter) {
            return inter.aDemarcher && inter.status === 'APR' && !inter.login.demarchage;
        }
    }, {
        short_name: 'i_pan',
        long_name: 'PANIER',
        url: 'panier',
        group: '$login.demarchage',
        match: {
            aDemarcher: true,
            status: {
                $in: ['APR', 'ENC', 'AVR']
            },
            'login.demarchage': {
                $exists: true
            }
        },
        fn: function(inter) {
            return inter.aDemarcher && ['APR', 'ENC', 'AVR'].indexOf(inter.status) !== -1 && inter.login.demarchage;
        }
    }, {
        short_name: 'i_hist',
        long_name: 'HISTORIQUE',
        url: 'historique',
        group: '$login.demarchage',
        match: {
            aDemarcher: true,
            'login.demarchage': {
                $exists: true
            }
        },
        fn: function(inter) {
            return inter.aDemarcher && inter.login.demarchage;
        }
    }]
}

module.exports = FiltersFactory;
