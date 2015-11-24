var ms = require('milliseconds');
var _each = require('lodash/collection/each');
FiltersFactory = function(model) {
    if (!(this instanceof FiltersFactory)) {
        return new FiltersFactory(model);
    }
    this.model = model

}

var today = function() {
    var today = new Date()
    today.setHours(0)
    return today;
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
        if (!e.noCache && e.fn && typeof e.fn === 'function' && e.fn(inter)) {
            _this.fltr[e.short_name] = 1;
        }
    })
    return _this.fltr;
}


FiltersFactory.prototype.list = {
    artisan: [{
        short_name: 'a_fact',
        long_name: 'Demande Facturier',
        url: 'needFacturier',
        match: {
            'demandeFacturier.status': "PENDING"
        }
    }, {
        short_name: 'a_all',
        long_name: 'Tous les Artisans',
        url: '',
        match: {},
        noCache: true,
    }, {
        short_name: 'a_man',
        long_name: 'A Manager',
        url: 'aManager',
        group: '$login.management',
        match: {
            'login.management': {
                $exists: true
            }
        },
    }, {
        short_name: 'a_sur',
        long_name: 'A Surveiller',
        url: 'aSurveiller',
        group: '$login.management',
        match: {
            'aSurveiller': true
        },
    }, {
        short_name: 'a_arc',
        long_name: 'archivés',
        url: 'archives',
        match: {
            status: 'ARC'
        },
    }, {
        short_name: 'a_pot',
        long_name: 'potentiel',
        url: 'potentiel',
        match: {
            status: 'POT'
        },
    }, {
        short_name: 'a_dos',
        long_name: 'DossierIncomplet',
        url: 'dossierIncomplet',
        match: {
            $or: [{
                'document.cni.file': true
            }, {
                'document.contrat.file': true
            }, {
                'document.kbis.file': true
            }]
        },
    }, {
        short_name: 'a_act',
        long_name: 'actifs',
        url: 'actif',
        match: {
            status: 'ACT'
        },
    }],
    devis: [{
        short_name: 'd_all',
        long_name: 'Tous les devis',
        url: '',
        match: {},
        noCache: true,
    }, {
        short_name: 'd_tall',
        long_name: "Devis d'aujourd'hui",
        url: 'ajd',
        match: function() {
            return {
                'date.ajout': {
                    $gt: today()
                }
            }
        },
    }, {
        short_name: 'd_tra',
        long_name: "Transferé",
        url: 'transfert',
        match: function() {
            return {
                'status': 'TRA',
            }
        },
    }, {
        short_name: 'd_ann',
        long_name: "Annulés",
        url: 'annules',
        match: {
            status: "ANN"
        },
    }, {
        short_name: 'd_aev',
        long_name: "A envoyer",
        url: 'aEnvoyer',
        match: function() {
            return {
                status: "AEV"
            }
        },
    }, {
        short_name: 'd_att',
        long_name: "En attente",
        url: 'enAttente',
        match: function() {
            return {
                status: "ATT"
            }
        },
    }],
    intervention: [{
        short_name: 'i_davr',
        long_name: 'Demarchages a verifié',
        url: 'davr',
        match: {
            status: 'ENC',
            /* 'date.intervention': {
                 $lt: new Date(Date.now() + ms.hours(1))
             },*/
            aDemarcher: true
        },
    }, {
        short_name: 'i_all',
        long_name: 'Toutes les inters',
        url: '',
        match: {},
        noCache: true,
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
    }, {
        short_name: 'i_tenv',
        long_name: 'Envoyé',
        group: '$login.ajout',
        url: 'envoyeAjd',
        match: function() {
            return {
                'status': 'ENC',
                'date.ajout': {
                    $gt: today()
                }
            }
        },
    }, {
        short_name: 'i_avr',
        long_name: 'A vérifier',
        url: 'aVerifier',
        match: function() {
            return {
                status: 'ENC',
                'date.intervention': {
                    $lt: new Date(Date.now() + ms.hours(1))
                }
            }
        },
    }, {
        short_name: 'i_apr',
        long_name: 'A programmer',
        url: 'aProgrammer',
        match: {
            'status': 'APR',
        },
    }, {
        short_name: 'i_pay',
        long_name: 'Payés',
        url: 'paye',
        stats: false,
    }, {
        short_name: 'i_rgl',
        long_name: 'Réglé',
        url: 'regle',
        stats: false,
    }, {
        short_name: 'i_vrf',
        long_name: 'Verifié',
        url: 'verifie',
        match: function() {
            return {
                status: 'VRF',
            }
        },
        stats: true,
    }, {
        short_name: 'i_iar',
        long_name: 'Intervenant à régler',
        url: 'iar',
        match: function() {
            return {
                "compta.reglement.recu": true,
                "compta.paiement.effectue": false,
                "compta.paiement.ready": false,
                "compta.paiement.dette": false,
                "status": {
                    $ne: 'ANN'
                }
            }
        },
        stats: true,
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
    }, {
        short_name: 'i_chq',
        long_name: 'Relance Cheques',
        url: 'relanceCheques',
        match: function() {
            return {
                status: 'VRF',
                modeReglement: 'CHQ',
                reglementSurPlace: true,
                'compta.reglement.recu': false,
                'compta.paiement.effectue': false,
                'date.intervention': {
                    $lt: new Date(Date.now() - ms.weeks(2)),
                }
            }
        },
        stats: true,
    }, {
        short_name: 'i_wtf1',
        long_name: 'Payé mais pas reglés',
        url: 'payePasRegle',
        match: function() {
            return {
                status: 'VRF',
                modeReglement: 'CHQ',
                reglementSurPlace: true,
                'compta.reglement.recu': false,
                'date.intervention': {
                    $lt: new Date(Date.now() - ms.weeks(2)),
                }
            }
        },
        stats: true,
    }, {
        short_name: 'i_carl',
        long_name: 'Client à relancer',
        url: 'relanceClient',
        sortBy: {
            l: 'asc'
        },
        match: function() {
            return {
                status: 'VRF',
                'compta.reglement.recu': false,
                reglementSurPlace: false,
            }
        },
    }, {
        short_name: 'i_fall',
        long_name: 'Toutes mes factures',
        url: 'factureHistorique',
        match: function() {
            return {
                status: 'VRF',
                reglementSurPlace: false,
            }
        },
    }, {
        short_name: 'i_fact',
        long_name: 'Facture à envoyer',
        url: 'factureaEnvoyer',
        sortBy: {
            di: 'desc'
        },
        match: function() {
            return {
                status: 'ENC',
                reglementSurPlace: false
            }
        },
    }, {
        short_name: 'i_sav',
        long_name: 'S.A.V En Cours',
        url: 'savEnCours',
        match: {
            'sav.status': 'ENC'
        },
    }, {
        short_name: 'i_lit',
        long_name: 'Tous les litiges',
        url: 'litiges',
        match: {
            'litige': {
                $exists: true
            }
        },
    }, {
        short_name: 'i_litEnc',
        long_name: 'Litiges non résolus',
        url: 'litigesEnCours',
        match: {
            'litige.open': true
        },
    }, {
        short_name: 'i_mar',
        long_name: 'MARKET',
        url: 'market',
        sortBy: {
            di: 'desc'
        },
        match: {
            aDemarcher: true,
            status: 'APR',
            'login.demarchage': {
                $exists: false
            }
        },
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
    }, {
        short_name: 'i_hist',
        long_name: 'Historique',
        url: 'historique',
        group: '$login.demarchage',
        match: {
            aDemarcher: true,

        },
    }, {
        short_name: 'i_nw',
        long_name: 'Nouveaux SST',
        url: 'nw',
        match: {
            'artisan.subStatus': 'NEW',
            status: {
                $in: ['APR', 'ENC']
            }
        },
    }, {
        short_name: 'i_tut',
        long_name: 'Sous Tutelles',
        url: 'tutelle',
        match: {
            'artisan.subStatus': 'TUT',
            status: {
                $in: ['APR', 'ENC']
            }
        },
    }, {
        short_name: 'i_ax',
        long_name: 'Axialis',
        url: 'axialis',
        match: {
            'newOs': true,
        },
    }]
}

module.exports = FiltersFactory;
