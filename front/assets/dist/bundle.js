(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Description = function(inter) {
    this.inter = inter;
    this.desc = inter.description
}

var rmve = function(str, a) {
    return str.split(a).join('');
}

var strip = function(s) {
    s = rmve(s, " DE ")
    s = rmve(s, " D'")
    s = rmve(s, " AU ")
    s = rmve(s, " A ")
    return s;
}

Description.prototype.search = function(str) {
    var _map = require('lodash/collection/map');
    var _sortBy = require('lodash/collection/sortby');
    var resemblance = require('resemblance');
    str = str.toUpperCase()
    var list = _map(this.data, function(e) {
        var res = 1 - resemblance.compareStrings(strip(e), str)
        return {
            match: res,
            name: e
        }
    })
    list = _sortBy(list, 'match').slice(0, 5)

    return list;
}

Description.prototype.data = [

    "ATTESTATION DE RECHERCHE DE FUITE",
    "BRANCHEMENT MACHINE A LAVER",
    "CHANGEMENT BARILLET",
    "CHANGEMENT CYLINDRE",
    "CHANGEMENT BARILLET",
    "CHANGEMENT CYLINDRE",
    "CHANGEMENT GROUPE DE SÉCURITÉ",
    "CHANGEMENT MÉCANISME WC",
    "CHANGEMENT SERRURE",
    "CHANGEMENT GROUPE DE SECURITÉ",
    "CHANGEMENT MECANISME CHASSE D'EAU",
    "CHANGEMENT SERRURE BOITE AU LETTRE",
    "CHANGEMENT SERRURE",
    "DEBOUCHAGE BAIGNOIRE",
    "DEBOUCHAGE CAMION POMPE",
    "DEBOUCHAGE CAMION",
    "DEBOUCHAGE CANALISATION CUISINE",
    "DEBOUCHAGE CANALISATION DOUCHE",
    "DEBOUCHAGE CANALISATION MACHINE A LAVER",
    "DEBOUCHAGE CANALISATION WC",
    "DEBOUCHAGE CANALISATION ÉVIER",
    "DEBOUCHAGE CANALISATION",
    "DEBOUCHAGE DOUCHE",
    "DEBOUCHAGE EVIER CUISINE",
    "DEBOUCHAGE EVIER",
    "DEBOUCHAGE LAVABO",
    "DEBOUCHAGE MACHINE A LAVER",
    "DEBOUCHAGE SANIBROYEUR",
    "DEBOUCHAGE TOILETTE",
    "DEBOUCHAGE WC",
    "DEBOUCHAGE",
    "DEVIS REMPLACEMENT DE VITRAGE",
    "DEVIS TRAVAUX DE ELECTRIQUE",
    "DEVIS TRAVAUX DE PLOMBERIE",
    "DEVIS TRAVAUX DE SERRURERIE",
    "DIAGNOSTIC DE PANNE ELECTRIQUE",
    "ENTRETIEN CHAUDIÈRE GAZ",
    "ENTRETIEN CHAUFFE EAU ELECTRIQUE",
    "FORFAIT BOITE AU LETTRE",
    "INSTALLATION MACHINE A LAVER",
    "OUVERTURE DE COFFRE FORT",
    "OUVERTURE DE COFFRE",
    "OUVERTURE DE PORTE + CHANGEMENT DE BARILLET",
    "OUVERTURE DE PORTE + CHANGEMENT DE CYLINDRE",
    "OUVERTURE DE PORTE + REMPLACEMENT BARILLET",
    "OUVERTURE DE PORTE + REMPLACEMENT",
    "OUVERTURE DE PORTE CLAQUÉ",
    "OUVERTURE DE PORTE DE CAVE",
    "OUVERTURE DE PORTE DE GARAGE",
    "OUVERTURE DE PORTE ET CHANGEMENT CYLINDRE",
    "OUVERTURE DE PORTE FERMÉE + CHANGEMENT DE BAR",
    "OUVERTURE DE PORTE FERMÉE A CLÉ",
    "OUVERTURE DE PORTE FERMÉE",
    "OUVERTURE DE PORTE WC",
    "OUVERTURE DE PORTE",
    "PACK WC",
    "PROBLEME DE SERRURE",
    "PROBLEME FERMETURE PORTE",
    "RECHERCHE DE FUITE + DEVIS DE TRAVAUX",
    "RECHERCHE DE FUITE + REPARATION SI POSSIBLE",
    "RECHERCHE DE FUITE DOUCHE",
    "RECHERCHE DE FUITE ENTRE MAISON ET COMPTEUR",
    "RECHERCHE DE FUITE GENERALE",
    "RECHERCHE DE FUITE NON VISIBLE",
    "RECHERCHE DE FUITE SALLE DE BAIN",
    "RECHERCHE DE FUITE SOUS BAIGNOIRE",
    "RECHERCHE DE FUITE SOUS LA DOUCHE",
    "RECHERCHE DE FUITE",
    "RECHERCHE DE PANNE + MISE EN SERVICE",
    "RECHERCHE DE PANNE + REMISE EN SERVICE",
    "RECHERCHE DE PANNE + REPARATION SI POSSIBLE",
    "RECHERCHE DE PANNE + REPARATION",
    "RECHERCHE DE PANNE BALLON D'EAU CHAUDE",
    "RECHERCHE DE PANNE BALLON ECS",
    "RECHERCHE DE PANNE BALLON",
    "RECHERCHE DE PANNE CHAUDIÈRE GAZ",
    "RECHERCHE DE PANNE CHAUDIÈRE",
    "RECHERCHE DE PANNE CHAUFFAGE",
    "RECHERCHE DE PANNE CHAUFFE EAU ELECTRIQUE",
    "RECHERCHE DE PANNE CHAUFFE EAU GAZ",
    "RECHERCHE DE PANNE CHAUFFE EAU",
    "RECHERCHE DE PANNE CLIMATISATION",
    "RECHERCHE DE PANNE ELECTRIQUE GENERALE",
    "RECHERCHE DE PANNE ELECTRIQUE PARTIEL",
    "RECHERCHE DE PANNE ELELECTRIQUE + MISE EN SERVICE",
    "RECHERCHE DE PANNE POINT LUMINEUX",
    "RECHERCHE DE PANNE RADIATEUR ELECTRIQUE",
    "RECHERCHE DE PANNE SUR CHAUFFE EAU",
    "RECHERCHE DE PANNE",
    "RECHERCHE DE PANNE ELECTRIQUE",
    "REMPLACEMENT BALLON 100L",
    "REMPLACEMENT BALLON 200L VERTICAL",
    "REMPLACEMENT BALLON 200L",
    "REMPLACEMENT BALLON 300L",
    "REMPLACEMENT BALLON",
    "REMPLACEMENT CHAUFFE EAU 200L",
    "REMPLACEMENT CHAUFFE EAU 300L",
    "REMPLACEMENT CYLINDRE BOITE AUX LETTRES",
    "REMPLACEMENT CYLINDRE EUROPÉEN",
    "REMPLACEMENT CYLINDRE",
    "REMPLACEMENT BARILLET",
    "REMPLACEMENT CYLINDRE",
    "REMPLACEMENT DV",
    "REMPLACEMENT VITRAGE",
    "REMPLACEMENT SIMPLE VITRAGE",
    "REMPLACEMENT DOUBLE VITRAGE",
    "REMPLACEMENT GROUPE DE SÉCURITÉ",
    "REMPLACEMENT MECANISME DE CHASSE D'EAU",
    "REMPLACEMENT MECANISME",
    "REMPLACEMENT MITIGEUR",
    "REMPLACEMENT MÉCANISME DE CHASSE",
    "REMPLACEMENT PACK WC",
    "REMPLACEMENT SANIBROYEUR",
    "REMPLACEMENT SERRURE BOITE AUX LETTRES",
    "REMPLACEMENT SERRURE",
    "REMPLACEMENT VITRAGE",
    "REMPLACEMENT WC",
    "REPARATION FUITE BALLON",
    "REPARATION FUITE CHAUFFE EAU",
    "REPARATION FUITE D'EAU",
    "REPARATION FUITE DERRIERE MACHINE A LAVER",
    "REPARATION FUITE DERRIERE WC",
    "REPARATION FUITE EVIER",
    "REPARATION FUITE MECANISME CHASSE D'EAU",
    "REPARATION FUITE RADIATEUR",
    "REPARATION FUITE SOUS BAIGNOIRE",
    "REPARATION FUITE SOUS CHAUFFE EAU ELECTRIQUE",
    "REPARATION FUITE SOUS CHAUFFE EAU",
    "REPARATION FUITE SOUS EVIER",
    "REPARATION FUITE SOUS LA DOUCHE",
    "REPARATION FUITE SOUS LAVABO",
    "REPARATION FUITE SOUS WC",
    "REPARATION FUITE SOUS ÉVIER",
    "REPARATION FUITE SUR TUYAUTERIE EN CUIVRE",
    "REPARATION FUITE SUR TUYAUTERIE",
    "REPARATION FUITE TUYAUTERIE CUIVRE",
    "REPARATION FUITE TUYAUTERIE PVC",
    "REPARATION FUITE TUYAUTERIE",
    "REPARATION FUITE WC",
    "REPARATION FUITE",
    "REPARATION MECANISME CHASSE D'EAU",
    "REPARATION SERRURE 3 POINTS",
    "REPARATION SERRURE",
    "REPARATION SERRURE",
    "REPARATION SUR SERRURE DE PORTE",
    "TRAVAUX DE PLOMBERIE",
    "TRAVAUX ELECTRIQUE",
    "TRAVAUX PLOMBERIE",
    "WC BOUCHE",
]

module.exports = Description;

},{"lodash/collection/map":19,"lodash/collection/sortby":20,"resemblance":97}],2:[function(require,module,exports){
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
            'date.intervention': {
                $lt: new Date(Date.now() + ms.hours(1))
            },
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
    }]
}

module.exports = FiltersFactory;

},{"lodash/collection/each":15,"milliseconds":94}],3:[function(require,module,exports){
    var _each = require('lodash/collection/each');
    var _includes = require('lodash/collection/includes');
    var _round = require('lodash/math/round')

    var FlushList = function(interArray, prevChecked) {
        var _this = this;
        var list = [];
        _each(interArray, function(e) {
            var rtn = {}
            rtn.montant = {
                base: e.compta.paiement.base,
                total: e.compta.paiement.montant,
                legacy: _this.getPreviousMontant(e),
                balance: _round(e.compta.paiement.montant - _this.getPreviousMontant(e), 2),
                final: _round(e.compta.paiement.montant - _this.getPreviousMontant(e), 2),
            }
            if (e.compta.paiement.tva) {
                var tva = (e.compta.paiement.tva + 100) / 100
                rtn.montant.balance = _round(rtn.montant.balance * tva, 2)
                rtn.montant.legacy = _round(rtn.montant.legacy * tva, 2)
            }
            rtn.id = e.id
            rtn.description = e.description;
            rtn.date = e.compta.paiement.date;
            rtn.login = e.compta.paiement.login
            rtn.checked = _includes(prevChecked, rtn.id)
            rtn.mode = e.compta.paiement.mode
            rtn.numeroCheque = e.compta.paiement.numeroCheque
            rtn.type = rtn.montant.legacy !== 0 ? (rtn.montant.balance > 0 ? 'COMPLEMENT' : 'AVOIR') : 'AUTO-FACT'
            list.push(rtn)
        })
        this.__list = list
    }
    FlushList.prototype.getPreviousMontant = function(inter) {
        if (!inter.compta.paiement.historique.length)
            return 0
        return inter.compta.paiement.historique[inter.compta.paiement.historique.length - 1].payed
    }


    FlushList.prototype.getList = function() {
        return this.__list
    }

    FlushList.prototype.getTotal = function(dirtyReload) {
        var total = {
            base: 0,
            montant: 0,
            balance: 0,
            legacy: 0,
            final: 0
        };
        var list = _(this.getList()).sortBy('montant.balance').reverse().value();
        _each(list, function(rtn) {
            if (rtn.checked && (!dirtyReload || (dirtyReload && rtn.montant.balance >= 0))) {
                total.base = _round(total.base + rtn.montant.base);
                total.montant = _round(total.montant + rtn.montant.total, 2);
                total.legacy = _round(total.legacy + rtn.montant.legacy, 2);
                total.balance = _round(total.balance + rtn.montant.balance, 2);
                if (total.balance + rtn.montant.balance < 0) {
                    if (total.final == 0) {
                        rtn.montant.final = 0;
                    } else {
                        rtn.montant.final = _round(rtn.montant.balance - total.balance, 2);
                        if (rtn.montant.final < rtn.montant.balance) {
                            rtn.montant.final = rtn.montant.balance
                        }
                    }
                }
                total.final = _round(total.final + rtn.montant.final, 2);
            } else {
                rtn.montant.final = _round(rtn.montant.balance, 2)
            }
        })
        this.__list = _(list).sortBy('id').value();
        this.total = total;
        return total;
    }


    module.exports = FlushList;

},{"lodash/collection/each":15,"lodash/collection/includes":18,"lodash/math/round":86}],4:[function(require,module,exports){
 var _each = require('lodash/collection/each');
 var _get = require('lodash/object/get')
 var _clone = require('lodash/lang/clone')
 var _round = require('lodash/math/round')

 var Paiement = function(inter) {
     var _this = this
     if (!(this instanceof Paiement))
         return new Paiement(inter)
     if (inter) {
         _this.inter = function() {
             return inter;
         }

         var reglement = inter.compta.reglement ||  {}
         var paiement = inter.compta.paiement
         if (!inter.compta.paiement.pourcentage) {
             paiement.pourcentage = _clone(inter.sst.pourcentage)
         }
         reglement.montant = _get(inter, 'compta.reglement.montant', 0);
         reglement.avoir = _get(inter, 'compta.reglement.avoir', 0)
         _this.pourcentage = inter.compta.paiement.pourcentage;
         _this.fourniture = this.getFourniture(inter);
         _this.base = inter.compta.paiement.base
         _this.montantHT = _this.base - _this.fourniture.total
         _this.baseDeplacement = _this.prixDeplacement()
         _this.remunerationDeplacement = _this.applyCoeff(_this.baseDeplacement, _this.pourcentage.deplacement);
         _this.baseMaindOeuvre = _this.prixMaindOeuvre();
         _this.remunerationMaindOeuvre = _this.applyCoeff(_this.baseMaindOeuvre, _this.pourcentage.maindOeuvre);
         _this.venteFourniture = _this.base - (_this.baseDeplacement + _this.baseMaindOeuvre);
         _this.coutFourniture = _this.fourniture.total;
         _this.baseMargeFourniture = _this.venteFourniture - _this.coutFourniture;
         /*         if (_this.baseMargeFourniture < 0) {
                      _this.baseMaindOeuvre += _this.baseMargeFourniture;
                      _this.baseMargeFourniture = 0;
                  }*/
         _this.remunerationMargeFourniture = _this.applyCoeff(_this.baseMargeFourniture, _this.pourcentage.fourniture);
         _this.remboursementFourniture = _this.fourniture.artisan;
         _this.montantTotal = _round(_this.remunerationDeplacement + _this.remunerationMargeFourniture + _this.remunerationMaindOeuvre + _this.remboursementFourniture, 2);
         _this.montantTotalTVA = _round(_this.montantTotal * (paiement.tva / 100), 2);
         _this.montantTotalTTC = _round(_this.montantTotal + _this.montantTotalTVA, 2);
     }
 }




 Paiement.prototype = {
     inter: {},
     applyCoeff: function(number, Coeff) {
         return _round(number * (Coeff / 100), 2);
     },
     prixDeplacement: function() {
         if (this.montantHT <= 65) {
             return this.montantHT;
         } else {
             return 65;
         }
     },
     prixMaindOeuvre: function() {
         if (this.montantHT <= 65) {
             return 0;
         } else if (this.montant <= 65) {
             return this.montantHT - 85;
         } else {
             return 85;
         }
     },
     getFourniture: function(inter) {
         var _this = this;
         if (_get(inter, 'compta.paiement.fourniture.total')) {
             return inter.compta.paiement.fourniture;
         }
         var fourniture = {
             artisan: 0,
             edison: 0,
             total: 0
         };
         _each(inter.fourniture, function(e) {
             fourniture[e.fournisseur === 'ARTISAN' ? 'artisan' : 'edison'] += (e.pu * e.quantite);
             fourniture.total += e.pu * e.quantite, 2;
         })
         return fourniture;
     },
     getMontantTTC: function() {
         return this.applyCoeff(this.inter().compta.reglement.montant, 100 + this.inter().tva)
     }
 }
 module.exports = Paiement

},{"lodash/collection/each":15,"lodash/lang/clone":78,"lodash/math/round":86,"lodash/object/get":87}],5:[function(require,module,exports){
angular.module('browserify', [])
    .factory('config', [function() {
        "use strict";
        var config = require("./dataList.js")
        return config;
    }])
    .factory('contextMenuData', [function() {
        return require('./contextMenuData.js')
    }])
    .factory('textTemplate', [function() {
        return require('./textTemplate.js')
    }])
    .factory('FiltersFactory', [function() {
        return require('./FiltersFactory');
    }])
    .factory('Paiement', [function() {
        return require('./Paiement');
    }])
    .factory('FlushList', [function() {
        return require('./FlushList');
    }])
    .factory('Description', [function() {
        return require('./Description');
    }])
    .factory('Combo', [function() {
        return require('./combo-produits');
    }])


},{"./Description":1,"./FiltersFactory":2,"./FlushList":3,"./Paiement":4,"./combo-produits":6,"./contextMenuData.js":7,"./dataList.js":8,"./textTemplate.js":13}],6:[function(require,module,exports){
module.exports = [{
    "title": "Devis débouchage camion haute pression",
    "text": "devis d'<u>assainissement</u> pour <u>le débouchage haute pression de votre canalisation.</u>",
    "ref": "DEVIS_DEBOUCHAGE_CHP",
    "__v": 0,
    "produits": [{
        "title": "DEBOUCHAGE CAMION HAUTE PRESSION",
        "desc": "DEBOUCHAGE CAMION HAUTE PRESSION\nCAMION HYDRO-CUREUR\nDEGRAISSAGE CANALISATION\nPRESSION  >  400 BAR\nRemarques : Nettoyage de conduites domestiques et de l’égout principal jusqu’à un Ø de 300 mm",
        "quantite": 1,
        "pu": 496.25,
        "ref": "DEB066"
    }, {
        "ref": "EDI001",
        "desc": "MAIN D'OEUVRE",
        "title": "MAIN D'OEUVRE",
        "quantite": 1,
        "pu": 85
    }, {
        "ref": "EDI002",
        "desc": "DEPLACEMENT",
        "title": "DEPLACEMENT",
        "quantite": 1,
        "pu": 65
    }]
}, {
    "title": "Devis sany-broyeur",
    "ref": "DEVIS_SANY_B",
    "text": "devis de <u>plomberie</u> pour <u>l'installation d'un système de sani-broyeur</u>",
    "__v": 0,
    "produits": [{
        "title": "SANIBROYEUR PRO WC",
        "desc": "SANIBROYEUR PRO WCEN 12050-3 - Silence\nRégime moteur spécial : 2800 (tr/min)\nRefoulements 5m horizontal\nRefoulements 100m vertical\nAlimentation 220-240 / 50\nGarantie 2 ans constructeur * sous d’une utilisation conforme à la notice\n",
        "quantite": 1,
        "pu": 539.1,
        "ref": "SAN063",
        "showDesc": true
    }, {
        "ref": "EDI001",
        "desc": "MAIN D’OEUVRE",
        "title": "MAIN D’OEUVRE",
        "quantite": 1,
        "pu": 130
    }]
}, {
    "title": "Devis de tableau électrique 2 rangée - 13 modules",
    "ref": "DEVIS_TAB_ELEC_2_13",
    "text": "devis de mise en conformité électrique NF C 15-100, nous vous proposons le remplacement  de votre tableau <strong>2 rangées - 13 modules</strong>",
    "__v": 0,
    "produits": [{
        "title": "Remise en conformité électrique NF C15-100",
        "desc": "Remise en conformité électrique NF C15-100\nIdentification des circuits électriques\nSchéma électrique\n",
        "quantite": 1,
        "pu": 0,
        "ref": "REM089"
    }, {
        "title": "TABLEAU ELECTRIQUE 1 RANGEE - 13 MODULES",
        "desc": "TABLEAU ELECTRIQUE 1 RANGEE - 13 MODULES",
        "quantite": 1,
        "pu": 139.1,
        "ref": "TAB036"
    }, {
        "desc": "INTERUPTEUR DIFFERENTIEL 30 mA - 40A",
        "title": "INTERUPTEUR DIFFERENTIEL 30 mA - 40A",
        "quantite": 2,
        "pu": 166.25,
        "ref": "INT065"
    }, {
        "desc": "DISJONCTEUR DIFFERENTIEL 32 A",
        "title": "DISJONCTEUR DIFFERENTIEL 32 A",
        "quantite": 2,
        "pu": 32.65,
        "ref": "DIS017"
    }, {
        "desc": "DISJONCTEUR DIFFERENTIEL 20 A",
        "title": "DISJONCTEUR DIFFERENTIEL 20 A",
        "quantite": 4,
        "pu": 29.31,
        "ref": "DIS036"
    }, {
        "desc": "DISJONCTEUR DIFFERENTIEL 16 A",
        "title": "DISJONCTEUR DIFFERENTIEL 16 A",
        "quantite": 8,
        "pu": 28.17,
        "ref": "DIS012"
    }, {
        "desc": "DISJONCTEUR DIFFERENTIEL 10 A",
        "title": "DISJONCTEUR DIFFERENTIEL 10 A",
        "quantite": 8,
        "pu": 27.34,
        "ref": "DIS084"
    }, {
        "desc": "PEIGNE UNIPOLAIRE P+N",
        "title": "PEIGNE UNIPOLAIRE P+N",
        "quantite": 4,
        "pu": 12.93,
        "ref": "PEI090"
    }, {
        "desc": "CABLAGE EDF 10 mm²",
        "title": "CABLAGE EDF 10 mm²",
        "quantite": 4,
        "pu": 28.67,
        "ref": "CAB088"
    }, {
        "ref": "EDI001",
        "desc": "MAIN D'OEUVRE",
        "title": "MAIN D'OEUVRE",
        "quantite": 1,
        "pu": 280
    }, {
        "desc": "Dépose de l'existant et mise en service inclus",
        "title": "Dépose de l'existant et mise en service inclus",
        "quantite": 1,
        "pu": 0,
        "ref": "DEP045"
    }]
}, {
    "title": "Devis chauffe-eau gaz ELM LEBLANC",
    "ref": "DEVIS_CHF_EAU_ELM",
    "text": "<u>devis de remplacement de votre chauffe-eau gaz</u>",
    "__v": 0,
    "produits": [{
        "title": "Installation d’un chauffe-eau gaz (eau chaude sanitaire)",
        "desc": "Installation d’un chauffe-eau gaz (eau chaude sanitaire)\nDépose complète de l’existant\nMise à la décharge de l’unité de chauffage existante\nMise en conformité des raccordements gaz\nInstallation et mise en service inclus\n",
        "quantite": 1,
        "pu": 0,
        "ref": "INS058"
    }, {
        "title": "CHAUFFE-EAU GAZ A TIRAGE NATUREL",
        "desc": "CHAUFFE-EAU GAZ A TIRAGE NATUREL\nMarque : ELM LEBLANC - ONDEA\nPuissance : 7 à 29,5 kW\nDébit : 8 à 17 litres / minute\nMode d’allumage par veilleuse\nDimensions (L x P x H ) : 425 x 334 x 655\nCapacité pour : Cuisine + Lavabos + Douche + Baignoire\nÉquipé du système S.P.O.T.T (sécurité gaz)\n",
        "quantite": 1,
        "pu": 938.52,
        "ref": "CHA035"
    }, {
        "desc": "KIT MÉLANGEUR POUR ONDEA",
        "title": "KIT MÉLANGEUR POUR ONDEA",
        "quantite": 1,
        "pu": 89.13,
        "ref": "KIT043"
    }, {
        "desc": "CACHE INFERIEUR LC 17",
        "title": "CACHE INFERIEUR LC 17",
        "quantite": 1,
        "pu": 63.21,
        "ref": "CAC033"
    }, {
        "ref": "EDI001",
        "desc": "MAIN D’OEUVRE",
        "title": "MAIN D’OEUVRE",
        "quantite": 1,
        "pu": 330
    }]
}, {
    "title": "Devis débouchage camion vidange fosse septique",
    "ref": "DEVIS_DEBOUCHAGE_CVFS",
    "text": "devis d'<u>assainissement</u> pour <u>la vidange de votre fosse septique.</u>",
    "__v": 0,
    "produits": [{
        "desc": "VIDANGE FOSSE SEPTIQUE\nCONTENANCE DE LA CUVE = 1 M3PRIX / M3",
        "title": "CONTENANCE DE LA CUVE = 1 M3",
        "quantite": 1,
        "pu": 156.25,
        "ref": "CON045"
    }, {
        "desc": "TRAITEMENT DES DÉCHETS",
        "title": "TRAITEMENT DES DÉCHETS",
        "quantite": 1,
        "pu": 69.21,
        "ref": "TRA080"
    }, {
        "ref": "EDI001",
        "desc": "MAIN D'OEUVRE",
        "title": "MAIN D'OEUVRE",
        "quantite": 1,
        "pu": 85
    }, {
        "ref": "EDI002",
        "desc": "DEPLACEMENT",
        "title": "DEPLACEMENT",
        "quantite": 1,
        "pu": 65
    }]
}, {
    "title": "Devis chaudière gaz mural ELM LEBLANC avec ECS",
    "ref": "DEVIS_CHD_GM_ELM",
    "text": "<u>devis de remplacement de votre chaudière gaz</u>",
    "__v": 0,
    "produits": [{
        "desc": "Installation d’une chaudière gaz (chauffage + eau chaude sanitaire)\nDépose complète de l’existant\nMise à la décharge de l’unité de chauffage existanteMise en conformité des raccordements gaz\nInstallation et mise en service inclus\n",
        "title": "Installation d’une chaudière gaz",
        "quantite": 1,
        "pu": 0,
        "ref": "INS078"
    }, {
        "desc": "CHAUDIERE GAZ A TIRAGE NATUREL",
        "title": "CHAUDIERE GAZ A TIRAGE NATURELPuissance : 9.5 à 24 kW\nDébit : 11.5  litres / minute\nDiamètre évacuation : 125 mm\nMode d’allumage par veilleuse\nDimensions (L x P x H ) : 400 x 385 x 865\nÉquipé du système S.P.O.T.T (sécurité gaz)",
        "quantite": 1,
        "pu": 1438.52,
        "ref": "CHA075"
    }, {
        "desc": "DOSSERET DE REMPLACEMENT CHAUDIÈRE",
        "title": "DOSSERET DE REMPLACEMENT CHAUDIÈRE",
        "quantite": 1,
        "pu": 189.13,
        "ref": "DOS068"
    }, {
        "desc": "SOUPAPE DE SÉCURITÉ 4BAR DN15",
        "title": "SOUPAPE DE SÉCURITÉ 4BAR DN15",
        "quantite": 1,
        "pu": 119.21,
        "ref": "SOU068"
    }, {
        "ref": "EDI001",
        "desc": "MAIN D’OEUVRE",
        "title": "MAIN D’OEUVRE",
        "quantite": 1,
        "pu": 380
    }]
}, {
    "title": "Chauffe eau électrique 200 L HM Blindée",
    "text": "<u>devis de remplacement de votre chauffe-eau electrique</u>",
    "ref": "CHAUFFE_EA",
    "__v": 0,
    "produits": [{
        "desc": "Chauffe-eau électrique horizontale\nRésistance blindée anti-calcaire\nPuissance : 1800 W\nType de courant : monophasé\nV = 200L\nRACCORDEMENT ÉLECTRIQUE MONO 220V (HEURE CREUSE / PLEINE)\nMARQUE ATLANTIC CERTIFIE\n\nGarantie constructeur : Jusqu'à 5 ans\nGarante pièce d'origine : Jusqu'à 2 ans\nAssistance et dépannage constructeur inclus jusqu'à 2 ans\nESSAIS ET MISE EN SERVICE INCLUS",
        "title": "CHAUFFE EAU HM BLINDEE 200L",
        "ref": "CB200H",
        "pu": 696.25,
        "__v": 0,
        "random": 0,
        "quantite": 1
    }, {
        "ref": "BAL002",
        "title": "groupe de securité",
        "desc": "Groupe de securité",
        "pu": 69.97,
        "__v": 0,
        "random": 0,
        "quantite": 1
    }, {
        "ref": "BAL003",
        "title": "Raccordement hydraulique",
        "desc": "Raccordement hydraulique",
        "pu": 16.33,
        "__v": 0,
        "random": 0,
        "quantite": 2
    }, {
        "ref": "EDI001",
        "title": "Main d'œuvre",
        "desc": "Main d'œuvre",
        "pu": 195,
        "__v": 0,
        "random": 1,
        "quantite": 1
    }]
}, {
    "title": "Chauffe eau électrique 200 L VM Blindée",
    "text": "<u>devis de remplacement de votre chauffe-eau electrique</u>",
    "ref": "MONCOMBO",
    "__v": 0,
    "produits": [{
        "__v": 0,
        "title": "CHAUFFE EAU VM BLINDEE 200L",
        "ref": "CEB200",
        "desc": "Chauffe-eau électrique mural vertical\nRésistance blindée anti-calcaire\nPuissance : 1800 W\nType de courant : monophasé\nV = 200L\nRACCORDEMENT ÉLECTRIQUE MONO 220V (HEURE CREUSE / PLEINE)\nMARQUE ATLANTIC CERTIFIE\n\nGarantie constructeur : Jusqu'à 5 ans\nGarante pièce d'origine : Jusqu'à 2 ans\nAssistance et dépannage constructeur inclus jusqu'à 2 ans\nESSAIS ET MISE EN SERVICE INCLUS",
        "pu": 432.1,
        "random": 0,
        "quantite": 1
    }, {
        "ref": "BAL002",
        "title": "groupe de securité",
        "desc": "Groupe de securité",
        "pu": 69.97,
        "__v": 0,
        "random": 0,
        "quantite": 1
    }, {
        "ref": "BAL003",
        "title": "Raccordement hydraulique",
        "desc": "Raccordement hydraulique",
        "pu": 16.33,
        "__v": 0,
        "random": 1,
        "quantite": 2
    }, {
        "ref": "EDI001",
        "title": "Main d'œuvre",
        "desc": "Main d'œuvre",
        "pu": 195,
        "__v": 0,
        "random": 0,
        "quantite": 1
    }]
}, {
    "__v": 0,
    "title": "Chauffe eau électrique 200 L VM steatite",
    "text": "<u>devis de remplacement de votre chauffe-eau électrique steatite</u>",
    "ref": "CHAUFFE_EA",
    "produits": [{
        "quantite": 1,
        "random": 1,
        "pu": 593.21,
        "desc": "Chauffe-eau électrique mural vertical\nRésistance stéatite\nPuissance : 1800 W\nType de courant : monophasé\nV = 200L\nRACCORDEMENT ÉLECTRIQUE MONO 220V (HEURE CREUSE / PLEINE)\nMARQUE ATLANTIC CERTIFIE\n\nGarantie constructeur : Jusqu'à 5 ans\nGarante pièce d'origine : Jusqu'à 5 ans\nAssistance et dépannage constructeur inclus jusqu'à 2 ans\nESSAIS ET MISE EN SERVICE INCLUS",
        "title": "CHAUFFE EAU VM STEATITE 200L",
        "ref": "CES200",
        "__v": 0,
    }, {
        "quantite": 1,
        "random": 0,
        "__v": 0,
        "pu": 69.97,
        "desc": "Groupe de securité",
        "title": "groupe de securité",
        "ref": "BAL002",
    }, {
        "quantite": 2,
        "random": 1,
        "__v": 0,
        "pu": 16.33,
        "desc": "Raccordement hydraulique",
        "title": "Raccordement hydraulique",
        "ref": "BAL003",
    }, {
        "quantite": 1,
        "random": 1,
        "__v": 0,
        "pu": 195,
        "desc": "Main d'œuvre",
        "title": "Main d'œuvre",
        "ref": "EDI001",
    }]
}, {
    "title": "Devis de tableau électrique 1 rangée - 13 modules",
    "ref": "DEVIS_TAB_ELEC_1_13",
    "text": "devis de mise en conformité électrique NF C 15-100, nous vous proposons le remplacement  de votre tableau <strong>1 rangée - 13 modules</strong>",
    "__v": 0,
    "produits": [{
        "title": "Remise en conformité électrique NF C15-100",
        "desc": "Remise en conformité électrique NF C15-100\nIdentification des circuits électriques\nSchéma électrique\n",
        "pu": 0,
        "quantite": 1,
        "ref": "REM046"
    }, {
        "desc": "TABLEAU ELECTRIQUE 1 RANGEE - 13 MODULES",
        "title": "TABLEAU ELECTRIQUE 1 RANGEE - 13 MODULES",
        "quantite": 1,
        "pu": 89.1,
        "ref": "TAB066"
    }, {
        "desc": "INTERUPTEUR DIFFERENTIEL 30 mA - 40A",
        "title": "INTERUPTEUR DIFFERENTIEL 30 mA - 40A",
        "quantite": 1,
        "pu": 166.25,
        "ref": "INT034"
    }, {
        "desc": "DISJONCTEUR DIFFERENTIEL 32 A",
        "title": "DISJONCTEUR DIFFERENTIEL 32 A",
        "quantite": 1,
        "pu": 32.65,
        "ref": "DIS015"
    }, {
        "desc": "DISJONCTEUR DIFFERENTIEL 20 A",
        "title": "DISJONCTEUR DIFFERENTIEL 20 A",
        "quantite": 2,
        "pu": 29.31,
        "ref": "DIS032"
    }, {
        "desc": "DISJONCTEUR DIFFERENTIEL 16 A",
        "title": "DISJONCTEUR DIFFERENTIEL 16 A",
        "quantite": 4,
        "pu": 28.17,
        "ref": "DIS083"
    }, {
        "desc": "DISJONCTEUR DIFFERENTIEL 10 A",
        "title": "DISJONCTEUR DIFFERENTIEL 10 A",
        "quantite": 4,
        "pu": 27.34,
        "ref": "DIS016"
    }, {
        "desc": "PEIGNE UNIPOLAIRE P+N",
        "title": "PEIGNE UNIPOLAIRE P+N",
        "quantite": 2,
        "pu": 12.93,
        "ref": "PEI023"
    }, {
        "desc": "CABLAGE EDF 10 mm²",
        "title": "CABLAGE EDF 10 mm²",
        "quantite": 2,
        "pu": 28.67,
        "ref": "CAB032"
    }, {
        "ref": "EDI001",
        "desc": "MAIN D'OEUVRE\nDépose de l'existant et mise en service inclus",
        "title": "MAIN D'OEUVRE",
        "quantite": 1,
        "pu": 280
    }]
}, {
    "title": "Devis wc supendu",
    "text": "<u>devis du wc suspendu</u>",
    "ref": "DEVIS_WC_S",
    "__v": 0,
    "produits": [{
        "__v": 0,
        "desc": "PACK WC SUSPENDU AVEC ABATTANT À FERMETURE\nRALENTIE LOVELY RIMFREE BLANC RÉF 08399600000100\nALLIA",
        "pu": 571.5,
        "title": "PACK WC SUSPENDU AVEC ABATTANT À FERMETURE",
        "ref": "536295",
        "random": 0,
        "quantite": 1,
        "showDesc": true
    }, {
        "__v": 0,
        "desc": "BÂTI-SUPPORT AUTOPORTANT DUOFIX PLUS UP320 H :\n112 CM 111.333.00.5 GEBERIT",
        "title": "BÂTI-SUPPORT AUTOPORTANT DUOFIX",
        "ref": "659854",
        "pu": 329.77,
        "random": 1,
        "quantite": 1,
        "showDesc": true
    }, {
        "__v": 0,
        "desc": "PLAQUE BA12 POUR HABILLAGE CARRELAGE",
        "title": "PLAQUE BA12 POUR HABILLAGE CARRELAGE",
        "ref": "458956",
        "pu": 139.1,
        "random": 0,
        "quantite": 1,
        "showDesc": true
    }, {
        "desc": "PIPE ÉVACUATION FLEXIBLE POUR WC SUSPENDU",
        "pu": 113.21,
        "ref": "698545",
        "title": "PIPE ÉVACUATION FLEXIBLE POUR WC SUSPENDU",
        "__v": 0,
        "random": 0,
        "quantite": 1,
        "showDesc": true
    }, {
        "ref": "EDI001",
        "title": "Main d'œuvre",
        "desc": "Main d'œuvre",
        "pu": 380,
        "__v": 0,
        "random": 1,
        "quantite": 1,
        "showDesc": true
    }]
}]

},{}],7:[function(require,module,exports){
module.exports = {
    artisan: [{
        title: 'Modifier la Fiche',
        action: "ouvrirFiche"
    }, {
        title: 'Ouvrir Recap',
        action: "ouvrirRecap",
        hide: function(artisan) {
            return artisan.status !== 'POT';
        }
    }, {
        title: "Archiver",
        action: 'archiver',
        hide: function(artisan) {
            return artisan.status === 'ARC';
        }
    }, {
        title: "dé-Archiver",
        action: 'deArchiver',
        hide: function(artisan) {
            return artisan.status !== 'ARC';
        }
    }, {
        title: "Envoyer Contrat",
        action: 'envoiContrat',
        hide: function(artisan) {
            return (artisan.document && artisan.document.cni && artisan.document.kbis && artisan.document.contrat);
        }
    }, {
        title: "Manager",
        action: 'manager',
    }, {
        title: "Rappel Contrat",
        action: 'rappelContrat',
        hide: function(artisan) {
            return !artisan.historique.contrat.length || (artisan.document && artisan.document.cni && artisan.document.kbis && artisan.document.contrat);
        }
    }, {
        title: "Facturier/deviseur",
        action: 'facturierDeviseur',
    }, {
        title: 'Appels',
        style: {
            fontWeight: 'bold'
        },
        subs: [{
            title: 'Telephone 1',
            action: 'callTel1',
            binding: 'telephone.tel1',
            hide: function(artisan) {
                return !artisan.telephone.tel1
            }
        }, {
            title: 'Telephone 2',
            action: 'callTel2',
            binding: 'telephone.tel2',
            hide: function(artisan) {
                return !artisan.telephone.tel2
            }
        }]
    }],
    devis: [{
        title: 'Modifier le devis',
        action: "ouvrirFiche",
        style: {
            fontWeight: 'bold'
        },
    }, {
        title: 'Appels',
        style: {
            fontWeight: 'bold'
        },
        subs: [{
            title: 'Client tel1',
            action: 'callTel1',
            binding: 'client.telephone.tel1',
            hide: function(inter) {
                return !inter.client.telephone.tel1
            }
        }, {
            title: 'Client tel2',
            action: 'callTel2',
            binding: 'client.telephone.tel2',
            hide: function(inter) {
                return !inter.client.telephone.tel2
            }
        }, {
            title: 'Client tel3',
            binding: 'client.telephone.tel3',
            action: 'callTel3',
            hide: function(inter) {
                return !inter.client.telephone.tel3
            }
        }]
    }, {
        title: "Prévisualiser",
        action: 'devisPreview',
    }, {
        title: "Envoyer",
        action: 'sendDevis',
        hide: function(inter) {
            return inter.status === "TRA" || (inter.historique && inter.historique.length != 0);
        }
    }, {
        title: "Relance 1",
        action: 'sendDevis',
        hide: function(inter) {
            return inter.status === "TRA" || (!inter.historique || inter.historique.length != 1);
        }
    }, {
        title: "Relance 2",
        action: 'sendDevis',
        hide: function(inter) {
            return inter.status === "TRA" || (!inter.historique || inter.historique.length < 2);
        }
    }, {
        title: "Transferer",
        action: 'transfert',
        hide: function(inter) {
            return inter.status === 'TRA';
        }
    }, {
        title: "Annuler",
        action: 'annulation',
        hide: function(inter) {
            return inter.status === 'ANN';
        }
    }],
    intervention: [{
        title: "Modifier l'intervention",
        action: "ouvrirFiche",
        style: {
            fontWeight: 'bold'
        }
    }, {
        title: 'Appels',
        style: {
            fontWeight: 'bold'
        },
        subs: [{
            title: 'Client tel1',
            action: 'callTel1',
            binding: 'client.telephone.tel1',
            hide: function(inter) {
                return !inter.client.telephone.tel1
            }
        }, {
            title: 'Client tel2',
            action: 'callTel2',
            binding: 'client.telephone.tel2',
            hide: function(inter) {
                return !inter.client.telephone.tel2
            }
        }, {
            title: 'Client tel3',
            action: 'callTel3',
            binding: 'client.telephone.tel3',
            hide: function(inter) {
                return !inter.client.telephone.tel3
            }
        }, {
            title: 'Sous-traitant tel1',
            action: 'callSst1',
            binding: 'sst.telephone.tel1',
            hide: function(inter) {
                return !inter.sst || !inter.sst.telephone.tel1
            }
        }, {
            title: 'Sous-traitant tel2',
            action: 'callSst2',
            binding: 'sst.telephone.tel2',
            hide: function(inter) {
                return !inter.sst || !inter.sst.telephone.tel2
            }
        }, {
            title: 'Payeur tel1',
            action: 'callPayeur1',
            binding: 'sst.facture.tel',
            hide: function(inter) {
                return !inter.facture || !inter.facture.tel
            }
        }, {
            title: 'Payeur tel2',
            action: 'callPayeur2',
            binding: 'sst.facture.tel2',
            hide: function(inter) {
                return !inter.facture || !inter.facture.tel2
            }
        }]
    }, {
        title: 'Recap sous-traitant',
        action: "ouvrirRecapSST",
        hide: function(inter) {
            return !inter.artisan || !inter.artisan.id
        }
    }, {
        title: 'Reglement Client',
        action: "validerReglement",
        hide: function(inter) {
            return !(app_session.root ||  app_session.service === 'COMPTABILITE') ||  (inter.status !== 'ENC' && inter.status !== 'VRF');
        }
    }, {
        title: 'Paiement SST',
        action: "validerPaiement",
        hide: function(inter) {
            return !((app_session.root ||  app_session.service === 'COMPTABILITE') && (inter.status === 'VRF' || inter.status === "ENC"));
        }
    }, {
        title: "SMS sous-traitant",
        action: 'smsArtisan',
        hide: function(inter) {
            return !inter.artisan || !inter.artisan.id
        }
    }, {
        title: "Envoyer",
        action: 'envoi',
        hide: function(inter) {
            return inter.status == "VRF" || (!inter.artisan || !inter.artisan.id)
        }
    }, {
        title: "Vérifier",
        action: 'verification',
        hide: function(inter) {
            return inter.status !== "AVR" && inter.status !== 'ENC'
        }
    }, {
        title: "Reactiver",
        action: 'reactivation',
        hide: function(inter) {
            return inter.status !== 'ANN'
        }
    }, {
        title: "Annuler",
        action: 'annulation',
        hide: function(inter) {
            return !inter.id || inter.status === 'ANN' || inter.status === 'VRF'
        }
    }, {
        title: "Recouvrement",
        action: 'recouvrement',
        hide: function(inter) {
            return inter.compta.reglement.recu || inter.status !== "VRF"
        }
    }, {
        title: "Je prend !",
        action: 'demarcher',
        hide: function(inter) {
            return !inter.aDemarcher;
        }
    }]
}

},{}],8:[function(require,module,exports){
module.exports = {
    categories: {
        PL: {
            id_compta: 2,
            suffix: 'de',
            short_name: 'PL',
            long_name: 'Plomberie',
            order: 0,
            color: 'blue white-text'
        },
        CH: {
            id_compta: 3,
            suffix: 'de',
            short_name: 'CH',
            long_name: 'Chauffage',
            order: 1,
            color: 'red white-text'
        },
        EL: {
            id_compta: 1,
            suffix: "d'",
            short_name: 'EL',
            long_name: 'Électricité',
            order: 2,
            color: 'yellow  accent-4 black-text'
        },
        SR: {
            id_compta: 5,
            suffix: 'de',
            short_name: 'SR',
            long_name: 'Serrurerie',
            order: 3,
            color: 'brown white-text'
        },
        VT: {
            id_compta: 4,
            suffix: 'de',
            short_name: 'VT',
            long_name: 'Vitrerie',
            order: 4,
            color: 'green white-text'
        },
        AS: {
            id_compta: 7,
            suffix: 'de',
            short_name: 'AS',
            long_name: 'Assainissement',
            order: 5,
            color: 'orange white-text'
        },
        CL: {
            id_compta: 6,
            suffix: 'de',
            short_name: 'CL',
            long_name: 'Climatisation',
            order: 6,
            color: 'teal white-text'
        },
        PT: {
            id_compta: 9,
            suffix: 'de',
            short_name: 'PT',
            long_name: 'Peinture',
            order: 7,
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
            color: 'blue'
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

},{"lodash/collection/find":16}],9:[function(require,module,exports){
var DateSelect = function(dateStart) {
    var _ = require('lodash')
    var _this = this;
    var d = new Date();
    _this.start = {
        m: !dateStart ? 9 : dateStart.getMonth() + 1,
        y: !dateStart ? 2013 : dateStart.getFullYear()
    }
    console.log('==>', start)
    _this.current = {
        m: d.getMonth() + 1,
        y: d.getFullYear()
    }

    var frenchMonths = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Aout', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
    _this._list = [];
    _.times(_this.current.y - _this.start.y + 1, function(yr) {
        _.times(12, function(mth) {
            _this._list.push({
                m: mth + 1,
                y: _this.start.y + yr,
                t: frenchMonths[mth] + ' ' + (_this.start.y + yr),
                o: (_this.start.y + yr) + (mth + 1) * 0.01
            })
        })
    })
    _this._list.splice(_this.current.m - 12)
    return this._list;
}
module.exports = DateSelect;

},{"lodash":21}],10:[function(require,module,exports){
module.exports = function(d) {
	return Math.round(((new Date(d)).getTime() / 10000) - 137000000)
}
},{}],11:[function(require,module,exports){
module.exports = [{
    "payeur": "SOC",
    "nom": "MONDIAL ASSISTANCE",
    "tel": "0123212321",
    "tel2": "",
    "email": "QSDQSD@DQSD.DE",
    "ref": "mondial_as",
    "__v": 0,
    "address": {
        "n": "12",
        "r": "RUE DU CHEVALIER DE LA BARRE",
        "cp": "75018",
        "v": "PARIS"
    }
}, {
    "nom": "EDISON SERVICES",
    "tel": "0618513199",
    "email": "CONTACT@EDISON-SERVICES.FR",
    "ref": "edison_ser",
    "__v": 0,
    "address": {
        "n": "75",
        "r": "RUE DES DAMES",
        "cp": "75017",
        "v": "PARIS"
    }
}, {
    "nom": "FRANCE LOISIRS",
    "prenom": "COMPTABILITE FOURNISSEUR",
    "email": "AGNES.GEORGIN@FRANCE-LOISIRS.COM",
    "tel": "0145686038",
    "ref": "france_loi",
    "__v": 0,
    "address": {
        "n": "123",
        "r": "RUE DE GRENELLE",
        "cp": "75007",
        "v": "PARIS"
    }
}, {
    "email": "FOURNISSEURS@BABILOU.COM",
    "tel": "0141496784",
    "nom": "EVANCIA SAS",
    "ref": "evancia_sa",
    "__v": 0,
    "address": {
        "n": "24",
        "r": "RUE DU MOULIN DES BRUYÈRES",
        "cp": "92400",
        "v": "COURBEVOIE"
    }
}, {
    "nom": "1001 CRÈCHES",
    "email": "FOURNISSEURS@BABILOU.COM",
    "tel": "0141490062",
    "ref": "1001_crech",
    "__v": 0,
    "address": {
        "n": "24",
        "r": "RUE DU MOULIN DES BRUYÈRES",
        "cp": "92400",
        "v": "COURBEVOIE"
    }
}, {
    "email": "CONTACT@BONAPART.FR",
    "nom": "CABINET BONAPART GESTION",
    "payeur": "SOC",
    "prenom": "STEVEN ZAKIN",
    "tel": "0171197565",
    "tel2": "0667086698",
    "ref": "cabinet_bo",
    "__v": 0,
    "address": {
        "n": "1",
        "r": "RUE CONTE",
        "cp": "75003",
        "v": "PARIS"
    }
}]

},{}],12:[function(require,module,exports){
module.exports = [{
    "title": "BOUCHE VMC",
    "desc": "Bouche pour VMC\n- Bouche utilisée en VMC pavillonnaire(simple flux autoréglable ou double flux)ou VMP (ventilation mécanique ponctuelle).",
    "ref": "VMC002",
    "pu": 34.93
}, {
    "title": "GAINE CUISINE",
    "desc": "GAINE SPLE ALU GSA 125 3M\n- Utilisation en VMC habitat et tertiaire.\n- Température d'utilisation de -30 à +250°C.",
    "ref": "VMC003",
    "pu": 36.93
}, {
    "title": "GAINE AUTRES",
    "desc": "GAINE SPLE ALU GSA 80 3M\n- Utilisation en VMC habitat et tertiaire.\n- Température d'utilisation de -30 à +250°C.",
    "pu": 33.21,
    "ref": "VMC004",
}, {
    "title": "SANIBROYEUR PRO WC",
    "desc": "SANIBROYEUR PRO WC",
    "pu": 539.1,
    "ref": "SAN010",
}, {
    "desc": "DISJONCTEUR DIFFERENTIEL 32 A",
    "title": "DISJONCTEUR DIFFERENTIEL 32 A",
    "pu": 32.65,
    "ref": "DIS044",
}, {
    "desc": "VIDANGE FOSSE SEPTIQUE",
    "title": "VIDANGE FOSSE SEPTIQUE",
    "pu": 156.25,
    "ref": "CON016",
}, {
    "desc": "DISJONCTEUR DIFFERENTIEL 20 A",
    "title": "DISJONCTEUR DIFFERENTIEL 20 A",
    "pu": 29.31,
    "ref": "DIS017",
}, {
    "ref": "EDI001",
    "title": "Main d'œuvre",
    "desc": "Main d'œuvre",
    "pu": 65,
}, {
    "desc": "DISJONCTEUR DIFFERENTIEL 16 A",
    "title": "DISJONCTEUR DIFFERENTIEL 16 A",
    "pu": 28.17,
    "ref": "DIS095",
}, {
    "desc": "DISJONCTEUR DIFFERENTIEL 10 A",
    "title": "DISJONCTEUR DIFFERENTIEL 10 A",
    "pu": 27.34,
    "ref": "DIS061",
}, {
    "title": "SIMPLE VITRAGE LIVRAISON",
    "ref": "LIV001",
    "desc": "DÉPOSE / LIVRAISON et TRANSPORT",
    "pu": 35,
}, {
    "title": "DOUBLE VITRAGE LIVRAISON",
    "desc": "DÉPOSE / LIVRAISON et TRANSPORT",
    "ref": "LIV002",
    "pu": 55,
}, {
    "title": "MAIN D'OEUVRE VITRERIE",
    "ref": "VIT001",
    "pu": 130,
    "desc": "MAIN D'OEUVRE\nDEPLACEMENTS",
}, {
    "title": "CYLINDRE PROFIL EURO",
    "ref": "CYL001",
    "desc": "CYLINDRE PROFIL EUROPÉEN\n30 X 40\nFOURNIS AVEC 3 CLES",
    "pu": 96.25,
}, {
    "desc": "CYLINDRE PROFIL EUROPÉEN DE SÛRETÉ\n30 X 40\nFOURNIS AVEC CLÉS\nCARTE DE PROPRIÉTÉ\nREPRODUCTION INTERDITE",
    "title": "CYLINDRE PROFIL EURO SECURITE",
    "ref": "CYL002",
    "pu": 169.1,
}, {
    "title": "LAVABOS",
    "desc": "VICTORIA LAVABO 60 BLC",
    "ref": "LAV001",
    "pu": 139.1
}, {
    "title": "COLONNE LAVABOS",
    "desc": "VICTORIA COLONNE BLC",
    "pu": 96.25,
    "ref": "LAV002",
}, {
    "ref": "EDI002",
    "title": "Déplacement",
    "desc": "Déplacement",
    "pu": 65,
}, {
    "title": "SERRURE 1 POINT APPLIQUE",
    "desc": "SERRURE 1 POINT APPLIQUE\nCYLINDRE PROFIL EUROPEEN\nHORIZONTAL / VERTICAL A FOUILLOT OU A TIRAGE\nFOURNIS AVEC CLES",
    "pu": 139.1,
    "ref": "SER001",
}, {
    "title": "SERRURE 3 POINTS APPLIQUE",
    "ref": "SER004",
    "desc": "SERRURE 3 POINTS APPLIQUE\nCYLINDRE PROFIL EUROPEEN\nHORIZONTAL / VERTICAL A FOUILLOT OU A TIRAGE\nFOURNIS AVEC CLÉS",
    "pu": 246.25,
}, {
    "desc": "Ensemble mécanisme WC 3/6L ECO\nDouble volume\nJusqu'à -50% d'économie d'eau\nModèle adaptable",
    "title": "MECANISME CHASSE WC 3/6L",
    "ref": "MEC001",
    "pu": 96.25
}, {
    "desc": "PACK WC SUSPENDU AVEC ABATTANT À FERMETURE\nRALENTIE LOVELY RIMFREE BLANC RÉF 08399600000100\nALLIA",
    "pu": 571.5,
    "title": "PACK WC SUSPENDU AVEC ABATTANT À FERMETURE",
    "ref": "536295"
}, {
    "desc": "BÂTI-SUPPORT AUTOPORTANT DUOFIX PLUS UP320 H :\n112 CM 111.333.00.5 GEBERIT",
    "title": "BÂTI-SUPPORT AUTOPORTANT DUOFIX",
    "ref": "659854",
    "pu": 329.77
}, {
    "desc": "PLAQUE BA12 POUR HABILLAGE CARRELAGE",
    "title": "PLAQUE BA12 POUR HABILLAGE CARRELAGE",
    "ref": "458956",
    "pu": 139.1
}, {
    "desc": "PEIGNE UNIPOLAIRE P+N",
    "title": "PEIGNE UNIPOLAIRE P+N",
    "pu": 12.93,
    "ref": "PEI062",
}, {
    "desc": "CABLAGE EDF 10 mm²",
    "title": "CABLAGE EDF 10 mm²",
    "pu": 28.67,
    "ref": "CAB046",
}, {
    "desc": "Dépose de l'existant et mise en service inclus",
    "title": "Dépose de l'existant et mise en service inclus",
    "pu": 0,
    "ref": "DEP017",
}, {
    "desc": "CACHE INFERIEUR LC 17",
    "title": "CACHE INFERIEUR LC 17",
    "pu": 63.21,
    "ref": "CAC079",
}, {
    "desc": "Installation d’une chaudière gaz",
    "title": "Installation d’une chaudière gaz",
    "pu": 0,
    "ref": "INS027",
}, {
    "desc": "DOSSERET DE REMPLACEMENT CHAUDIÈRE",
    "title": "DOSSERET DE REMPLACEMENT CHAUDIÈRE",
    "pu": 189.13,
    "ref": "DOS040",
}, {
    "ref": "BAL004",
    "title": "Trépied Ballon",
    "desc": "Trépied Ballon",
    "pu": 93.21,
}, {
    "desc": "PIPE ÉVACUATION FLEXIBLE POUR WC SUSPENDU",
    "pu": 113.21,
    "ref": "698545",
    "title": "PIPE ÉVACUATION FLEXIBLE POUR WC SUSPENDU",
}, {
    "desc": "SOUPAPE DE SÉCURITÉ 4BAR DN15",
    "title": "SOUPAPE DE SÉCURITÉ 4BAR DN15",
    "pu": 119.21,
    "ref": "SOU054",
}, {
    "title": "Remise en conformité électrique NF C15-100",
    "desc": "Remise en conformité électrique NF C15-100",
    "pu": 0,
    "ref": "REM078",
}, {
    "ref": "VIT002",
    "title": "Remplacement Vitrage",
    "desc": "Remplacement Vitragess",
    "pu": 297.13,
}, {
    "ref": "CAM001",
    "title": "Camion D'assainisement",
    "desc": "Camion D'assainisement",
    "pu": 696.25,
}, {
    "desc": "TRAITEMENT DES DÉCHETS",
    "title": "TRAITEMENT DES DÉCHETS",
    "pu": 69.21,
    "ref": "TRA088",
}, {
    "desc": "INTERUPTEUR DIFFERENTIEL 30 mA - 40A",
    "title": "INTERUPTEUR DIFFERENTIEL 30 mA - 40A",
    "pu": 166.25,
    "ref": "INT012",
}, {
    "desc": "TABLEAU ELECTRIQUE 1 RANGEE - 13 MODULES",
    "title": "TABLEAU ELECTRIQUE 1 RANGEE - 13 MODULES",
    "pu": 89.1,
    "ref": "TAB093",
}, {
    "desc": "APPL D E 120GT 2T 12V\nGâche pour serrure applique verticale\n- Modèle en aluminium à double empênage.\n- Tension 12 volts.",
    "title": "GACHE ELECTRIQUE",
    "pu": 155.4,
    "ref": "000418"
}, {
    "desc": "Transformateur - Chrono code: 396431\n- 12 ou 24V AC.\n- Puissance de sortie 1,25 A.",
    "title": "TRANSFO 12V",
    "pu": 94.11,
    "ref": "396431"
}, {
    "title": "CHAUDIERE GAZ A TIRAGE NATUREL",
    "desc": "CHAUDIERE GAZ A TIRAGE NATUREL\nPUISSANCE : 9.5 À 24 KW\nDÉBIT : 11.5  LITRES / MINUTE\nDIAMÈTRE ÉVACUATION : 125 MM\nMODE D’ALLUMAGE PAR VEILLEUSE\nDIMENSIONS (L X P X H ) : 400 X 385 X 865\nÉQUIPÉ DU SYSTÈME S.P.O.T.T (SÉCURITÉ GAZ)",
    "pu": 1438.52,
    "ref": "CHA047",
}, {
    "title": "CHAUFFE EAU VM BLINDEE 200L",
    "ref": "CEB200",
    "desc": "Chauffe-eau électrique mural vertical\nRésistance blindée anti-calcaire\nPuissance : 1800 W\nType de courant : monophasé\nV = 200L\nRACCORDEMENT ÉLECTRIQUE MONO 220V (HEURE CREUSE / PLEINE)\nMARQUE ATLANTIC CERTIFIE\n\nGarantie constructeur : Jusqu'à 5 ans\nGarante pièce d'origine : Jusqu'à 2 ans\nAssistance et dépannage constructeur inclus jusqu'à 2 ans\nESSAIS ET MISE EN SERVICE INCLUS",
    "pu": 432.1
}, {
    "ref": "CES200",
    "title": "CHAUFFE EAU VM STEATITE 200L",
    "desc": "Chauffe-eau électrique mural vertical\nRésistance stéatite\nPuissance : 1800 W\nType de courant : monophasé\nV = 200L\nRACCORDEMENT ÉLECTRIQUE MONO 220V (HEURE CREUSE / PLEINE)\nMARQUE ATLANTIC CERTIFIE\n\nGarantie constructeur : Jusqu'à 5 ans\nGarante pièce d'origine : Jusqu'à 5 ans\nAssistance et dépannage constructeur inclus jusqu'à 2 ans\nESSAIS ET MISE EN SERVICE INCLUS",
    "pu": 593.21
}, {
    "ref": "ZEN200",
    "title": "CHAUFFE EAU VM ZENEO 200L",
    "desc": "Chauffe-eau électrique mural vertical\nRésistance stéatite\nPuissance : 2200 W\nType de courant : monophasé\nV = 200L\nRACCORDEMENT ÉLECTRIQUE MONO 220V (HEURE CREUSE / PLEINE)\nMARQUE ATLANTIC CERTIFIE\n\nGarantie constructeur : Jusqu'à 5 ans\nGarante pièce d'origine : Jusqu'à 5 ans\nAssistance et dépannage constructeur inclus jusqu'à 2 ans\nESSAIS ET MISE EN SERVICE INCLUS",
    "pu": 696.25
}, {
    "desc": "Chauffe-eau électrique horizontale\nRésistance blindée anti-calcaire\nPuissance : 1800 W\nType de courant : monophasé\nV = 200L\nRACCORDEMENT ÉLECTRIQUE MONO 220V (HEURE CREUSE / PLEINE)\nMARQUE ATLANTIC CERTIFIE\n\nGarantie constructeur : Jusqu'à 5 ans\nGarante pièce d'origine : Jusqu'à 2 ans\nAssistance et dépannage constructeur inclus jusqu'à 2 ans\nESSAIS ET MISE EN SERVICE INCLUS",
    "title": "CHAUFFE EAU HM BLINDEE 200L",
    "ref": "CB200H",
    "pu": 696.25,
}, {
    "title": "CHAUFFE EAU HM STEATITE 200L",
    "ref": "CS200H",
    "pu": 739.1,
    "desc": "Chauffe-eau électrique horizontale\nRésistance blindée anti-calcaire\nPuissance : 1800 W\nType de courant : monophasé\nV = 200L\nRACCORDEMENT ÉLECTRIQUE MONO 220V (HEURE CREUSE / PLEINE)\nMARQUE ATLANTIC CERTIFIE\n\nGarantie constructeur : Jusqu'à 5 ans\nGarante pièce d'origine : Jusqu'à 5 ans\nAssistance et dépannage constructeur inclus jusqu'à 2 ans\nESSAIS ET MISE EN SERVICE INCLUS",
}, {
    "desc": "CYLINDRE PROFIL EUROPÉEN DE HAUTE SÛRETÉ\nCANON ANTI-EFFRACTION / ANTI-PERÇAGE\n30 X 40\nFOURNIS AVEC CLÉS\nCARTE DE PROPRIÉTÉ\nREPRODUCTION INTERDITE",
    "title": "CYLINDRE PROFIL EURO DE HAUTE SURETE",
    "pu": 269.1,
    "ref": "CYL003",
}, {
    "ref": "SER003",
    "title": "SERRURE 1 POINT APPLIQU DE HAUTE SURETE",
    "desc": "SERRURE 1 POINT APPLIQUE DE SÛRETÉ\nCYLINDRE PROFIL EUROPEEN DE HAUTE SURETE\nHORIZONTAL / VERTICAL A FOUILLOT OU A TIRAGE\nFOURNIS AVEC CLÉS BLINDE\nCARTE DE PROPRIÉTÉ / REPRODUCTION INTERDITE",
    "pu": 296.25,
}, {
    "ref": "SER005",
    "desc": "SERRURE 3 POINTS APPLIQUE DE SÛRETÉ\nCYLINDRE PROFIL EUROPEEN\nHORIZONTAL / VERTICAL A FOUILLOT OU A TIRAGE\nFOURNIS AVEC CLÉS\nCARTE DE PROPRIÉTÉ / REPRODUCTION INTERDITE",
    "title": "SERRURE 3 POINTS APPLIQUE DE SURETE",
    "pu": 396.25,
}, {
    "ref": "SER002",
    "title": "SERRURE 1 POINT APPLIQUE SECURITE",
    "desc": "SERRURE 1 POINT APPLIQUE DE SÛRETÉ\nCYLINDRE PROFIL EUROPEEN\nHORIZONTAL / VERTICAL A FOUILLOT OU A TIRAGE\nFOURNIS AVEC CLÉS\nCARTE DE PROPRIÉTÉ / REPRODUCTION INTERDITE",
    "pu": 226.25,
}, {
    "desc": "SERRURE 3 POINTS APPLIQUE DE SÛRETÉ\nCYLINDRE PROFIL EUROPEEN DE HAUTE SURETE\nHORIZONTAL / VERTICAL A FOUILLOT OU A TIRAGE\nFOURNIS AVEC CLÉS BLINDE\nCARTE DE PROPRIÉTÉ / REPRODUCTION INTERDITE",
    "ref": "SER006",
    "title": "SERRURE 3 POINTS APPLIQUE DE HAUTE SECURITE",
    "pu": 596.2,
}, {
    "ref": "SVI001",
    "title": "SIMPLE VITRAGE",
    "desc": "REMPLACEMENT D'UN VITRAGE SUITE A BRIS DE GLACE :\n\nPORTE FENÊTRE\nSIMPLE VITRAGE\nVITRAGE CLAIR\nHaut 2000 mm X Larg 1000 mm\nCHÂSSIS PVC / ALU / BOIS\n\nCOMMANDE SPÉCIALE SUR MESURE \nADAPTATION ET FIXATION SUR PLACE \nREMPLACEMENT A L'IDENTIQUE",
    "pu": 197.13,
}, {
    "ref": "DVI001",
    "title": "DOUBLE VITRAGE",
    "desc": "PORTE FENÊTRE\nDOUBLE VITRAGE\nVITRAGE CLAIR\nHaut 2000 mm X Larg 1000 mm\nCHÂSSIS PVC / ALU / BOIS\n\nCOMMANDE SPÉCIALE SUR MESURE \nADAPTATION ET FIXATION SUR PLACE \nREMPLACEMENT A L'IDENTIQUE",
    "pu": 297.13,
}, {
    "title": "FLEXIBLE FILAIRE POUR DIGICODE",
    "desc": "Flexible - Chrono code: 569833\n- Embouts en ABS avec prédécoupe.\n- Ressort en acier inox.\n- Longueur 500 mm diamètre 12 mm intérieur.",
    "ref": "569833",
    "pu": 39.54
}, {
    "title": "FERME PORTE",
    "desc": "Ferme-porte à pignon et crémaillère.\n- Avec force réglable en continue de 2 à 6.\n- Réagit en proportion de la violence d’ouverture \n- Freinage à l’ouverture réglable et débrayable.",
    "ref": "DOR001",
    "pu": 277.38,
}, {
    "desc": "Clavier à 30 codes de 3 à 8 termes.\n- 13 codes commandant le relais n°1 et n°2. \n- 1 code de mise “on/off” d’alarme (relais n°3).1 code de “contrainte” commandant les relais n°1 et n°2.1 code de programmation.\n- Programmation des codes par le clavier.",
    "ref": "481448",
    "title": "DIGICODE",
    "pu": 338.94
}, {
    "desc": "Groupe de sécurité anti-calcaire 3/4.Robinet à sphère.\nClapet démontable\nRaccordement eau froide et chauffe eau : 20/27.Echappement 26/34.7 bars.\nEntonnoir siphon",
    "title": "GROUPE DE SECURITE",
    "ref": "GRS001",
    "pu": 69.13
}, {
    "desc": "Cylindre 787 Z - Chrono code: 098953\n- Cylindre de très haute sécurité / double cylindre anti-effraction\n- Cylindre monobloc à panneton.\n- Livré avec clés et carte de reproduction.\nREPRODUCTION INTERDITE",
    "title": "FICHET 787 Z",
    "ref": "FIC787",
    "pu": 762.42
}, {
    "desc": "Radial NT+\n- Cylindre de haute sécurité européen à clé réversible Radial NT+. \n- Goupilles multidirectionnelles en acier traité et embase acier, bouclier anti-perçage en tungstène et insert en acier traité donnant une grande résistance à l’effraction par perçage.\n- Livré avec 4 clés en 32.5 x 32.5 et en 32.5 x 42.5 mm\n- Carte de propriété et panneton standard décalé et nickelé en standard. \nREPRODUCTION INTERDITE",
    "title": "RADIAL NT",
    "ref": "RADNT+",
    "pu": 304.71
}, {
    "desc": "Trident Vigie Picard\n- Serrure en applique de haute sécurité à tirage et tringles apparentes.\n- Coffre rectangulaire avec 1 demi tour réversible pour devenir poussant et 2 pênes dormants ronds.\n- Evolutive, possibilité de lui adjoindre des verrous intermédiaires et de blocages et gâche répétition à cylindre mort.\n- Livré avec 3 clés et carte de propriété.\nREPRODUCTION INTERDITE",
    "title": "VIGIE PICARD",
    "ref": "PICA01",
    "pu": 876.54
}, {
    "desc": "Super sûreté\n- Coffre en acier plié laqué vieil or.\n- Pênes en acier et fonctionnement du demi-tour à la clé.\n- Cylindre cuirassé diamètre 30 mm et pastille en acier carbonitruré.\n- Livré avec 3 clés à bille ou sans bille et carte de reproduction.",
    "title": "BRICARD BLOC SUPER SURETE",
    "ref": "BRIC01",
    "pu": 607.52
}, {
    "title": "BRICARD CYLINDRE SUPER SURETE",
    "desc": "Jeu de cylindres à bille Supersûreté\n- Jeu de cylindres pour remplacement des serrures Bricard.\n- Diamètre 30 mm avec clé inox.\n- Avec protège pompe extérieur solidaire de la serrure en laiton.\n- Livré avec 3 clés forgés avec bille en bout de clé et carte de propriété.\nREPRODUCTION INTERDITE",
    "pu": 474.3,
    "ref": "BRIC02"
}, {
    "desc": "VMC pavillonnaire pour les logements du T1 AU T7.\n- 4 piquages régulés D80mm pour sanitaires.\n- 1 piquage D125mm pour la cuisine.\n- Silencieux, LW cuisine 30dB(a).\n- Moteur 2 vitesses.\n- Livré avec cordelette de suspension.",
    "title": "VMC 4 SANITAIRES + 1 CUISINES",
    "pu": 269.86,
    "ref": "VMC001"
}, {
    "desc": "Eurosmart\nMitigeur monocommande évier.\n- Monotrou sur plage.\n- Limiteur de débit ajustable.\n- Bec tube pivotant.\n- Mousseur.\n- Flexible de raccordement souple",
    "title": "MITIGEUR EVIER",
    "pu": 296.25,
    "ref": "MIT001"
}]

},{}],13:[function(require,module,exports){
var getPrecision = function(address) {
    var precision = [];

    address.batiment && precision.push('bat. ' + address.batiment)
    address.etage && precision.push('étage ' + address.etage)
    address.code && precision.push('code ' + address.code)

    if (precision.length) {
        return '(' + precision.join(' - ') + ')';
    }
    return '';
}

module.exports = {
    sms: {
        intervention: {
            rappelNoCalls: function(id) {
                return "OS " + id + "\nAttention ! Le client attend votre appel pour confirmer le rendez-vous. Merci prendre contact avec lui immédiatement.\n Edison Services"

            },
            rappelArtisan: function() {
                return "OS {{e.id}}\n" +
                    "Bonjour M. {{e.sst.representant.nom}},\n" +
                    "nous vous rapellons que vous avez une intervention à effectuer chez {{e.client.civilite}} {{e.client.nom}} ({{e.client.address.cp}})" +
                    "aujourd'hui à {{datePlain}}\n" +
                    "Edison Services\n"

            },
            demande: function(user, config, _moment) {
                _moment = (_moment || moment);
                this.mmt = _moment(this.date.intervention);
                this.format = this.mmt.isSame(_moment(), 'day') ? "[aujourd'hui à ]HH[h]mm" : "[le ]DD[/]MM[ à ]HH[h]mm"
                this.datePlain = this.mmt.format(this.format)
                this.user = user;
                this.user.pseudo = this.user.pseudo ||  "Arnaud";
                this.ligneDirect = user.ligne ? (user.ligne.match(/.{2}|.{1,2}/g).join('.')) :  "09.72.44.16.63";
                this.categorieClean = config.categories[this.categorie].suffix + " " + config.categories[this.categorie].long_name.toLowerCase()
                return "Bonjour M. {{sst.representant.nom}} , nous cherchons a vous joindre pour une intervention {{categorieClean}}" +
                    " à faire {{datePlain}}, situé à {{client.address.cp}}, {{client.address.v}}.\n" +
                    " Pourriez-vous vous rendre disponible ?\n" +
                    "Merci de nous contacter au plus vite au 09.72.42.30.00.\n" +
                    "Merci d'avance pour votre réponse.\n" +
                    "{{user.pseudo}}\n" +
                    "Ligne Directe: {{ligneDirect}}\n" +
                    "Edison Services\n"
            },
            envoi: function(user) {
                var options = {
                    precision: getPrecision(this.client.address),
                    datePlain: moment(this.date.intervention).format("[le] DD[/]MM[ à ]HH[h]mm"),
                    login: user.pseudo || "Arnaud",
                    ligne: (user.ligne ||  "0972423000").match(/.{2}/g).join('.'),
                    remarques: this.remarqueSms ? (' (' + this.remarque + ')') : '',
                    prix: this.prixAnnonce ? this.prixAnnonce + "€ HT. " : "Pas de prix annoncé. ",
                    telClient: this.client.telephone.tel1.match(/.{2}/g).join('.')
                }
                if (this.newOs) {
                    sms = "OS {{inter.id}}\n" +
                        "Cher partenaire, merci d'interveni\n" +
                        "{{options.datePlain}}\n" +
                        "{{inter.client.civilite}} {{inter.client.prenom}} {{inter.client.nom}}\n" +
                        "{{inter.client.address.n}} {{inter.client.address.r}} {{inter.client.address.cp}}, {{inter.client.address.v}} {{options.precision}}\n" +
                        "Pour la raison suivante:\n" +
                        "{{inter.description}}{{options.remarques}}\n" +
                        "Prix: à partir de {{inter.prixAnnonce}}€ H.T\n" +
                        "Veuillez joindre le client au:\n" +
                        "09.701.702.01 (OS {{inter.id}})\n" +
                        "\n" +
                        "{{options.login}}\n" +
                        "{{options.ligne}} \n"
                } else {
                    var sms = "OS {{inter.id}}\n" +
                        "Intervention chez {{inter.client.civilite}} {{inter.client.prenom}} {{inter.client.nom}} au " +
                        "{{inter.client.address.n}} {{inter.client.address.r}} {{inter.client.address.cp}}, {{inter.client.address.v}} {{options.precision}}\n" +
                        "{{options.datePlain}}.\n" +
                        "Pour la raison suivante: {{inter.description}}{{options.remarques}}.\n" +
                        "{{options.prix}}\n" +
                        "Merci de prendre rdv avec le client au {{options.telClient}}" +
                        "\n" +
                        "Ligne directe: {{options.login}}\n" +
                        "{{options.ligne}} \n" +
                        "Edison Services."
                }
                return _.template(sms)({
                    inter: this,
                    options: options
                })
            },
            annulation: "L'intervention {{id}} chez {{client.civilite}} {{client.nom}} à {{client.address.v}} le {{datePlain}} a été annulé. \nMerci de ne pas intervenir. \nEdison Services",
        }
    },

    lettre: {
        intervention: {
            relance4: function() {
                return "<p style='margin-top: 0px;'> Affaire de recouvrement suivie par: Mr DELVAUX<br>" +
                    "Réf dossier: {{os}}<br>" +
                    "Pièce - jointe: Injonction de payer au tribunal de commerce de Paris<br>" +
                    "En copie: Monsieur le Greffier du tribunal de commerce de Paris </p>" +

                    "<div class='spacer'></div>" +
                    "<strong> LETTRE RECOMMANDEE AVEC AR </strong>" +
                    "<div class='spacer'></div>" +
                    "<strong> OBJET: Mise en demeure - Dossier d'injonction du tribunal de commerce de Paris </strong>" +
                    "<div class='spacer'></div>" +

                    "<p>A l'attention de <strong> {{facture.nom}} {{facture.prenom}} </strong>, </p>" +
                    "<p>Nous constatons avec regret qu'en dépit des trois derniers courriers de relances, vous n'avez toujours pas procédé au solde de votre facture n° {{os}}. <p>" +
                    "<p>!En conséquence, nous vous informons que nous engageons une action judiciaire à votre encontre.</p>" +
                    "<p>Ainsi, nous vous mettons en demeure par le présente lettre recommandée de nous régler la somme de {{prixFinalTTC}} euros dans un délais de huit jours à compté de la réception de ce recommandé.</p>" +
                    "<p> Nous vous rappelons que le présent courrier fait courir les intérêts légaux et conventionnels. </p>" +
                    "<p> A défaut de réception dans les délais, votre dossier sera automatiquement transmis à notre service juridique.</p>" +
                    "<p> Cordialement, </p>" +
                    "<header>" +
                    "<b> <u> Service recouvrement </u> </b>" +
                    "<p> Damien Delvaux </p>" +
                    "<p> Tél: 09.72.50.20.22 </p>" +
                    "</header>"
            },
            relance3: function() {
                "<p> Affaire de recouvrement suivie par: Mr BARRIERE <br> Ligne direct: 09.72.50.20.22 <br> Réf dossier: {{os}} </p>" +
                "<strong> LETTRE RECOMMANDEE AVEC AR </strong>" +
                "<div class='spacer'></div>" +
                "<strong> OBJET: Troisième relance pour facture impayée avant mise en demeure </strong>" +
                "<p> A l'attention de <b> {{facture.nom}} {{facture.prenom}} </b>, <br>" +

                "<p> Nous constatons que malgré nos précédentes lettres de rappel, vous n'avez toujours pas procédé au règlement de la facture <b> n° {{os}} </b>. <br> Votre compte reste débiteur à ce jour des sommes suivantes: <p>" +
                   "<table cellspacing='0' cellpadding='8'> " + 
                    "    <tr style='background: rgb(106, 168, 79); !important;'> " + 
                    "        <th style='width: 70px;'> Date </th> " + 
                    "        <th style='text-align:left'> Numéro </th> " + 
                    "        <th style='text-align:right'> Montant </th> " + 
                    "        <th style='text-align:left'> Lieu de l'intervention </th> " + 
                    "    </tr> " + 
                    "    <tr> " + 
                    "        <th> {{datePlain}} </th> " + 
                    "        <th> {{os}} </th> " + 
                    "        <th> {{client.address.v}}, {{client.address.cp}} </th> " + 
                    "        <th style='text-align:right'> {{prixFinalTTC}} € </th> " + 
                    "    </tr> " + 
                    "    <tr> " + 
                    "        <th colspan='2'> <b> TOTAL </b> </th> " + 
                    "        <th style='text-align:right'> {{prixFinalTTC}} € T.T.C. </th> " + 
                    "         <th></th> " + 
                    "     </tr>"+
                    "</table>" +


                "<p> Nous considérons aujourd'hui que vous faites opposition au règlement de la somme due. A défaut de réception de la totalité des {{prixFinalTTC}}, sous huitaine, votre dossier sera transmis à notre service contentieux. <br> " +
                "Celui-ci entamera les démarches judiciaires pour en obtenir le règlement majoré des frais de recouvrement et de ceux relatifs à l'article 700 du NCPC. <br> </p>" +

                "<p>A l'organisme qui gère notre comptabilité:</p>" +
                "<p strong center> EDISON SERVICES FRANCE<br>" +
                "Service comptabilité<br>" +
                "75 rue des dames, 75017 Paris<br>" +
                "Tél. 09.72.51.08.01 (Ouvert de 09h00 à 12h30 / 14h00 à 16h30)</p>" +

                "<p> Nous vous prions d'agréer, Madame, Monsieur, nos salutations distinguées. </p>" +
                "<header style='margin-top: 25px;'>" +
                "<b> <u> Service comptabilité </u> </b>" +
                "<p> Damien Delvaux </p>" +
                "<p> Tél: 09.72.50.20.22 </p>" +
                "</header>"
            },
            relance2: function() {
                return "<p> Réf: {{os}} <br> Pièce jointe: Facture n°{{os}} </p>" +
                    "<div class='spacer'></div>" +
                    "<strong> OBJET: Deuxième relance pour facture impayée </strong>" +
                    "<p>Madame, Monsieur, <br>" +

                    "<p> Sauf erreur de notre part, nous constatons que votre compte client présente à ce jour un solde débiteur. <br> Ce montant correspond à nos factures suivantes restées impayées: <p>" +

                   "<table cellspacing='0' cellpadding='8'> " + 
                    "    <tr style='background: rgb(106, 168, 79); !important;'> " + 
                    "        <th style='width: 70px;'> Date </th> " + 
                    "        <th style='text-align:left'> Numéro </th> " + 
                    "        <th style='text-align:right'> Montant </th> " + 
                    "        <th style='text-align:left'> Lieu de l'intervention </th> " + 
                    "    </tr> " + 
                    "    <tr> " + 
                    "        <th> {{datePlain}} </th> " + 
                    "        <th> {{os}} </th> " + 
                    "        <th> {{client.address.v}}, {{client.address.cp}} </th> " + 
                    "        <th style='text-align:right'> {{prixFinalTTC}} € </th> " + 
                    "    </tr> " + 
                    "    <tr> " + 
                    "        <th colspan='2'> <b> TOTAL </b> </th> " + 
                    "        <th style='text-align:right'> {{prixFinalTTC}} € T.T.C. </th> " + 
                    "         <th></th> " + 
                    "     </tr>"+
                    "</table>" +


                    "<p> L'échéance étant dépassée, nous vous demandons de bien vouloir régulariser cette situation par retour de courrier. </p>" +

                    "<p>A l'organisme qui gère notre comptabilité:</p>" +
                    "<p strong center> EDISON SERVICES FRANCE<br>" +
                    "Service comptabilité<br>" +
                    "75 rue des dames, 75017 Paris<br>" +
                    "Tél. 09.72.51.08.01 (Ouvert de 09h00 à 12h30 / 14h00 à 16h30)</p>" +
                    "<p>" +
                    "Pour un reglement par virement :<br>" +
                    "<br>" +
                    "RIB: 30004 01557 00010041423 30<br>" +
                    "IBAN: FR76 3000 4015 5700 0100 4142 330<br>" +
                    "BIC: BNPAFRPPPRG" +
                    "</p>" +
                    "<p> Merci d'indiquer la référence de la facture ({{os}}) dans le règlement. </p>" +
                    "<p> Nous vous prions d'agréer, Madame, Monsieur, nos salutations distinguées. </p>" +
                    "<header style='margin-top: 25px;'>" +
                    "<b> <u> Service comptabilité </u> </b>" +
                    "<p> Lionel Durand </p>" +
                    "<p> Tél: 09.72.51.08.01 </p>" +
                    "</header>"
            },
            relance1: function() { //Qlolo
                return "<strong> OBJET: Première relance pour facture n°{{os}} impayée </strong>" +
                    "<p>Madame, Monsieur, <br>" +
                    "Suite a l'intervention que nous avons réalisée en date du {{datePlain}}, <p>" +
                    "<p>A ce jour, nous <b> <u> sommes toujours dans l'attente d'un règlement de cette facture </u> </b>. <br>" +
                    "Nous vous prions de bien vouloir transmettre le règlement par chèque à l'ordre de:</p>" +
                    "<p strong center> EDISON SERVICES FRANCE</p>" +
                    "<p>A l'organisme qui gère notre comptabilité:</p>" +
                    "<p strong center> EDISON SERVICES<br>" +
                    "Service comptabilité<br>" +
                    "75 rue des dames, 75017 Paris<br>" +
                    "Tél. 09.72.51.08.01 (Ouvert de 09h00 à 12h30 / 14h00 à 16h30)</p>" +
                    "<p>" +
                    "<p>Pour un reglement par virement :</p>" +
                    "RIB: 30004 01557 00010041423 30<br>" +
                    "IBAN: FR76 3000 4015 5700 0100 4142 330<br>" +
                    "BIC: BNPAFRPPPRG" +
                    "</p>" +
                    "<p>Merci d'indiquer la réference de la facture (<strong>{{id}}</strong>) dans le réglement. </p>" +
                    "<ul>" +
                    "<li>Ci-joint la facture</li>" +
                    "</ul>" +
                    "<header>" +
                    "<b> <u> Service comptabilité </u> </b>" +
                    "<p> Tél: 09.72.51.08.01 </p>" +
                    "</header>"
            },
            envoiFacture: function() {
                return "<p>Madame, Monsieur,</p>" +
                    "<p>Suite à notre intervention le {{datePlain}} dans vos locaux:\n" +
                    "<p strong center>{{client.civilite}} {{client.nom}} {{client.prenom}}\n" +
                    "{{client.address.n}} {{client.address.r}}, {{client.address.cp}} {{client.address.v}}\n" +
                    "Tél. : {{client.telephone.tel1}}</p>" +
                    "Pour les raisons suivantes: </p>" +
                    "<p strong center>{{description}}</p>" +
                    "<p>Nous vous confirmons que l'intervention à été réalisée par nos soins.\n" +
                    "Vous trouverez ci joint la facture à regler.\n" +
                    "Nous vous prions de bien vouloir transmettre le règlement par chèque à l'ordre de:</p>" +
                    "<p strong center> S.A.R.L EDISON SERVICES</p>" +
                    "<p>A l'organisme qui gère notre comptabilité:</p>" +
                    "<p strong center> EDISON SERVICES FRANCE\n" +
                    "Service comptabilité\n" +
                    "75 rue des dames, 75017 Paris\n" +
                    "Tél. 09.72.51.08.01 (Ouvert de 09h00 à 12h30 / 14h00 à 16h30)</p>" +
                    "<p>" +
                    "Pour un reglement par virement :</p>" +
                    "<p>RIB: 30004 01557 00010041423 30\n" +
                    "IBAN: FR76 3000 4015 5700 0100 4142 330\n" +
                    "BIC: BNPAFRPPPRG" +
                    "</p>" +
                    "<p>" +
                    "Par ailleurs, si quelque raison s'opposait au règlement de la facture, nous vous remercions de nous le \nfaire savoir dans les plus brefs délais.</p>" +
                    "<p>Restant à votre entière disposition, nous vous prions de croire, Madame, Monsieur l'expression de nos sincères salutations distinguées.</p>" +
                    "<p>Merci d'indiquer la réference de la facture (<strong>{{id}}</strong>) dans le réglement. </p>" +
                    "<ul>" +
                    "<li>Ci-joint la facture</li>" +
                    "</ul>" +
                    "<p>Cordialement.</p>"
            }
        },
        artisan: {
            rappelDocuments: function() {
                return "<strong> OBJET: En attente de vos documents administratifs </strong>" +
                    "<p> Monsieur, </p>" +
                    "<p> Depuis plusieurs mois <b><u>vous intervenez régulièrement</u></b> auprès de nos clients." +
                    "<p> A chaque attestation de paiement reçu, nous vous avons transmis un <b><u>contrat de déclaration de sous-traitance</u></b> à remplir et à nous faire parvenir accompagné des documents administratifs obligatoires. </p>" +
                    "<p> Cependant, à ce jour nous sommes toujours dans l'attente de ces documents obligatoires. </p>" +
                    "<p> En effet, depuis la loi de fincance de 1er janvier 2014 concernant la sous-traitance dans le secteur du bâtiment, nous avons l'obligation de déclarer l'ensemble de nos sous-traitants intervenants chez nos clients. </p>" +
                    "<p> Merci de nous transmettre vos documents administratifs suivants: </p>" +
                    "<p>" +
                    (!this.document.kbis.ok ? "&emsp;&emsp; ☐ &emsp;&emsp; KBIS ou immatriculation <br>" : '') +
                    (!this.document.contrat.ok ? "&emsp;&emsp; ☐ &emsp;&emsp; Contrat de partenariat reçu par mail <br>" : '') +
                    (!this.document.cni.ok ? "&emsp;&emsp; ☐ &emsp;&emsp; Photocopie Recto/Verso de la pièce d'identité du gérant <br>" : '') +
                    (!this.document.assurance.ok ? "&emsp;&emsp; ☐ &emsp;&emsp; Attestation d'assurance <br>" : '') +
                    (!this.document.rib.ok ? "&emsp;&emsp; ☐ &emsp;&emsp; RIB <br>" : '') +
                    (!this.document.ursaff.ok ? "&emsp;&emsp; ☐ &emsp;&emsp; Attestation URSAFF" : '') +
                    "</p>" +
                    "<p> Veuillez envoyer vos documents à cette adresse: </p>" +
                    "<p strong center> EDISON SERVICES FRANCE<br>" +
                    "Service partenariat - Yohann Rhoum <br>" +
                    "75 rue des dames, 75017 Paris<br>" +
                    "Tél. 09.72.51.08.01 (Ouvert de 09h00 à 12h30 / 14h00 à 16h30)</p>" +

                    "<p> Nous vous prions d'agréer, monsieur, nos salutations distinguées. </p>" +
                    "<header style='margin-top: 85px;'>" +
                    "<b> Monsieur QUEUDRAY </b>" +
                    "<b> Responsable Comptable</b>" +
                    "</header>"
            },
            envoiFacturier: function() {
                return "<style> .logo { width: 7cm; margin-top: 50px; } header { margin-top: -90px; } header p { margin-bottom: 5px!important} p { line-height: 19px; margin-bottom: 20px;}</style>" +

                    "<p style='font-size: 10px; position: absolute; width: 6cm; text-align: center; top: 95px; left: 13.3cm;'>{{nomSociete}} - {{id}}</p>" +
                    "<p> Cher Monsieur {{representant.nom}} </p>" +

                    "<p> Bienvenue au sein du réseau partenaire EDISON SERVICES. </p>" +
                    "<p> Nous mettons à votre disposition un facturier et un deviseur qui vous permettra d'intervenir chez nos clients. </p>" +
                    "<p> Vous trouverez également ci-joint un manuel d'utilisation qui vous aideras à compléter les factures, devis, et attestation de T.V.A simplifié. </p>" +
                    "<p> Merci de prendre le temps de lire cette brochure attentivement. </p>" +
                    "<p> Ces documents resterons à votre disposition durant la durée de notre partenariat, mais restent la propriété intellectuelle de la société EDISON SERVICES et devront nous être renvoyé en cas de fin de partenariat. </p>" +
                    "<p> Vous en souhaitant bonne réception. </p>" +
                    "<p> <i>Bienvenue dans l'équipe EDISON SERVICES.</i> </p>" +

                    "<header style='margin-top: 35px; width: 40%; margin-left: 11cm;'>" +
                    "<b> Service Partenariat </b> <br>" +
                    "<p style='font-size: 13px; line-height: 20px;'> Monsieur RHOUM </p>" +
                    "<img style='width: 4.5cm;' src='data:image/png;base64,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'/>" +
                    "</header>"



            }
        }
    },
    mail: {
        intervention: {
            paiement: "Monsieur, <br>" +
                "Suite à votre intervention auprès de notre client, vous trouverez ci-joint l'autofacturation correspondant.<br>" +
                "Celle-ci s'accompagne automatiquement d'un virement sur votre compte bancaire.<br>" +
                "Si votre paiement n'apparaît pas sur votre compte dans les 4 jours ouvrés, merci de contacter notre service comptabilité.<br>" +
                "En cas d'erreur sur l'auto-facture, répondez à ce mail en expliquant les raisons de votre désaccord, la modification sera immédiatement effectuée par nos services.<br>" +
                "<br><i>Attention<br> depuis le 1er Janvier 2014, compte tenu de la Loi de Finances 2014, les sous-traitants n'auront ni à déclarer ni à payer la TVA due au titre de ces opérations.<br>" +
                "C'est le donneur d'ordre (SARL Edison Services) assujetti qui devra declarer la TVA sur ses déclarations de chiffre d'affaires.</i>" +
                "<br><br>Service Comptabilité Fournisseur<br>" +
                "09.72.45.27.09",
            relance3: function() {
                return "<p> Affaire de recouvrement suivie par: Mr BARRIERE <br> Ligne direct: 09.72.50.20.22 <br> Réf dossier: {{os}} </p>" +
                    "<strong> LETTRE RECOMMANDEE AVEC AR </strong>" +
                    "<div class='spacer'></div>" +
                    "<strong> OBJET: Troisième relance pour facture impayée avant mise en demeure </strong>" +
                    "<p> A l'attention de <b> {{facture.nom}} {{facture.prenom}} </b>, <br>" +

                    "<p> Nous constatons que malgré nos précédentes lettres de rappel, vous n'avez toujours pas procédé au règlement de la facture <b> n° {{os}} </b>. <br> Votre compte reste débiteur à ce jour des sommes suivantes: <p>" +

                   "<table cellspacing='0' cellpadding='8'> " + 
                    "    <tr style='background: rgb(106, 168, 79); !important;'> " + 
                    "        <th style='width: 70px;'> Date </th> " + 
                    "        <th style='text-align:left'> Numéro </th> " + 
                    "        <th style='text-align:right'> Montant </th> " + 
                    "        <th style='text-align:left'> Lieu de l'intervention </th> " + 
                    "    </tr> " + 
                    "    <tr> " + 
                    "        <th> {{datePlain}} </th> " + 
                    "        <th> {{os}} </th> " + 
                    "        <th> {{client.address.v}}, {{client.address.cp}} </th> " + 
                    "        <th style='text-align:right'> {{prixFinalTTC}} € </th> " + 
                    "    </tr> " + 
                    "    <tr> " + 
                    "        <th colspan='2'> <b> TOTAL </b> </th> " + 
                    "        <th style='text-align:right'> {{prixFinalTTC}} € T.T.C. </th> " + 
                    "         <th></th> " + 
                    "     </tr>"+
                    "</table>" +

                    "<p> Nous considérons aujourd'hui que vous faites opposition au règlement de la somme due. A défaut de réception de la totalité des {{prixFinalTTC}}, sous huitaine, votre dossier sera transmis à notre service contentieux. <br> " +
                    "Celui-ci entamera les démarches judiciaires pour en obtenir le règlement majoré des frais de recouvrement et de ceux relatifs à l'article 700 du NCPC. <br> </p>" +

                    "<p>A l'organisme qui gère notre comptabilité:</p>" +
                    "<p><center><strong>" +
                    "   EDISON SERVICES FRANCE<br>" +
                    "   Service comptabilité<br>" +
                    "   75 rue des dames, 75017 Paris<br>" +
                    "   Tél. 09.72.51.08.01 (Ouvert de 09h00 à 12h30 / 14h00 à 16h30)" +
                    "</strong></center></p>" +

                    "<p> Nous vous prions d'agréer, Madame, Monsieur, nos salutations distinguées. </p>" +
                    "<header style='margin-top: 25px;'>" +
                    "<b> <u> Service comptabilité </u> </b>" +
                    "<p> Damien Delvaux </p>" +
                    "<p> Tél: 09.72.50.20.22 </p>" +
                    "</header>"
            },
            relance2: function() {
                return "<style> table { border-collapse: collapse;}\n table, td, th {border: 1px solid black;font-size:13px;}</style>" +
                    "<p>Madame, Monsieur, <br>" +
                    "<p> Sauf erreur de notre part, nous constatons que votre compte client présente à ce jour un solde débiteur. <br> Ce montant correspond à nos factures suivantes restées impayées: <p>" + 
                   "<table cellspacing='0' cellpadding='8'> " + 
                    "    <tr style='background: rgb(106, 168, 79); !important;'> " + 
                    "        <th style='width: 70px;'> Date </th> " + 
                    "        <th style='text-align:left'> Numéro </th> " + 
                    "        <th style='text-align:right'> Montant </th> " + 
                    "        <th style='text-align:left'> Lieu de l'intervention </th> " + 
                    "    </tr> " + 
                    "    <tr> " + 
                    "        <th> {{datePlain}} </th> " + 
                    "        <th> {{os}} </th> " + 
                    "        <th> {{client.address.v}}, {{client.address.cp}} </th> " + 
                    "        <th style='text-align:right'> {{prixFinalTTC}} € </th> " + 
                    "    </tr> " + 
                    "    <tr> " + 
                    "        <th colspan='2'> <b> TOTAL </b> </th> " + 
                    "        <th style='text-align:right'> {{prixFinalTTC}} € T.T.C. </th> " + 
                    "         <th></th> " + 
                    "     </tr>"+
                    "</table>" +

                    "<p> L'échéance étant dépassée, nous vous demandons de bien vouloir régulariser cette situation par retour de courrier. </p>" +
                    "<p>A l'organisme qui gère notre comptabilité:</p>" +
                    "<p><center><strong>" +
                    "   EDISON SERVICES FRANCE<br>" +
                    "   Service comptabilité<br>" +
                    "   75 rue des dames, 75017 Paris<br>" +
                    "   Tél. 09.72.51.08.01 (Ouvert de 09h00 à 12h30 / 14h00 à 16h30)" +
                    "</strong></center></p>" +
                    "<p>" +
                    "Pour un reglement par virement :<br>" +
                    "<br>" +
                    "RIB: 30004 01557 00010041423 30<br>" +
                    "IBAN: FR76 3000 4015 5700 0100 4142 330<br>" +
                    "BIC: BNPAFRPPPRG" +
                    "</p>" +
                    "<p> Merci d'indiquer la référence de la facture ({{os}}) dans le règlement. </p>" +
                    "<p> Nous vous prions d'agréer, Madame, Monsieur, nos salutations distinguées. </p>" +
                    "<header style='margin-top: 25px;'>" +
                    "<b> <u> Service comptabilité </u> </b>" +
                    "<p> Lionel Durand </p>" +
                    "<p> Tél: 09.72.51.08.01 </p>" +
                    "</header>"
            },
            relance1: function() {
                return "<p>Madame, Monsieur,<br>" +
                    "Suite à l'intervention que nous avons réalisé en date du {{datePlain}}</p>" +
                    "<p>A ce jour, <u><b>nous sommes toujours dans l'attente du règlement de cette facture</b></u><br>" +
                    "Nous vous prions de bien vouloir transmettre le règlement par chèque à l'ordre de:</p>" +
                    "<p><strong><center> EDISON SERVICES FRANCE</strong></center></p>" +
                    "<p>A l'organisme qui gère notre comptabilité:</p>" +
                    "<p><strong><center> EDISON SERVICES<br>" +
                    "Service comptabilité<br>" +
                    "75 rue des dames, 75017 Paris<br>" +
                    "Tél. 09.72.51.08.01 (Ouvert de 09h00 à 12h30 / 14h00 à 16h30)</strong></center></p>" +
                    "<p>" +
                    "<p>Pour un reglement par virement :</p>" +
                    "<br>" +
                    "RIB: 30004 01557 00010041423 30<br>" +
                    "IBAN: FR76 3000 4015 5700 0100 4142 330<br>" +
                    "BIC: BNPAFRPPPRG" +
                    "</p>" +
                    "<p>Merci d'indiquer la réference de la facture (<strong>{{os}}</strong>) dans le réglement. </p>" +
                    "<ul>" +
                    "<li>Ci-joint la facture</li>" +
                    "</ul>" +
                    "<p>Cordialement.</p>"
            },
            factureAcquitte: function() {
                return "Bonjour,\n" +
                    "Vous trouverez ci-joint la facture acquitté de l'intervention n°{{id}}\n" +
                    "Cordialement\n" +
                    "\n" +
                    "Service Comptabilité - Edison Services\n" +
                    "Tél. 09.72.51.08.01 (Ouvert de 09h00 à 12h30 / 14h00 à 16h30)\n" +
                    "Fax. 09.72.39.33.46\n";
            },
            envoiFacture: function(datePlain) {

                return "Bonjour\n" +
                    "Suite à votre demande d'intervention le " + datePlain + " chez:\n" +
                    "<strong>\n" +
                    "{{client.nom}} {{client.prenom}}\n" +
                    "{{client.address.n}} {{client.address.r}}\n" +
                    "{{client.address.cp}} {{client.address.v}}\n" +
                    "</strong>" +
                    "\n" +
                    "Veuillez trouvez ci-joint notre facture d'intervention\n" +
                    "Merci de transmettre le règlement directement à notre organisme de facturation.\n" +
                    "\n" +
                    "D'avance merci pour votre rapidité\n" +
                    "Cordialement,\n" +
                    "\n" +
                    "Service Comptabilité - Edison Services\n" +
                    "Tél. 09.72.51.08.01 (Ouvert de 09h00 à 12h30 / 14h00 à 16h30)\n" +
                    "Fax. 09.72.39.33.46\n";
            },
            os: function(user) {
                return "A l'attention de l’entreprise {{sst.nomSociete}}\n" +
                    "\n" +
                    "Monsieur <strong>{{sst.representant.nom}}</strong>,\n" +
                    "Suite à notre conversation téléphonique,\n" +
                    "Nous vous prions de bien vouloir intervenir pour une intervention de {{categoriePlain}} auprès de notre client :\n" +
                    "\n" +
                    "<strong>" +
                    "OS n°{{id}}\n" +
                    "{{client.nom}} {{client.prenom}}\n" +
                    "Tél. {{newOs ? '09.701.702.01' : client.telephone.tel1}}\n" +
                    "{{client.address.n}} {{client.address.r}}\n" +
                    "{{client.address.cp}} {{client.address.v}}\n" +
                    "</strong>" +
                    '\n' +
                    "L' intervention a été prévu pour le : <strong>{{datePlain}}</strong> \n" +
                    '\n' +
                    "Vous devez dès réception de cet ordre de service, prendre contact <strong><u>immédiatement</u></strong> avec le client afin de confirmer la date et l'horaire de l’intervention.\n" +
                    "\n" +
                    "Les coordonnées et la description de l'intervention sont détaillées dans l'ordre de service que vous trouverez en pièce jointe. \n" +
                    "<center>" +
                    "<% if (typeof devisOrigine !== 'undefined' && !fileSupp) {%> \n<strong>Vous trouverez également le devis accepté et signé par notre client</strong> <%}%>" +
                    "<% if (typeof devisOrigine === 'undefined' && fileSupp) {%> \n<strong>Vous trouverez également {{textfileSupp}} à votre disposition</strong> <%}%>" +
                    "<% if (typeof devisOrigine !== 'undefined' && fileSupp) {%> \n<strong>Vous trouverez également le devis accepté et signé par notre client, et {{textfileSupp}}</strong> <%}%>" +
                    "</center>" +
                    "\n" +
                    "<strong>" +
                    "Vous trouverez ci-joint :\n" +
                    "</strong>" +
                    " • Ordre de service d’intervention n°{{id}}\n" +
                    " • Un devis et une facture vierge à remplir obligatoirement sur place\n" +
                    " • Manuel à suivre pour la réalisation des devis et factures\n" +
                    " • Une description étape par étape de notre mode de fonctionnement\n" +
                    "<strong>" +
                    "<% if (typeof devisOrigine !== 'undefined') {%> • Le devis n°{{devisOrigine}} accepté\n <%}%>" +
                    "<% if (fileSupp) {%> • {{textfileSupp}} <%}%>\n" +
                    "</strong>" +
                    "\n" +
                    "<strong>Pour tous renseignements supplémentaires, vous pouvez joindre " + (user.pseudo ||  "Arnaud") +
                    " au " +
                    (user.ligne ? (user.ligne.match(/.{2}|.{1,2}/g).join('.')) :  "09.72.42.30.00") + "</strong>\n" +
                    "\n" +
                    "L’équipe <strong>Edison Services</strong>\n"
            }
        },
        devis: {
            envoi: function(user, _config, __, _moment) {
                var lodash = __ || _
                var mmt = _moment || moment
                var config = _config ||  require('./dataList.js')
                var categorieClean = config.categories[this.categorie].suffix + " " + config.categories[this.categorie].long_name.toLowerCase()
                var pseudo = user.pseudo
                var intro;
                if (this.client.civilite === "Soc.") {
                    intro = lodash.template("À l'intention du responsable de la société {{client.nom}},\n\n")(this);
                } else {
                    intro = lodash.template("{{client.civilite}} {{client.nom}},\n\n")(this);
                }
                var start = "Suite à notre conversation téléphonique de tout à l'heure, ";
                var end = "Avez-vous reçu le devis ?\n\n" +
                    "Je n'ai pas eu de retour de votre part, devons nous planifier une intervention ?\n\n" +
                    "Merci de revenir vers moi pour me tenir au courant de la suite que vous donnerez à ce devis.\n\n" +
                    "Je reste à votre disposition pour toutes les demandes de renseignement\n\n";
                if (this.combo && this.comboText) {
                    var text = "Suite à notre dernier échange téléphonique concernant la réalisation d'un " + this.comboText + ".\n" +
                        "\n" +
                        "Vous trouverez ci-joint <strong>le devis n°" + this.id + " </strong>qui correspond à ce que nous avons vu ensemble.\n" +
                        "\n" +
                        "Je vous rappel que les délais d'interventions dépendent également de votre rapidement de réponse.\n" +
                        "Sachez également que votre installation sera éligible à notre assurance RC PRO et notre assurance décennale.\n" +
                        "Lors de l'acceptation, je vous prie de me renvoyer signé, accompagné de la mention : \n" +
                        "\n" +
                        "<strong> « BON POUR ACCORD » </strong>\n" +
                        "\n" +
                        "Je reste à votre entière disposition pour tous les renseignements ou les remarques que vous pourriez avoir concernant ce devis (technique, délais, prix).\n"

                } else if (this.historique && this.historique.length === 1) {
                    var cont;
                    if (this.categorie == 'VT')
                        cont = "je vous ai envoyé le devis que vous m'avez demandé pour le remplacement de votre vitrage, vous deviez le transmettre directement à votre compagnie d'assurance.\n\n";
                    else if (this.categorie == 'AS')
                        cont = "je vous ai transmis comme convenue le devis de remplacement de votre ballon d'eau chaude sanitaire.\n\n";
                    else
                        cont = "je vous ai transmis comme convenue le devis " + categorieClean + " que vous avez souhaité.\n\n";
                    var text = start + cont + end;

                } else if (this.historique && this.historique.length > 1) {
                    var text = "je vous ai transmis un devis " + categorieClean + " en date du " + mmt(this.historique[0].date).format('L') + ".\n\n" + end;
                } else if (this.categorie == 'VT') {
                    var text = "Suite à notre échange téléphonique concernant le remplacement de votre vitrage," +
                        "vous trouverez ci-joint le devis n°" + this.id + " correspondant à ce que nous avons vu ensemble.\n\n" +
                        "Merci de bien vouloir transmettre ce devis de remplacement de vitrage directement à votre compagnie d’assurance, afin d'obtenir leurs accords (si nécessaire).\n" +
                        "Merci de nous renvoyer le devis signé accompagné de la mention « BON POUR ACCORD » par mail.\n\n" +
                        "Nous interviendrons dans les plus brefs délais.\n\n" +
                        "Je reste à votre entière disposition pour toutes les demandes de renseignement et les remarques que vous pourriez avoir.\n\n";
                } else if (lodash.find(this.produits, function(e) {
                        return lodash.startsWith(e.ref, "BAL");
                    })) {
                    var text = "Suite à notre échange téléphonique concernant le remplacement de votre ballon d'eau chaude sanitaire," +
                        "vous trouverez ci-joint le devis n°" + this.id + ".\n\n" +
                        "Je reste à votre entière disposition pour tous renseignements complémentaires ou remarques que vous pourriez avoir (technique/prix).\n\n" +
                        "Sachez également, que votre installation sera éligible à notre assurance RC PRO et notre assurance décennale.\n" +
                        "Dès votre accord, nous interviendrons rapidement.\n\n" +
                        "Meilleures salutations,\n\n";
                } else {
                    var text = "Suite à notre dernier échange concernant la réalisation d'un devis " + categorieClean + ", \n" +
                        "vous trouverez ci-joint le devis n°" + this.id + " correspondant à ce que nous avons vu ensemble. \n\n" +
                        "Sachez également, que votre installation sera éligible à notre assurance RC PRO et notre assurance décennale.\n\n" +
                        "Lors de l'acceptation, je vous prie de me renvoyer le devis signé, accompagné de la mention:\n\n" +
                        "<strong> « BON POUR ACCORD » </strong>\n\n" +
                        "Je reste à votre entière disposition pour tous les renseignements ou les remarques que vous pourriez avoir concernant ce devis (technique, délais, prix). \n\n" +
                        "Merci de me tenir au courant de la suite que vous donnerez à ce devis. \n\n";

                }
                var outro = "Cordialement, \n\n" +
                    (user.pseudo ||  "Arnaud,") + '\n' +
                    "<strong>Ligne Directe : " + (user.ligne ? (user.ligne.match(/.{2}|.{1,2}/g).join('.')) :  "09.72.42.30.00") + "</strong>\n" +
                    "<strong>Ligne Atelier : " + "09.72.42.30.00" + "</strong>\n";

                return intro + text + outro;
            }
        },
        artisan: {
            envoiContrat: function(user) {
                return "Monsieur {{representant.nom}},\n" +
                    "\n" +
                    "Comme expliqué lors de notre conversation téléphonique, nous sommes une entreprise générale du bâtiment situé dans la région d'île de France.\n" +
                    "\n" +
                    "Notre entreprise intervient de manière régulière dans plusieurs villes en France pour des interventions de dépannage spécialisé dans le second œuvre (plomberie sanitaire, génie climatique, serrurerie, vitrerie et l'électricité générale).\n" +
                    "\n" +
                    "Nos clients sont des particuliers, des réseaux d'entreprises, des commerces, des administrateurs de bien et des agences immobilières.\n" +
                    "\n" +
                    "Je suis actuellement à la <u><b>recherche d'un partenaire</b></u> pouvant intervenir auprès de nos clients dans votre région pour des prestations de dépannage.\n" +
                    "Vous trouverez ci-joint une brochure expliquant notre fonctionnement pour une éventuelle collaboration.\n" +
                    "Je vous transmets également un contrat de partenariat permettant d'établir les conditions de travail entre nos deux entreprises.\n" +
                    "\n" +
                    "Pour chaque intervention, vous recevez au préalable un ordre de service par mail et par téléphone,<u><b> l'ordre de service n'est validé que sous votre accord.</b></u>\n" +
                    "\n" +
                    "Une fois chez notre client, vous restez totalement autonome sur le montant à facturer et si nécessaire vous pouvez ajuster le montant de la prestation tout en ayant préalablement prévenu notre client.\n" +
                    "\n" +
                    "Lors des interventions, vous représentez notre entreprise c'est pourquoi vous disposez des documents fournis à tous nos partenaires en France.\n" +
                    "\n" +
                    "<u><b>Vous avez à votre disposition :</u></b>\n" +
                    "\n" +
                    "• Un bloc facturier au nom de Edison Services\n" +
                    "• Un bloc devis au nom de Edison Services\n" +
                    "• Un catalogue de prix de vente du matériel\n" +
                    "• Un accès à tous nos fournisseurs\n" +
                    "\n" +
                    "Si vous souhaitez rejoindre notre réseau, vous trouverez les documents à nous transmettre :\n" +
                    "\n" +
                    "• Le contrat de partenariat signé\n" +
                    "• Immatriculation ou KBIS\n" +
                    "• Pièce d'identité du responsable de l'entreprise\n" +
                    "• Attestation d'assurance (si disponible)\n" +
                    "\n" +
                    "Je tiens à vous rappelez que cette future collaboration ne vous oblige jamais à intervenir pour nous. Il s'agit simplement de rajouter à votre quotidien des interventions en plus.\n" +
                    "\n" +
                    "Cependant, j'attire votre attention sur le fait que nous recherchons des personnes de confiances, maîtrisant parfaitement l'aspect technique du travail à effectuer tout en sachant être à l'aise avec la clientèle.\n" +
                    "\n" +
                    "Je reste à votre entière disposition pour toutes les questions ou les remarques que vous pourriez avoir.\n" +
                    "\n" +
                    "En vous remerciant d'avance pour l'attention que vous porterez à ma demande et aux documents transmis.\n" +
                    "\n" +
                    "Dans l'attente d'un retour de votre part.\n" +
                    "\n" +
                    "PS : Si vous souhaitez faire un test avant de travailler régulièrement avec notre entreprise et dans le but de comprendre le fonctionnement global de notre structure, n'hésitez pas à nous le faire savoir.\n" +
                    "\n" +
                    "Cordialement\n" +
                    "\n" +
                    "<b>Yohann RHOUM</b>\n" +
                    "Service partenariat\n" +
                    "Port : 06.37.37.59.45 Fax : 09.72.39.33.46\n" +
                    "yohann.rhoum@edison-services.fr\n" +
                    "\n" +
                    "<b>Edison Services</b>\n" +
                    "Dépannage - Entretien - Installation - Rénovation\n" +
                    "Siège social : 75, rue des dames - 75017 Paris\n" +
                    "contact@edison-services.fr - www.edison-services.fr"
            },
            rappelContrat: function(user) {
                return "Bonjour Monsieur {{representant.nom}}\n" +
                    "\n" +
                    "Suite à notre conversation téléphonique du {{datePlain}} concernant la signature d'un contrat de partenariat entre nos deux entreprises.\n" +
                    "\n" +
                    "Vous trouverez donc ci-joint la déclaration de sous-traitance à remplir.\n" +
                    "\n" +
                    "Merci de joindre également à cette déclaration les éléments suivants :\n" +
                    "\n" +
                    "• Extrait KBIS ou INSEE\n" +
                    "• Photocopie R/V de la pièce d'identité du gérant\n" +
                    "\n" +
                    "Vous pouvez nous transmettre ces pièces administratives par mail à :\n" +
                    "\n" +
                    "yohann.rhoum@edison-services.fr\n" +
                    "\n" +
                    "\n" +
                    "Ou par voie postal :\n" +
                    "\n" +
                    "<u><b>" +
                    "Edison Services\n" +
                    "Service Partenariat\n" +
                    "75 rue des dames - 75017 PARIS\n" +
                    "</b></u>" +
                    "\n" +
                    "\n" +
                    "Dès réception de ces documents et validation par nos services, vous recevrez par voie postal:\n" +
                    "\n" +
                    "• Un bloc facture Edison Services\n" +
                    "• Un bloc devis Edison Services\n" +
                    "• Un catalogue de prix de vente du matériel\n" +
                    "• Un accès à tous nos fournisseurs\n" +
                    "Je reste à votre entière disposition pour toutes les questions ou les remarques que vous pourriez avoir.\n" +
                    "\n" +
                    "Dans l'attente d'une réponse favorable de votre part,\n" +
                    "\n" +
                    "Cordialement\n" +
                    "\n" +
                    "<b>Yohann RHOUM</b>\n" +
                    "Service Partenariat\n" +
                    "Port : 06.37.37.59.45 Fax : 09.72.39.33.46\n" +
                    "yohann.rhoum@edison-services.fr\n" +
                    "\n" +
                    "<b>Edison Services</b>\n" +
                    "Dépannage - Entretien - Installation - Rénovation\n" +
                    "Siège social : 75 rue des Dames, 75017, Paris\n" +
                    "contact@edison-services.fr - www.edison-services.fr\n"
            },
            dossierComplet: function() {
                return "Monsieur <b>{{representant.nom}}</b>,\n" +
                    "\n" +
                    "Nous avons le plaisir de vous annoncer que vous êtes dès à présent <b>membre du réseau partenaire Edison Services.</b>\n" +
                    "\n" +
                    "Le service partenariat a validé votre dossier.\n" +
                    "\n" +
                    "Vous allez recevoir très prochainement les pièces administratives vous permettant d'intervenir directement auprès de nos clients.\n" +
                    "\n" +
                    "Ces documents seront transmis par voie postale à cette adresse :\n" +
                    "<p strong center>" +
                    "Monsieur {{representant.nom}},\n" +
                    "{{address.n}} {{address.r}}\n" +
                    "{{address.cp}} {{address.v}}</b>\n" +
                    "</p>" +
                    "Nous pouvons désormais vous proposez d'intervenir auprès de nos clients dans les domaines suivants :\n" +
                    "<p strong center>électricité - plomberie - chauffage - climatisation - serrurerie</p>" +
                    "Vous trouverez ci-joint, votre fiche d'identification récapitulative.\n" +
                    "\n" +
                    "Le service intervention de notre société devrait faire appel à vous dans les plus brefs délais.\n" +
                    "Cordialement,\n" +
                    "\n" +
                    "Yohann RHOUM\n" +
                    "Service partenariat\n" +
                    "Port : 06.45.57.87.66 Fax : 09.72.39.33.46\n" +
                    "yohann.rhoum@edison-services.fr\n" +
                    "\n" +
                    "Edison Services\n" +
                    "Dépannage - Entretien - Installation - Rénovation\n" +
                    "Siège social : 75, rue des dames - 75010 Paris\n" +
                    "contact@edison-services.fr - www.edison-services.fr\n"
            }
        }
    },

};

},{"./dataList.js":8}],14:[function(require,module,exports){
/**
 * Gets the last element of `array`.
 *
 * @static
 * @memberOf _
 * @category Array
 * @param {Array} array The array to query.
 * @returns {*} Returns the last element of `array`.
 * @example
 *
 * _.last([1, 2, 3]);
 * // => 3
 */
function last(array) {
  var length = array ? array.length : 0;
  return length ? array[length - 1] : undefined;
}

module.exports = last;

},{}],15:[function(require,module,exports){
module.exports = require('./forEach');

},{"./forEach":17}],16:[function(require,module,exports){
var baseEach = require('../internal/baseEach'),
    createFind = require('../internal/createFind');

/**
 * Iterates over elements of `collection`, returning the first element
 * `predicate` returns truthy for. The predicate is bound to `thisArg` and
 * invoked with three arguments: (value, index|key, collection).
 *
 * If a property name is provided for `predicate` the created `_.property`
 * style callback returns the property value of the given element.
 *
 * If a value is also provided for `thisArg` the created `_.matchesProperty`
 * style callback returns `true` for elements that have a matching property
 * value, else `false`.
 *
 * If an object is provided for `predicate` the created `_.matches` style
 * callback returns `true` for elements that have the properties of the given
 * object, else `false`.
 *
 * @static
 * @memberOf _
 * @alias detect
 * @category Collection
 * @param {Array|Object|string} collection The collection to search.
 * @param {Function|Object|string} [predicate=_.identity] The function invoked
 *  per iteration.
 * @param {*} [thisArg] The `this` binding of `predicate`.
 * @returns {*} Returns the matched element, else `undefined`.
 * @example
 *
 * var users = [
 *   { 'user': 'barney',  'age': 36, 'active': true },
 *   { 'user': 'fred',    'age': 40, 'active': false },
 *   { 'user': 'pebbles', 'age': 1,  'active': true }
 * ];
 *
 * _.result(_.find(users, function(chr) {
 *   return chr.age < 40;
 * }), 'user');
 * // => 'barney'
 *
 * // using the `_.matches` callback shorthand
 * _.result(_.find(users, { 'age': 1, 'active': true }), 'user');
 * // => 'pebbles'
 *
 * // using the `_.matchesProperty` callback shorthand
 * _.result(_.find(users, 'active', false), 'user');
 * // => 'fred'
 *
 * // using the `_.property` callback shorthand
 * _.result(_.find(users, 'active'), 'user');
 * // => 'barney'
 */
var find = createFind(baseEach);

module.exports = find;

},{"../internal/baseEach":31,"../internal/createFind":55}],17:[function(require,module,exports){
var arrayEach = require('../internal/arrayEach'),
    baseEach = require('../internal/baseEach'),
    createForEach = require('../internal/createForEach');

/**
 * Iterates over elements of `collection` invoking `iteratee` for each element.
 * The `iteratee` is bound to `thisArg` and invoked with three arguments:
 * (value, index|key, collection). Iteratee functions may exit iteration early
 * by explicitly returning `false`.
 *
 * **Note:** As with other "Collections" methods, objects with a "length" property
 * are iterated like arrays. To avoid this behavior `_.forIn` or `_.forOwn`
 * may be used for object iteration.
 *
 * @static
 * @memberOf _
 * @alias each
 * @category Collection
 * @param {Array|Object|string} collection The collection to iterate over.
 * @param {Function} [iteratee=_.identity] The function invoked per iteration.
 * @param {*} [thisArg] The `this` binding of `iteratee`.
 * @returns {Array|Object|string} Returns `collection`.
 * @example
 *
 * _([1, 2]).forEach(function(n) {
 *   console.log(n);
 * }).value();
 * // => logs each value from left to right and returns the array
 *
 * _.forEach({ 'a': 1, 'b': 2 }, function(n, key) {
 *   console.log(n, key);
 * });
 * // => logs each value-key pair and returns the object (iteration order is not guaranteed)
 */
var forEach = createForEach(arrayEach, baseEach);

module.exports = forEach;

},{"../internal/arrayEach":23,"../internal/baseEach":31,"../internal/createForEach":56}],18:[function(require,module,exports){
var baseIndexOf = require('../internal/baseIndexOf'),
    getLength = require('../internal/getLength'),
    isArray = require('../lang/isArray'),
    isIterateeCall = require('../internal/isIterateeCall'),
    isLength = require('../internal/isLength'),
    isString = require('../lang/isString'),
    values = require('../object/values');

/* Native method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max;

/**
 * Checks if `target` is in `collection` using
 * [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
 * for equality comparisons. If `fromIndex` is negative, it's used as the offset
 * from the end of `collection`.
 *
 * @static
 * @memberOf _
 * @alias contains, include
 * @category Collection
 * @param {Array|Object|string} collection The collection to search.
 * @param {*} target The value to search for.
 * @param {number} [fromIndex=0] The index to search from.
 * @param- {Object} [guard] Enables use as a callback for functions like `_.reduce`.
 * @returns {boolean} Returns `true` if a matching element is found, else `false`.
 * @example
 *
 * _.includes([1, 2, 3], 1);
 * // => true
 *
 * _.includes([1, 2, 3], 1, 2);
 * // => false
 *
 * _.includes({ 'user': 'fred', 'age': 40 }, 'fred');
 * // => true
 *
 * _.includes('pebbles', 'eb');
 * // => true
 */
function includes(collection, target, fromIndex, guard) {
  var length = collection ? getLength(collection) : 0;
  if (!isLength(length)) {
    collection = values(collection);
    length = collection.length;
  }
  if (typeof fromIndex != 'number' || (guard && isIterateeCall(target, fromIndex, guard))) {
    fromIndex = 0;
  } else {
    fromIndex = fromIndex < 0 ? nativeMax(length + fromIndex, 0) : (fromIndex || 0);
  }
  return (typeof collection == 'string' || !isArray(collection) && isString(collection))
    ? (fromIndex <= length && collection.indexOf(target, fromIndex) > -1)
    : (!!length && baseIndexOf(collection, target, fromIndex) > -1);
}

module.exports = includes;

},{"../internal/baseIndexOf":37,"../internal/getLength":61,"../internal/isIterateeCall":70,"../internal/isLength":72,"../lang/isArray":80,"../lang/isString":84,"../object/values":91}],19:[function(require,module,exports){
var arrayMap = require('../internal/arrayMap'),
    baseCallback = require('../internal/baseCallback'),
    baseMap = require('../internal/baseMap'),
    isArray = require('../lang/isArray');

/**
 * Creates an array of values by running each element in `collection` through
 * `iteratee`. The `iteratee` is bound to `thisArg` and invoked with three
 * arguments: (value, index|key, collection).
 *
 * If a property name is provided for `iteratee` the created `_.property`
 * style callback returns the property value of the given element.
 *
 * If a value is also provided for `thisArg` the created `_.matchesProperty`
 * style callback returns `true` for elements that have a matching property
 * value, else `false`.
 *
 * If an object is provided for `iteratee` the created `_.matches` style
 * callback returns `true` for elements that have the properties of the given
 * object, else `false`.
 *
 * Many lodash methods are guarded to work as iteratees for methods like
 * `_.every`, `_.filter`, `_.map`, `_.mapValues`, `_.reject`, and `_.some`.
 *
 * The guarded methods are:
 * `ary`, `callback`, `chunk`, `clone`, `create`, `curry`, `curryRight`,
 * `drop`, `dropRight`, `every`, `fill`, `flatten`, `invert`, `max`, `min`,
 * `parseInt`, `slice`, `sortBy`, `take`, `takeRight`, `template`, `trim`,
 * `trimLeft`, `trimRight`, `trunc`, `random`, `range`, `sample`, `some`,
 * `sum`, `uniq`, and `words`
 *
 * @static
 * @memberOf _
 * @alias collect
 * @category Collection
 * @param {Array|Object|string} collection The collection to iterate over.
 * @param {Function|Object|string} [iteratee=_.identity] The function invoked
 *  per iteration.
 * @param {*} [thisArg] The `this` binding of `iteratee`.
 * @returns {Array} Returns the new mapped array.
 * @example
 *
 * function timesThree(n) {
 *   return n * 3;
 * }
 *
 * _.map([1, 2], timesThree);
 * // => [3, 6]
 *
 * _.map({ 'a': 1, 'b': 2 }, timesThree);
 * // => [3, 6] (iteration order is not guaranteed)
 *
 * var users = [
 *   { 'user': 'barney' },
 *   { 'user': 'fred' }
 * ];
 *
 * // using the `_.property` callback shorthand
 * _.map(users, 'user');
 * // => ['barney', 'fred']
 */
function map(collection, iteratee, thisArg) {
  var func = isArray(collection) ? arrayMap : baseMap;
  iteratee = baseCallback(iteratee, thisArg, 3);
  return func(collection, iteratee);
}

module.exports = map;

},{"../internal/arrayMap":24,"../internal/baseCallback":27,"../internal/baseMap":41,"../lang/isArray":80}],20:[function(require,module,exports){
var baseCallback = require('../internal/baseCallback'),
    baseMap = require('../internal/baseMap'),
    baseSortBy = require('../internal/baseSortBy'),
    compareAscending = require('../internal/compareAscending'),
    isIterateeCall = require('../internal/isIterateeCall');

/**
 * Creates an array of elements, sorted in ascending order by the results of
 * running each element in a collection through `iteratee`. This method performs
 * a stable sort, that is, it preserves the original sort order of equal elements.
 * The `iteratee` is bound to `thisArg` and invoked with three arguments:
 * (value, index|key, collection).
 *
 * If a property name is provided for `iteratee` the created `_.property`
 * style callback returns the property value of the given element.
 *
 * If a value is also provided for `thisArg` the created `_.matchesProperty`
 * style callback returns `true` for elements that have a matching property
 * value, else `false`.
 *
 * If an object is provided for `iteratee` the created `_.matches` style
 * callback returns `true` for elements that have the properties of the given
 * object, else `false`.
 *
 * @static
 * @memberOf _
 * @category Collection
 * @param {Array|Object|string} collection The collection to iterate over.
 * @param {Function|Object|string} [iteratee=_.identity] The function invoked
 *  per iteration.
 * @param {*} [thisArg] The `this` binding of `iteratee`.
 * @returns {Array} Returns the new sorted array.
 * @example
 *
 * _.sortBy([1, 2, 3], function(n) {
 *   return Math.sin(n);
 * });
 * // => [3, 1, 2]
 *
 * _.sortBy([1, 2, 3], function(n) {
 *   return this.sin(n);
 * }, Math);
 * // => [3, 1, 2]
 *
 * var users = [
 *   { 'user': 'fred' },
 *   { 'user': 'pebbles' },
 *   { 'user': 'barney' }
 * ];
 *
 * // using the `_.property` callback shorthand
 * _.pluck(_.sortBy(users, 'user'), 'user');
 * // => ['barney', 'fred', 'pebbles']
 */
function sortBy(collection, iteratee, thisArg) {
  if (collection == null) {
    return [];
  }
  if (thisArg && isIterateeCall(collection, iteratee, thisArg)) {
    iteratee = undefined;
  }
  var index = -1;
  iteratee = baseCallback(iteratee, thisArg, 3);

  var result = baseMap(collection, function(value, key, collection) {
    return { 'criteria': iteratee(value, key, collection), 'index': ++index, 'value': value };
  });
  return baseSortBy(result, compareAscending);
}

module.exports = sortBy;

},{"../internal/baseCallback":27,"../internal/baseMap":41,"../internal/baseSortBy":47,"../internal/compareAscending":52,"../internal/isIterateeCall":70}],21:[function(require,module,exports){
(function (global){
/**
 * @license
 * lodash 3.10.1 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern -d -o ./index.js`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */
;(function() {

  /** Used as a safe reference for `undefined` in pre-ES5 environments. */
  var undefined;

  /** Used as the semantic version number. */
  var VERSION = '3.10.1';

  /** Used to compose bitmasks for wrapper metadata. */
  var BIND_FLAG = 1,
      BIND_KEY_FLAG = 2,
      CURRY_BOUND_FLAG = 4,
      CURRY_FLAG = 8,
      CURRY_RIGHT_FLAG = 16,
      PARTIAL_FLAG = 32,
      PARTIAL_RIGHT_FLAG = 64,
      ARY_FLAG = 128,
      REARG_FLAG = 256;

  /** Used as default options for `_.trunc`. */
  var DEFAULT_TRUNC_LENGTH = 30,
      DEFAULT_TRUNC_OMISSION = '...';

  /** Used to detect when a function becomes hot. */
  var HOT_COUNT = 150,
      HOT_SPAN = 16;

  /** Used as the size to enable large array optimizations. */
  var LARGE_ARRAY_SIZE = 200;

  /** Used to indicate the type of lazy iteratees. */
  var LAZY_FILTER_FLAG = 1,
      LAZY_MAP_FLAG = 2;

  /** Used as the `TypeError` message for "Functions" methods. */
  var FUNC_ERROR_TEXT = 'Expected a function';

  /** Used as the internal argument placeholder. */
  var PLACEHOLDER = '__lodash_placeholder__';

  /** `Object#toString` result references. */
  var argsTag = '[object Arguments]',
      arrayTag = '[object Array]',
      boolTag = '[object Boolean]',
      dateTag = '[object Date]',
      errorTag = '[object Error]',
      funcTag = '[object Function]',
      mapTag = '[object Map]',
      numberTag = '[object Number]',
      objectTag = '[object Object]',
      regexpTag = '[object RegExp]',
      setTag = '[object Set]',
      stringTag = '[object String]',
      weakMapTag = '[object WeakMap]';

  var arrayBufferTag = '[object ArrayBuffer]',
      float32Tag = '[object Float32Array]',
      float64Tag = '[object Float64Array]',
      int8Tag = '[object Int8Array]',
      int16Tag = '[object Int16Array]',
      int32Tag = '[object Int32Array]',
      uint8Tag = '[object Uint8Array]',
      uint8ClampedTag = '[object Uint8ClampedArray]',
      uint16Tag = '[object Uint16Array]',
      uint32Tag = '[object Uint32Array]';

  /** Used to match empty string literals in compiled template source. */
  var reEmptyStringLeading = /\b__p \+= '';/g,
      reEmptyStringMiddle = /\b(__p \+=) '' \+/g,
      reEmptyStringTrailing = /(__e\(.*?\)|\b__t\)) \+\n'';/g;

  /** Used to match HTML entities and HTML characters. */
  var reEscapedHtml = /&(?:amp|lt|gt|quot|#39|#96);/g,
      reUnescapedHtml = /[&<>"'`]/g,
      reHasEscapedHtml = RegExp(reEscapedHtml.source),
      reHasUnescapedHtml = RegExp(reUnescapedHtml.source);

  /** Used to match template delimiters. */
  var reEscape = /<%-([\s\S]+?)%>/g,
      reEvaluate = /<%([\s\S]+?)%>/g,
      reInterpolate = /<%=([\s\S]+?)%>/g;

  /** Used to match property names within property paths. */
  var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\n\\]|\\.)*?\1)\]/,
      reIsPlainProp = /^\w*$/,
      rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\n\\]|\\.)*?)\2)\]/g;

  /**
   * Used to match `RegExp` [syntax characters](http://ecma-international.org/ecma-262/6.0/#sec-patterns)
   * and those outlined by [`EscapeRegExpPattern`](http://ecma-international.org/ecma-262/6.0/#sec-escaperegexppattern).
   */
  var reRegExpChars = /^[:!,]|[\\^$.*+?()[\]{}|\/]|(^[0-9a-fA-Fnrtuvx])|([\n\r\u2028\u2029])/g,
      reHasRegExpChars = RegExp(reRegExpChars.source);

  /** Used to match [combining diacritical marks](https://en.wikipedia.org/wiki/Combining_Diacritical_Marks). */
  var reComboMark = /[\u0300-\u036f\ufe20-\ufe23]/g;

  /** Used to match backslashes in property paths. */
  var reEscapeChar = /\\(\\)?/g;

  /** Used to match [ES template delimiters](http://ecma-international.org/ecma-262/6.0/#sec-template-literal-lexical-components). */
  var reEsTemplate = /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g;

  /** Used to match `RegExp` flags from their coerced string values. */
  var reFlags = /\w*$/;

  /** Used to detect hexadecimal string values. */
  var reHasHexPrefix = /^0[xX]/;

  /** Used to detect host constructors (Safari > 5). */
  var reIsHostCtor = /^\[object .+?Constructor\]$/;

  /** Used to detect unsigned integer values. */
  var reIsUint = /^\d+$/;

  /** Used to match latin-1 supplementary letters (excluding mathematical operators). */
  var reLatin1 = /[\xc0-\xd6\xd8-\xde\xdf-\xf6\xf8-\xff]/g;

  /** Used to ensure capturing order of template delimiters. */
  var reNoMatch = /($^)/;

  /** Used to match unescaped characters in compiled string literals. */
  var reUnescapedString = /['\n\r\u2028\u2029\\]/g;

  /** Used to match words to create compound words. */
  var reWords = (function() {
    var upper = '[A-Z\\xc0-\\xd6\\xd8-\\xde]',
        lower = '[a-z\\xdf-\\xf6\\xf8-\\xff]+';

    return RegExp(upper + '+(?=' + upper + lower + ')|' + upper + '?' + lower + '|' + upper + '+|[0-9]+', 'g');
  }());

  /** Used to assign default `context` object properties. */
  var contextProps = [
    'Array', 'ArrayBuffer', 'Date', 'Error', 'Float32Array', 'Float64Array',
    'Function', 'Int8Array', 'Int16Array', 'Int32Array', 'Math', 'Number',
    'Object', 'RegExp', 'Set', 'String', '_', 'clearTimeout', 'isFinite',
    'parseFloat', 'parseInt', 'setTimeout', 'TypeError', 'Uint8Array',
    'Uint8ClampedArray', 'Uint16Array', 'Uint32Array', 'WeakMap'
  ];

  /** Used to make template sourceURLs easier to identify. */
  var templateCounter = -1;

  /** Used to identify `toStringTag` values of typed arrays. */
  var typedArrayTags = {};
  typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
  typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
  typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
  typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
  typedArrayTags[uint32Tag] = true;
  typedArrayTags[argsTag] = typedArrayTags[arrayTag] =
  typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
  typedArrayTags[dateTag] = typedArrayTags[errorTag] =
  typedArrayTags[funcTag] = typedArrayTags[mapTag] =
  typedArrayTags[numberTag] = typedArrayTags[objectTag] =
  typedArrayTags[regexpTag] = typedArrayTags[setTag] =
  typedArrayTags[stringTag] = typedArrayTags[weakMapTag] = false;

  /** Used to identify `toStringTag` values supported by `_.clone`. */
  var cloneableTags = {};
  cloneableTags[argsTag] = cloneableTags[arrayTag] =
  cloneableTags[arrayBufferTag] = cloneableTags[boolTag] =
  cloneableTags[dateTag] = cloneableTags[float32Tag] =
  cloneableTags[float64Tag] = cloneableTags[int8Tag] =
  cloneableTags[int16Tag] = cloneableTags[int32Tag] =
  cloneableTags[numberTag] = cloneableTags[objectTag] =
  cloneableTags[regexpTag] = cloneableTags[stringTag] =
  cloneableTags[uint8Tag] = cloneableTags[uint8ClampedTag] =
  cloneableTags[uint16Tag] = cloneableTags[uint32Tag] = true;
  cloneableTags[errorTag] = cloneableTags[funcTag] =
  cloneableTags[mapTag] = cloneableTags[setTag] =
  cloneableTags[weakMapTag] = false;

  /** Used to map latin-1 supplementary letters to basic latin letters. */
  var deburredLetters = {
    '\xc0': 'A',  '\xc1': 'A', '\xc2': 'A', '\xc3': 'A', '\xc4': 'A', '\xc5': 'A',
    '\xe0': 'a',  '\xe1': 'a', '\xe2': 'a', '\xe3': 'a', '\xe4': 'a', '\xe5': 'a',
    '\xc7': 'C',  '\xe7': 'c',
    '\xd0': 'D',  '\xf0': 'd',
    '\xc8': 'E',  '\xc9': 'E', '\xca': 'E', '\xcb': 'E',
    '\xe8': 'e',  '\xe9': 'e', '\xea': 'e', '\xeb': 'e',
    '\xcC': 'I',  '\xcd': 'I', '\xce': 'I', '\xcf': 'I',
    '\xeC': 'i',  '\xed': 'i', '\xee': 'i', '\xef': 'i',
    '\xd1': 'N',  '\xf1': 'n',
    '\xd2': 'O',  '\xd3': 'O', '\xd4': 'O', '\xd5': 'O', '\xd6': 'O', '\xd8': 'O',
    '\xf2': 'o',  '\xf3': 'o', '\xf4': 'o', '\xf5': 'o', '\xf6': 'o', '\xf8': 'o',
    '\xd9': 'U',  '\xda': 'U', '\xdb': 'U', '\xdc': 'U',
    '\xf9': 'u',  '\xfa': 'u', '\xfb': 'u', '\xfc': 'u',
    '\xdd': 'Y',  '\xfd': 'y', '\xff': 'y',
    '\xc6': 'Ae', '\xe6': 'ae',
    '\xde': 'Th', '\xfe': 'th',
    '\xdf': 'ss'
  };

  /** Used to map characters to HTML entities. */
  var htmlEscapes = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '`': '&#96;'
  };

  /** Used to map HTML entities to characters. */
  var htmlUnescapes = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
    '&#96;': '`'
  };

  /** Used to determine if values are of the language type `Object`. */
  var objectTypes = {
    'function': true,
    'object': true
  };

  /** Used to escape characters for inclusion in compiled regexes. */
  var regexpEscapes = {
    '0': 'x30', '1': 'x31', '2': 'x32', '3': 'x33', '4': 'x34',
    '5': 'x35', '6': 'x36', '7': 'x37', '8': 'x38', '9': 'x39',
    'A': 'x41', 'B': 'x42', 'C': 'x43', 'D': 'x44', 'E': 'x45', 'F': 'x46',
    'a': 'x61', 'b': 'x62', 'c': 'x63', 'd': 'x64', 'e': 'x65', 'f': 'x66',
    'n': 'x6e', 'r': 'x72', 't': 'x74', 'u': 'x75', 'v': 'x76', 'x': 'x78'
  };

  /** Used to escape characters for inclusion in compiled string literals. */
  var stringEscapes = {
    '\\': '\\',
    "'": "'",
    '\n': 'n',
    '\r': 'r',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };

  /** Detect free variable `exports`. */
  var freeExports = objectTypes[typeof exports] && exports && !exports.nodeType && exports;

  /** Detect free variable `module`. */
  var freeModule = objectTypes[typeof module] && module && !module.nodeType && module;

  /** Detect free variable `global` from Node.js. */
  var freeGlobal = freeExports && freeModule && typeof global == 'object' && global && global.Object && global;

  /** Detect free variable `self`. */
  var freeSelf = objectTypes[typeof self] && self && self.Object && self;

  /** Detect free variable `window`. */
  var freeWindow = objectTypes[typeof window] && window && window.Object && window;

  /** Detect the popular CommonJS extension `module.exports`. */
  var moduleExports = freeModule && freeModule.exports === freeExports && freeExports;

  /**
   * Used as a reference to the global object.
   *
   * The `this` value is used if it's the global object to avoid Greasemonkey's
   * restricted `window` object, otherwise the `window` object is used.
   */
  var root = freeGlobal || ((freeWindow !== (this && this.window)) && freeWindow) || freeSelf || this;

  /*--------------------------------------------------------------------------*/

  /**
   * The base implementation of `compareAscending` which compares values and
   * sorts them in ascending order without guaranteeing a stable sort.
   *
   * @private
   * @param {*} value The value to compare.
   * @param {*} other The other value to compare.
   * @returns {number} Returns the sort order indicator for `value`.
   */
  function baseCompareAscending(value, other) {
    if (value !== other) {
      var valIsNull = value === null,
          valIsUndef = value === undefined,
          valIsReflexive = value === value;

      var othIsNull = other === null,
          othIsUndef = other === undefined,
          othIsReflexive = other === other;

      if ((value > other && !othIsNull) || !valIsReflexive ||
          (valIsNull && !othIsUndef && othIsReflexive) ||
          (valIsUndef && othIsReflexive)) {
        return 1;
      }
      if ((value < other && !valIsNull) || !othIsReflexive ||
          (othIsNull && !valIsUndef && valIsReflexive) ||
          (othIsUndef && valIsReflexive)) {
        return -1;
      }
    }
    return 0;
  }

  /**
   * The base implementation of `_.findIndex` and `_.findLastIndex` without
   * support for callback shorthands and `this` binding.
   *
   * @private
   * @param {Array} array The array to search.
   * @param {Function} predicate The function invoked per iteration.
   * @param {boolean} [fromRight] Specify iterating from right to left.
   * @returns {number} Returns the index of the matched value, else `-1`.
   */
  function baseFindIndex(array, predicate, fromRight) {
    var length = array.length,
        index = fromRight ? length : -1;

    while ((fromRight ? index-- : ++index < length)) {
      if (predicate(array[index], index, array)) {
        return index;
      }
    }
    return -1;
  }

  /**
   * The base implementation of `_.indexOf` without support for binary searches.
   *
   * @private
   * @param {Array} array The array to search.
   * @param {*} value The value to search for.
   * @param {number} fromIndex The index to search from.
   * @returns {number} Returns the index of the matched value, else `-1`.
   */
  function baseIndexOf(array, value, fromIndex) {
    if (value !== value) {
      return indexOfNaN(array, fromIndex);
    }
    var index = fromIndex - 1,
        length = array.length;

    while (++index < length) {
      if (array[index] === value) {
        return index;
      }
    }
    return -1;
  }

  /**
   * The base implementation of `_.isFunction` without support for environments
   * with incorrect `typeof` results.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
   */
  function baseIsFunction(value) {
    // Avoid a Chakra JIT bug in compatibility modes of IE 11.
    // See https://github.com/jashkenas/underscore/issues/1621 for more details.
    return typeof value == 'function' || false;
  }

  /**
   * Converts `value` to a string if it's not one. An empty string is returned
   * for `null` or `undefined` values.
   *
   * @private
   * @param {*} value The value to process.
   * @returns {string} Returns the string.
   */
  function baseToString(value) {
    return value == null ? '' : (value + '');
  }

  /**
   * Used by `_.trim` and `_.trimLeft` to get the index of the first character
   * of `string` that is not found in `chars`.
   *
   * @private
   * @param {string} string The string to inspect.
   * @param {string} chars The characters to find.
   * @returns {number} Returns the index of the first character not found in `chars`.
   */
  function charsLeftIndex(string, chars) {
    var index = -1,
        length = string.length;

    while (++index < length && chars.indexOf(string.charAt(index)) > -1) {}
    return index;
  }

  /**
   * Used by `_.trim` and `_.trimRight` to get the index of the last character
   * of `string` that is not found in `chars`.
   *
   * @private
   * @param {string} string The string to inspect.
   * @param {string} chars The characters to find.
   * @returns {number} Returns the index of the last character not found in `chars`.
   */
  function charsRightIndex(string, chars) {
    var index = string.length;

    while (index-- && chars.indexOf(string.charAt(index)) > -1) {}
    return index;
  }

  /**
   * Used by `_.sortBy` to compare transformed elements of a collection and stable
   * sort them in ascending order.
   *
   * @private
   * @param {Object} object The object to compare.
   * @param {Object} other The other object to compare.
   * @returns {number} Returns the sort order indicator for `object`.
   */
  function compareAscending(object, other) {
    return baseCompareAscending(object.criteria, other.criteria) || (object.index - other.index);
  }

  /**
   * Used by `_.sortByOrder` to compare multiple properties of a value to another
   * and stable sort them.
   *
   * If `orders` is unspecified, all valuess are sorted in ascending order. Otherwise,
   * a value is sorted in ascending order if its corresponding order is "asc", and
   * descending if "desc".
   *
   * @private
   * @param {Object} object The object to compare.
   * @param {Object} other The other object to compare.
   * @param {boolean[]} orders The order to sort by for each property.
   * @returns {number} Returns the sort order indicator for `object`.
   */
  function compareMultiple(object, other, orders) {
    var index = -1,
        objCriteria = object.criteria,
        othCriteria = other.criteria,
        length = objCriteria.length,
        ordersLength = orders.length;

    while (++index < length) {
      var result = baseCompareAscending(objCriteria[index], othCriteria[index]);
      if (result) {
        if (index >= ordersLength) {
          return result;
        }
        var order = orders[index];
        return result * ((order === 'asc' || order === true) ? 1 : -1);
      }
    }
    // Fixes an `Array#sort` bug in the JS engine embedded in Adobe applications
    // that causes it, under certain circumstances, to provide the same value for
    // `object` and `other`. See https://github.com/jashkenas/underscore/pull/1247
    // for more details.
    //
    // This also ensures a stable sort in V8 and other engines.
    // See https://code.google.com/p/v8/issues/detail?id=90 for more details.
    return object.index - other.index;
  }

  /**
   * Used by `_.deburr` to convert latin-1 supplementary letters to basic latin letters.
   *
   * @private
   * @param {string} letter The matched letter to deburr.
   * @returns {string} Returns the deburred letter.
   */
  function deburrLetter(letter) {
    return deburredLetters[letter];
  }

  /**
   * Used by `_.escape` to convert characters to HTML entities.
   *
   * @private
   * @param {string} chr The matched character to escape.
   * @returns {string} Returns the escaped character.
   */
  function escapeHtmlChar(chr) {
    return htmlEscapes[chr];
  }

  /**
   * Used by `_.escapeRegExp` to escape characters for inclusion in compiled regexes.
   *
   * @private
   * @param {string} chr The matched character to escape.
   * @param {string} leadingChar The capture group for a leading character.
   * @param {string} whitespaceChar The capture group for a whitespace character.
   * @returns {string} Returns the escaped character.
   */
  function escapeRegExpChar(chr, leadingChar, whitespaceChar) {
    if (leadingChar) {
      chr = regexpEscapes[chr];
    } else if (whitespaceChar) {
      chr = stringEscapes[chr];
    }
    return '\\' + chr;
  }

  /**
   * Used by `_.template` to escape characters for inclusion in compiled string literals.
   *
   * @private
   * @param {string} chr The matched character to escape.
   * @returns {string} Returns the escaped character.
   */
  function escapeStringChar(chr) {
    return '\\' + stringEscapes[chr];
  }

  /**
   * Gets the index at which the first occurrence of `NaN` is found in `array`.
   *
   * @private
   * @param {Array} array The array to search.
   * @param {number} fromIndex The index to search from.
   * @param {boolean} [fromRight] Specify iterating from right to left.
   * @returns {number} Returns the index of the matched `NaN`, else `-1`.
   */
  function indexOfNaN(array, fromIndex, fromRight) {
    var length = array.length,
        index = fromIndex + (fromRight ? 0 : -1);

    while ((fromRight ? index-- : ++index < length)) {
      var other = array[index];
      if (other !== other) {
        return index;
      }
    }
    return -1;
  }

  /**
   * Checks if `value` is object-like.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
   */
  function isObjectLike(value) {
    return !!value && typeof value == 'object';
  }

  /**
   * Used by `trimmedLeftIndex` and `trimmedRightIndex` to determine if a
   * character code is whitespace.
   *
   * @private
   * @param {number} charCode The character code to inspect.
   * @returns {boolean} Returns `true` if `charCode` is whitespace, else `false`.
   */
  function isSpace(charCode) {
    return ((charCode <= 160 && (charCode >= 9 && charCode <= 13) || charCode == 32 || charCode == 160) || charCode == 5760 || charCode == 6158 ||
      (charCode >= 8192 && (charCode <= 8202 || charCode == 8232 || charCode == 8233 || charCode == 8239 || charCode == 8287 || charCode == 12288 || charCode == 65279)));
  }

  /**
   * Replaces all `placeholder` elements in `array` with an internal placeholder
   * and returns an array of their indexes.
   *
   * @private
   * @param {Array} array The array to modify.
   * @param {*} placeholder The placeholder to replace.
   * @returns {Array} Returns the new array of placeholder indexes.
   */
  function replaceHolders(array, placeholder) {
    var index = -1,
        length = array.length,
        resIndex = -1,
        result = [];

    while (++index < length) {
      if (array[index] === placeholder) {
        array[index] = PLACEHOLDER;
        result[++resIndex] = index;
      }
    }
    return result;
  }

  /**
   * An implementation of `_.uniq` optimized for sorted arrays without support
   * for callback shorthands and `this` binding.
   *
   * @private
   * @param {Array} array The array to inspect.
   * @param {Function} [iteratee] The function invoked per iteration.
   * @returns {Array} Returns the new duplicate-value-free array.
   */
  function sortedUniq(array, iteratee) {
    var seen,
        index = -1,
        length = array.length,
        resIndex = -1,
        result = [];

    while (++index < length) {
      var value = array[index],
          computed = iteratee ? iteratee(value, index, array) : value;

      if (!index || seen !== computed) {
        seen = computed;
        result[++resIndex] = value;
      }
    }
    return result;
  }

  /**
   * Used by `_.trim` and `_.trimLeft` to get the index of the first non-whitespace
   * character of `string`.
   *
   * @private
   * @param {string} string The string to inspect.
   * @returns {number} Returns the index of the first non-whitespace character.
   */
  function trimmedLeftIndex(string) {
    var index = -1,
        length = string.length;

    while (++index < length && isSpace(string.charCodeAt(index))) {}
    return index;
  }

  /**
   * Used by `_.trim` and `_.trimRight` to get the index of the last non-whitespace
   * character of `string`.
   *
   * @private
   * @param {string} string The string to inspect.
   * @returns {number} Returns the index of the last non-whitespace character.
   */
  function trimmedRightIndex(string) {
    var index = string.length;

    while (index-- && isSpace(string.charCodeAt(index))) {}
    return index;
  }

  /**
   * Used by `_.unescape` to convert HTML entities to characters.
   *
   * @private
   * @param {string} chr The matched character to unescape.
   * @returns {string} Returns the unescaped character.
   */
  function unescapeHtmlChar(chr) {
    return htmlUnescapes[chr];
  }

  /*--------------------------------------------------------------------------*/

  /**
   * Create a new pristine `lodash` function using the given `context` object.
   *
   * @static
   * @memberOf _
   * @category Utility
   * @param {Object} [context=root] The context object.
   * @returns {Function} Returns a new `lodash` function.
   * @example
   *
   * _.mixin({ 'foo': _.constant('foo') });
   *
   * var lodash = _.runInContext();
   * lodash.mixin({ 'bar': lodash.constant('bar') });
   *
   * _.isFunction(_.foo);
   * // => true
   * _.isFunction(_.bar);
   * // => false
   *
   * lodash.isFunction(lodash.foo);
   * // => false
   * lodash.isFunction(lodash.bar);
   * // => true
   *
   * // using `context` to mock `Date#getTime` use in `_.now`
   * var mock = _.runInContext({
   *   'Date': function() {
   *     return { 'getTime': getTimeMock };
   *   }
   * });
   *
   * // or creating a suped-up `defer` in Node.js
   * var defer = _.runInContext({ 'setTimeout': setImmediate }).defer;
   */
  function runInContext(context) {
    // Avoid issues with some ES3 environments that attempt to use values, named
    // after built-in constructors like `Object`, for the creation of literals.
    // ES5 clears this up by stating that literals must use built-in constructors.
    // See https://es5.github.io/#x11.1.5 for more details.
    context = context ? _.defaults(root.Object(), context, _.pick(root, contextProps)) : root;

    /** Native constructor references. */
    var Array = context.Array,
        Date = context.Date,
        Error = context.Error,
        Function = context.Function,
        Math = context.Math,
        Number = context.Number,
        Object = context.Object,
        RegExp = context.RegExp,
        String = context.String,
        TypeError = context.TypeError;

    /** Used for native method references. */
    var arrayProto = Array.prototype,
        objectProto = Object.prototype,
        stringProto = String.prototype;

    /** Used to resolve the decompiled source of functions. */
    var fnToString = Function.prototype.toString;

    /** Used to check objects for own properties. */
    var hasOwnProperty = objectProto.hasOwnProperty;

    /** Used to generate unique IDs. */
    var idCounter = 0;

    /**
     * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
     * of values.
     */
    var objToString = objectProto.toString;

    /** Used to restore the original `_` reference in `_.noConflict`. */
    var oldDash = root._;

    /** Used to detect if a method is native. */
    var reIsNative = RegExp('^' +
      fnToString.call(hasOwnProperty).replace(/[\\^$.*+?()[\]{}|]/g, '\\$&')
      .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
    );

    /** Native method references. */
    var ArrayBuffer = context.ArrayBuffer,
        clearTimeout = context.clearTimeout,
        parseFloat = context.parseFloat,
        pow = Math.pow,
        propertyIsEnumerable = objectProto.propertyIsEnumerable,
        Set = getNative(context, 'Set'),
        setTimeout = context.setTimeout,
        splice = arrayProto.splice,
        Uint8Array = context.Uint8Array,
        WeakMap = getNative(context, 'WeakMap');

    /* Native method references for those with the same name as other `lodash` methods. */
    var nativeCeil = Math.ceil,
        nativeCreate = getNative(Object, 'create'),
        nativeFloor = Math.floor,
        nativeIsArray = getNative(Array, 'isArray'),
        nativeIsFinite = context.isFinite,
        nativeKeys = getNative(Object, 'keys'),
        nativeMax = Math.max,
        nativeMin = Math.min,
        nativeNow = getNative(Date, 'now'),
        nativeParseInt = context.parseInt,
        nativeRandom = Math.random;

    /** Used as references for `-Infinity` and `Infinity`. */
    var NEGATIVE_INFINITY = Number.NEGATIVE_INFINITY,
        POSITIVE_INFINITY = Number.POSITIVE_INFINITY;

    /** Used as references for the maximum length and index of an array. */
    var MAX_ARRAY_LENGTH = 4294967295,
        MAX_ARRAY_INDEX = MAX_ARRAY_LENGTH - 1,
        HALF_MAX_ARRAY_LENGTH = MAX_ARRAY_LENGTH >>> 1;

    /**
     * Used as the [maximum length](http://ecma-international.org/ecma-262/6.0/#sec-number.max_safe_integer)
     * of an array-like value.
     */
    var MAX_SAFE_INTEGER = 9007199254740991;

    /** Used to store function metadata. */
    var metaMap = WeakMap && new WeakMap;

    /** Used to lookup unminified function names. */
    var realNames = {};

    /*------------------------------------------------------------------------*/

    /**
     * Creates a `lodash` object which wraps `value` to enable implicit chaining.
     * Methods that operate on and return arrays, collections, and functions can
     * be chained together. Methods that retrieve a single value or may return a
     * primitive value will automatically end the chain returning the unwrapped
     * value. Explicit chaining may be enabled using `_.chain`. The execution of
     * chained methods is lazy, that is, execution is deferred until `_#value`
     * is implicitly or explicitly called.
     *
     * Lazy evaluation allows several methods to support shortcut fusion. Shortcut
     * fusion is an optimization strategy which merge iteratee calls; this can help
     * to avoid the creation of intermediate data structures and greatly reduce the
     * number of iteratee executions.
     *
     * Chaining is supported in custom builds as long as the `_#value` method is
     * directly or indirectly included in the build.
     *
     * In addition to lodash methods, wrappers have `Array` and `String` methods.
     *
     * The wrapper `Array` methods are:
     * `concat`, `join`, `pop`, `push`, `reverse`, `shift`, `slice`, `sort`,
     * `splice`, and `unshift`
     *
     * The wrapper `String` methods are:
     * `replace` and `split`
     *
     * The wrapper methods that support shortcut fusion are:
     * `compact`, `drop`, `dropRight`, `dropRightWhile`, `dropWhile`, `filter`,
     * `first`, `initial`, `last`, `map`, `pluck`, `reject`, `rest`, `reverse`,
     * `slice`, `take`, `takeRight`, `takeRightWhile`, `takeWhile`, `toArray`,
     * and `where`
     *
     * The chainable wrapper methods are:
     * `after`, `ary`, `assign`, `at`, `before`, `bind`, `bindAll`, `bindKey`,
     * `callback`, `chain`, `chunk`, `commit`, `compact`, `concat`, `constant`,
     * `countBy`, `create`, `curry`, `debounce`, `defaults`, `defaultsDeep`,
     * `defer`, `delay`, `difference`, `drop`, `dropRight`, `dropRightWhile`,
     * `dropWhile`, `fill`, `filter`, `flatten`, `flattenDeep`, `flow`, `flowRight`,
     * `forEach`, `forEachRight`, `forIn`, `forInRight`, `forOwn`, `forOwnRight`,
     * `functions`, `groupBy`, `indexBy`, `initial`, `intersection`, `invert`,
     * `invoke`, `keys`, `keysIn`, `map`, `mapKeys`, `mapValues`, `matches`,
     * `matchesProperty`, `memoize`, `merge`, `method`, `methodOf`, `mixin`,
     * `modArgs`, `negate`, `omit`, `once`, `pairs`, `partial`, `partialRight`,
     * `partition`, `pick`, `plant`, `pluck`, `property`, `propertyOf`, `pull`,
     * `pullAt`, `push`, `range`, `rearg`, `reject`, `remove`, `rest`, `restParam`,
     * `reverse`, `set`, `shuffle`, `slice`, `sort`, `sortBy`, `sortByAll`,
     * `sortByOrder`, `splice`, `spread`, `take`, `takeRight`, `takeRightWhile`,
     * `takeWhile`, `tap`, `throttle`, `thru`, `times`, `toArray`, `toPlainObject`,
     * `transform`, `union`, `uniq`, `unshift`, `unzip`, `unzipWith`, `values`,
     * `valuesIn`, `where`, `without`, `wrap`, `xor`, `zip`, `zipObject`, `zipWith`
     *
     * The wrapper methods that are **not** chainable by default are:
     * `add`, `attempt`, `camelCase`, `capitalize`, `ceil`, `clone`, `cloneDeep`,
     * `deburr`, `endsWith`, `escape`, `escapeRegExp`, `every`, `find`, `findIndex`,
     * `findKey`, `findLast`, `findLastIndex`, `findLastKey`, `findWhere`, `first`,
     * `floor`, `get`, `gt`, `gte`, `has`, `identity`, `includes`, `indexOf`,
     * `inRange`, `isArguments`, `isArray`, `isBoolean`, `isDate`, `isElement`,
     * `isEmpty`, `isEqual`, `isError`, `isFinite` `isFunction`, `isMatch`,
     * `isNative`, `isNaN`, `isNull`, `isNumber`, `isObject`, `isPlainObject`,
     * `isRegExp`, `isString`, `isUndefined`, `isTypedArray`, `join`, `kebabCase`,
     * `last`, `lastIndexOf`, `lt`, `lte`, `max`, `min`, `noConflict`, `noop`,
     * `now`, `pad`, `padLeft`, `padRight`, `parseInt`, `pop`, `random`, `reduce`,
     * `reduceRight`, `repeat`, `result`, `round`, `runInContext`, `shift`, `size`,
     * `snakeCase`, `some`, `sortedIndex`, `sortedLastIndex`, `startCase`,
     * `startsWith`, `sum`, `template`, `trim`, `trimLeft`, `trimRight`, `trunc`,
     * `unescape`, `uniqueId`, `value`, and `words`
     *
     * The wrapper method `sample` will return a wrapped value when `n` is provided,
     * otherwise an unwrapped value is returned.
     *
     * @name _
     * @constructor
     * @category Chain
     * @param {*} value The value to wrap in a `lodash` instance.
     * @returns {Object} Returns the new `lodash` wrapper instance.
     * @example
     *
     * var wrapped = _([1, 2, 3]);
     *
     * // returns an unwrapped value
     * wrapped.reduce(function(total, n) {
     *   return total + n;
     * });
     * // => 6
     *
     * // returns a wrapped value
     * var squares = wrapped.map(function(n) {
     *   return n * n;
     * });
     *
     * _.isArray(squares);
     * // => false
     *
     * _.isArray(squares.value());
     * // => true
     */
    function lodash(value) {
      if (isObjectLike(value) && !isArray(value) && !(value instanceof LazyWrapper)) {
        if (value instanceof LodashWrapper) {
          return value;
        }
        if (hasOwnProperty.call(value, '__chain__') && hasOwnProperty.call(value, '__wrapped__')) {
          return wrapperClone(value);
        }
      }
      return new LodashWrapper(value);
    }

    /**
     * The function whose prototype all chaining wrappers inherit from.
     *
     * @private
     */
    function baseLodash() {
      // No operation performed.
    }

    /**
     * The base constructor for creating `lodash` wrapper objects.
     *
     * @private
     * @param {*} value The value to wrap.
     * @param {boolean} [chainAll] Enable chaining for all wrapper methods.
     * @param {Array} [actions=[]] Actions to peform to resolve the unwrapped value.
     */
    function LodashWrapper(value, chainAll, actions) {
      this.__wrapped__ = value;
      this.__actions__ = actions || [];
      this.__chain__ = !!chainAll;
    }

    /**
     * An object environment feature flags.
     *
     * @static
     * @memberOf _
     * @type Object
     */
    var support = lodash.support = {};

    /**
     * By default, the template delimiters used by lodash are like those in
     * embedded Ruby (ERB). Change the following template settings to use
     * alternative delimiters.
     *
     * @static
     * @memberOf _
     * @type Object
     */
    lodash.templateSettings = {

      /**
       * Used to detect `data` property values to be HTML-escaped.
       *
       * @memberOf _.templateSettings
       * @type RegExp
       */
      'escape': reEscape,

      /**
       * Used to detect code to be evaluated.
       *
       * @memberOf _.templateSettings
       * @type RegExp
       */
      'evaluate': reEvaluate,

      /**
       * Used to detect `data` property values to inject.
       *
       * @memberOf _.templateSettings
       * @type RegExp
       */
      'interpolate': reInterpolate,

      /**
       * Used to reference the data object in the template text.
       *
       * @memberOf _.templateSettings
       * @type string
       */
      'variable': '',

      /**
       * Used to import variables into the compiled template.
       *
       * @memberOf _.templateSettings
       * @type Object
       */
      'imports': {

        /**
         * A reference to the `lodash` function.
         *
         * @memberOf _.templateSettings.imports
         * @type Function
         */
        '_': lodash
      }
    };

    /*------------------------------------------------------------------------*/

    /**
     * Creates a lazy wrapper object which wraps `value` to enable lazy evaluation.
     *
     * @private
     * @param {*} value The value to wrap.
     */
    function LazyWrapper(value) {
      this.__wrapped__ = value;
      this.__actions__ = [];
      this.__dir__ = 1;
      this.__filtered__ = false;
      this.__iteratees__ = [];
      this.__takeCount__ = POSITIVE_INFINITY;
      this.__views__ = [];
    }

    /**
     * Creates a clone of the lazy wrapper object.
     *
     * @private
     * @name clone
     * @memberOf LazyWrapper
     * @returns {Object} Returns the cloned `LazyWrapper` object.
     */
    function lazyClone() {
      var result = new LazyWrapper(this.__wrapped__);
      result.__actions__ = arrayCopy(this.__actions__);
      result.__dir__ = this.__dir__;
      result.__filtered__ = this.__filtered__;
      result.__iteratees__ = arrayCopy(this.__iteratees__);
      result.__takeCount__ = this.__takeCount__;
      result.__views__ = arrayCopy(this.__views__);
      return result;
    }

    /**
     * Reverses the direction of lazy iteration.
     *
     * @private
     * @name reverse
     * @memberOf LazyWrapper
     * @returns {Object} Returns the new reversed `LazyWrapper` object.
     */
    function lazyReverse() {
      if (this.__filtered__) {
        var result = new LazyWrapper(this);
        result.__dir__ = -1;
        result.__filtered__ = true;
      } else {
        result = this.clone();
        result.__dir__ *= -1;
      }
      return result;
    }

    /**
     * Extracts the unwrapped value from its lazy wrapper.
     *
     * @private
     * @name value
     * @memberOf LazyWrapper
     * @returns {*} Returns the unwrapped value.
     */
    function lazyValue() {
      var array = this.__wrapped__.value(),
          dir = this.__dir__,
          isArr = isArray(array),
          isRight = dir < 0,
          arrLength = isArr ? array.length : 0,
          view = getView(0, arrLength, this.__views__),
          start = view.start,
          end = view.end,
          length = end - start,
          index = isRight ? end : (start - 1),
          iteratees = this.__iteratees__,
          iterLength = iteratees.length,
          resIndex = 0,
          takeCount = nativeMin(length, this.__takeCount__);

      if (!isArr || arrLength < LARGE_ARRAY_SIZE || (arrLength == length && takeCount == length)) {
        return baseWrapperValue((isRight && isArr) ? array.reverse() : array, this.__actions__);
      }
      var result = [];

      outer:
      while (length-- && resIndex < takeCount) {
        index += dir;

        var iterIndex = -1,
            value = array[index];

        while (++iterIndex < iterLength) {
          var data = iteratees[iterIndex],
              iteratee = data.iteratee,
              type = data.type,
              computed = iteratee(value);

          if (type == LAZY_MAP_FLAG) {
            value = computed;
          } else if (!computed) {
            if (type == LAZY_FILTER_FLAG) {
              continue outer;
            } else {
              break outer;
            }
          }
        }
        result[resIndex++] = value;
      }
      return result;
    }

    /*------------------------------------------------------------------------*/

    /**
     * Creates a cache object to store key/value pairs.
     *
     * @private
     * @static
     * @name Cache
     * @memberOf _.memoize
     */
    function MapCache() {
      this.__data__ = {};
    }

    /**
     * Removes `key` and its value from the cache.
     *
     * @private
     * @name delete
     * @memberOf _.memoize.Cache
     * @param {string} key The key of the value to remove.
     * @returns {boolean} Returns `true` if the entry was removed successfully, else `false`.
     */
    function mapDelete(key) {
      return this.has(key) && delete this.__data__[key];
    }

    /**
     * Gets the cached value for `key`.
     *
     * @private
     * @name get
     * @memberOf _.memoize.Cache
     * @param {string} key The key of the value to get.
     * @returns {*} Returns the cached value.
     */
    function mapGet(key) {
      return key == '__proto__' ? undefined : this.__data__[key];
    }

    /**
     * Checks if a cached value for `key` exists.
     *
     * @private
     * @name has
     * @memberOf _.memoize.Cache
     * @param {string} key The key of the entry to check.
     * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
     */
    function mapHas(key) {
      return key != '__proto__' && hasOwnProperty.call(this.__data__, key);
    }

    /**
     * Sets `value` to `key` of the cache.
     *
     * @private
     * @name set
     * @memberOf _.memoize.Cache
     * @param {string} key The key of the value to cache.
     * @param {*} value The value to cache.
     * @returns {Object} Returns the cache object.
     */
    function mapSet(key, value) {
      if (key != '__proto__') {
        this.__data__[key] = value;
      }
      return this;
    }

    /*------------------------------------------------------------------------*/

    /**
     *
     * Creates a cache object to store unique values.
     *
     * @private
     * @param {Array} [values] The values to cache.
     */
    function SetCache(values) {
      var length = values ? values.length : 0;

      this.data = { 'hash': nativeCreate(null), 'set': new Set };
      while (length--) {
        this.push(values[length]);
      }
    }

    /**
     * Checks if `value` is in `cache` mimicking the return signature of
     * `_.indexOf` by returning `0` if the value is found, else `-1`.
     *
     * @private
     * @param {Object} cache The cache to search.
     * @param {*} value The value to search for.
     * @returns {number} Returns `0` if `value` is found, else `-1`.
     */
    function cacheIndexOf(cache, value) {
      var data = cache.data,
          result = (typeof value == 'string' || isObject(value)) ? data.set.has(value) : data.hash[value];

      return result ? 0 : -1;
    }

    /**
     * Adds `value` to the cache.
     *
     * @private
     * @name push
     * @memberOf SetCache
     * @param {*} value The value to cache.
     */
    function cachePush(value) {
      var data = this.data;
      if (typeof value == 'string' || isObject(value)) {
        data.set.add(value);
      } else {
        data.hash[value] = true;
      }
    }

    /*------------------------------------------------------------------------*/

    /**
     * Creates a new array joining `array` with `other`.
     *
     * @private
     * @param {Array} array The array to join.
     * @param {Array} other The other array to join.
     * @returns {Array} Returns the new concatenated array.
     */
    function arrayConcat(array, other) {
      var index = -1,
          length = array.length,
          othIndex = -1,
          othLength = other.length,
          result = Array(length + othLength);

      while (++index < length) {
        result[index] = array[index];
      }
      while (++othIndex < othLength) {
        result[index++] = other[othIndex];
      }
      return result;
    }

    /**
     * Copies the values of `source` to `array`.
     *
     * @private
     * @param {Array} source The array to copy values from.
     * @param {Array} [array=[]] The array to copy values to.
     * @returns {Array} Returns `array`.
     */
    function arrayCopy(source, array) {
      var index = -1,
          length = source.length;

      array || (array = Array(length));
      while (++index < length) {
        array[index] = source[index];
      }
      return array;
    }

    /**
     * A specialized version of `_.forEach` for arrays without support for callback
     * shorthands and `this` binding.
     *
     * @private
     * @param {Array} array The array to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Array} Returns `array`.
     */
    function arrayEach(array, iteratee) {
      var index = -1,
          length = array.length;

      while (++index < length) {
        if (iteratee(array[index], index, array) === false) {
          break;
        }
      }
      return array;
    }

    /**
     * A specialized version of `_.forEachRight` for arrays without support for
     * callback shorthands and `this` binding.
     *
     * @private
     * @param {Array} array The array to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Array} Returns `array`.
     */
    function arrayEachRight(array, iteratee) {
      var length = array.length;

      while (length--) {
        if (iteratee(array[length], length, array) === false) {
          break;
        }
      }
      return array;
    }

    /**
     * A specialized version of `_.every` for arrays without support for callback
     * shorthands and `this` binding.
     *
     * @private
     * @param {Array} array The array to iterate over.
     * @param {Function} predicate The function invoked per iteration.
     * @returns {boolean} Returns `true` if all elements pass the predicate check,
     *  else `false`.
     */
    function arrayEvery(array, predicate) {
      var index = -1,
          length = array.length;

      while (++index < length) {
        if (!predicate(array[index], index, array)) {
          return false;
        }
      }
      return true;
    }

    /**
     * A specialized version of `baseExtremum` for arrays which invokes `iteratee`
     * with one argument: (value).
     *
     * @private
     * @param {Array} array The array to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @param {Function} comparator The function used to compare values.
     * @param {*} exValue The initial extremum value.
     * @returns {*} Returns the extremum value.
     */
    function arrayExtremum(array, iteratee, comparator, exValue) {
      var index = -1,
          length = array.length,
          computed = exValue,
          result = computed;

      while (++index < length) {
        var value = array[index],
            current = +iteratee(value);

        if (comparator(current, computed)) {
          computed = current;
          result = value;
        }
      }
      return result;
    }

    /**
     * A specialized version of `_.filter` for arrays without support for callback
     * shorthands and `this` binding.
     *
     * @private
     * @param {Array} array The array to iterate over.
     * @param {Function} predicate The function invoked per iteration.
     * @returns {Array} Returns the new filtered array.
     */
    function arrayFilter(array, predicate) {
      var index = -1,
          length = array.length,
          resIndex = -1,
          result = [];

      while (++index < length) {
        var value = array[index];
        if (predicate(value, index, array)) {
          result[++resIndex] = value;
        }
      }
      return result;
    }

    /**
     * A specialized version of `_.map` for arrays without support for callback
     * shorthands and `this` binding.
     *
     * @private
     * @param {Array} array The array to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Array} Returns the new mapped array.
     */
    function arrayMap(array, iteratee) {
      var index = -1,
          length = array.length,
          result = Array(length);

      while (++index < length) {
        result[index] = iteratee(array[index], index, array);
      }
      return result;
    }

    /**
     * Appends the elements of `values` to `array`.
     *
     * @private
     * @param {Array} array The array to modify.
     * @param {Array} values The values to append.
     * @returns {Array} Returns `array`.
     */
    function arrayPush(array, values) {
      var index = -1,
          length = values.length,
          offset = array.length;

      while (++index < length) {
        array[offset + index] = values[index];
      }
      return array;
    }

    /**
     * A specialized version of `_.reduce` for arrays without support for callback
     * shorthands and `this` binding.
     *
     * @private
     * @param {Array} array The array to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @param {*} [accumulator] The initial value.
     * @param {boolean} [initFromArray] Specify using the first element of `array`
     *  as the initial value.
     * @returns {*} Returns the accumulated value.
     */
    function arrayReduce(array, iteratee, accumulator, initFromArray) {
      var index = -1,
          length = array.length;

      if (initFromArray && length) {
        accumulator = array[++index];
      }
      while (++index < length) {
        accumulator = iteratee(accumulator, array[index], index, array);
      }
      return accumulator;
    }

    /**
     * A specialized version of `_.reduceRight` for arrays without support for
     * callback shorthands and `this` binding.
     *
     * @private
     * @param {Array} array The array to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @param {*} [accumulator] The initial value.
     * @param {boolean} [initFromArray] Specify using the last element of `array`
     *  as the initial value.
     * @returns {*} Returns the accumulated value.
     */
    function arrayReduceRight(array, iteratee, accumulator, initFromArray) {
      var length = array.length;
      if (initFromArray && length) {
        accumulator = array[--length];
      }
      while (length--) {
        accumulator = iteratee(accumulator, array[length], length, array);
      }
      return accumulator;
    }

    /**
     * A specialized version of `_.some` for arrays without support for callback
     * shorthands and `this` binding.
     *
     * @private
     * @param {Array} array The array to iterate over.
     * @param {Function} predicate The function invoked per iteration.
     * @returns {boolean} Returns `true` if any element passes the predicate check,
     *  else `false`.
     */
    function arraySome(array, predicate) {
      var index = -1,
          length = array.length;

      while (++index < length) {
        if (predicate(array[index], index, array)) {
          return true;
        }
      }
      return false;
    }

    /**
     * A specialized version of `_.sum` for arrays without support for callback
     * shorthands and `this` binding..
     *
     * @private
     * @param {Array} array The array to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {number} Returns the sum.
     */
    function arraySum(array, iteratee) {
      var length = array.length,
          result = 0;

      while (length--) {
        result += +iteratee(array[length]) || 0;
      }
      return result;
    }

    /**
     * Used by `_.defaults` to customize its `_.assign` use.
     *
     * @private
     * @param {*} objectValue The destination object property value.
     * @param {*} sourceValue The source object property value.
     * @returns {*} Returns the value to assign to the destination object.
     */
    function assignDefaults(objectValue, sourceValue) {
      return objectValue === undefined ? sourceValue : objectValue;
    }

    /**
     * Used by `_.template` to customize its `_.assign` use.
     *
     * **Note:** This function is like `assignDefaults` except that it ignores
     * inherited property values when checking if a property is `undefined`.
     *
     * @private
     * @param {*} objectValue The destination object property value.
     * @param {*} sourceValue The source object property value.
     * @param {string} key The key associated with the object and source values.
     * @param {Object} object The destination object.
     * @returns {*} Returns the value to assign to the destination object.
     */
    function assignOwnDefaults(objectValue, sourceValue, key, object) {
      return (objectValue === undefined || !hasOwnProperty.call(object, key))
        ? sourceValue
        : objectValue;
    }

    /**
     * A specialized version of `_.assign` for customizing assigned values without
     * support for argument juggling, multiple sources, and `this` binding `customizer`
     * functions.
     *
     * @private
     * @param {Object} object The destination object.
     * @param {Object} source The source object.
     * @param {Function} customizer The function to customize assigned values.
     * @returns {Object} Returns `object`.
     */
    function assignWith(object, source, customizer) {
      var index = -1,
          props = keys(source),
          length = props.length;

      while (++index < length) {
        var key = props[index],
            value = object[key],
            result = customizer(value, source[key], key, object, source);

        if ((result === result ? (result !== value) : (value === value)) ||
            (value === undefined && !(key in object))) {
          object[key] = result;
        }
      }
      return object;
    }

    /**
     * The base implementation of `_.assign` without support for argument juggling,
     * multiple sources, and `customizer` functions.
     *
     * @private
     * @param {Object} object The destination object.
     * @param {Object} source The source object.
     * @returns {Object} Returns `object`.
     */
    function baseAssign(object, source) {
      return source == null
        ? object
        : baseCopy(source, keys(source), object);
    }

    /**
     * The base implementation of `_.at` without support for string collections
     * and individual key arguments.
     *
     * @private
     * @param {Array|Object} collection The collection to iterate over.
     * @param {number[]|string[]} props The property names or indexes of elements to pick.
     * @returns {Array} Returns the new array of picked elements.
     */
    function baseAt(collection, props) {
      var index = -1,
          isNil = collection == null,
          isArr = !isNil && isArrayLike(collection),
          length = isArr ? collection.length : 0,
          propsLength = props.length,
          result = Array(propsLength);

      while(++index < propsLength) {
        var key = props[index];
        if (isArr) {
          result[index] = isIndex(key, length) ? collection[key] : undefined;
        } else {
          result[index] = isNil ? undefined : collection[key];
        }
      }
      return result;
    }

    /**
     * Copies properties of `source` to `object`.
     *
     * @private
     * @param {Object} source The object to copy properties from.
     * @param {Array} props The property names to copy.
     * @param {Object} [object={}] The object to copy properties to.
     * @returns {Object} Returns `object`.
     */
    function baseCopy(source, props, object) {
      object || (object = {});

      var index = -1,
          length = props.length;

      while (++index < length) {
        var key = props[index];
        object[key] = source[key];
      }
      return object;
    }

    /**
     * The base implementation of `_.callback` which supports specifying the
     * number of arguments to provide to `func`.
     *
     * @private
     * @param {*} [func=_.identity] The value to convert to a callback.
     * @param {*} [thisArg] The `this` binding of `func`.
     * @param {number} [argCount] The number of arguments to provide to `func`.
     * @returns {Function} Returns the callback.
     */
    function baseCallback(func, thisArg, argCount) {
      var type = typeof func;
      if (type == 'function') {
        return thisArg === undefined
          ? func
          : bindCallback(func, thisArg, argCount);
      }
      if (func == null) {
        return identity;
      }
      if (type == 'object') {
        return baseMatches(func);
      }
      return thisArg === undefined
        ? property(func)
        : baseMatchesProperty(func, thisArg);
    }

    /**
     * The base implementation of `_.clone` without support for argument juggling
     * and `this` binding `customizer` functions.
     *
     * @private
     * @param {*} value The value to clone.
     * @param {boolean} [isDeep] Specify a deep clone.
     * @param {Function} [customizer] The function to customize cloning values.
     * @param {string} [key] The key of `value`.
     * @param {Object} [object] The object `value` belongs to.
     * @param {Array} [stackA=[]] Tracks traversed source objects.
     * @param {Array} [stackB=[]] Associates clones with source counterparts.
     * @returns {*} Returns the cloned value.
     */
    function baseClone(value, isDeep, customizer, key, object, stackA, stackB) {
      var result;
      if (customizer) {
        result = object ? customizer(value, key, object) : customizer(value);
      }
      if (result !== undefined) {
        return result;
      }
      if (!isObject(value)) {
        return value;
      }
      var isArr = isArray(value);
      if (isArr) {
        result = initCloneArray(value);
        if (!isDeep) {
          return arrayCopy(value, result);
        }
      } else {
        var tag = objToString.call(value),
            isFunc = tag == funcTag;

        if (tag == objectTag || tag == argsTag || (isFunc && !object)) {
          result = initCloneObject(isFunc ? {} : value);
          if (!isDeep) {
            return baseAssign(result, value);
          }
        } else {
          return cloneableTags[tag]
            ? initCloneByTag(value, tag, isDeep)
            : (object ? value : {});
        }
      }
      // Check for circular references and return its corresponding clone.
      stackA || (stackA = []);
      stackB || (stackB = []);

      var length = stackA.length;
      while (length--) {
        if (stackA[length] == value) {
          return stackB[length];
        }
      }
      // Add the source value to the stack of traversed objects and associate it with its clone.
      stackA.push(value);
      stackB.push(result);

      // Recursively populate clone (susceptible to call stack limits).
      (isArr ? arrayEach : baseForOwn)(value, function(subValue, key) {
        result[key] = baseClone(subValue, isDeep, customizer, key, value, stackA, stackB);
      });
      return result;
    }

    /**
     * The base implementation of `_.create` without support for assigning
     * properties to the created object.
     *
     * @private
     * @param {Object} prototype The object to inherit from.
     * @returns {Object} Returns the new object.
     */
    var baseCreate = (function() {
      function object() {}
      return function(prototype) {
        if (isObject(prototype)) {
          object.prototype = prototype;
          var result = new object;
          object.prototype = undefined;
        }
        return result || {};
      };
    }());

    /**
     * The base implementation of `_.delay` and `_.defer` which accepts an index
     * of where to slice the arguments to provide to `func`.
     *
     * @private
     * @param {Function} func The function to delay.
     * @param {number} wait The number of milliseconds to delay invocation.
     * @param {Object} args The arguments provide to `func`.
     * @returns {number} Returns the timer id.
     */
    function baseDelay(func, wait, args) {
      if (typeof func != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      return setTimeout(function() { func.apply(undefined, args); }, wait);
    }

    /**
     * The base implementation of `_.difference` which accepts a single array
     * of values to exclude.
     *
     * @private
     * @param {Array} array The array to inspect.
     * @param {Array} values The values to exclude.
     * @returns {Array} Returns the new array of filtered values.
     */
    function baseDifference(array, values) {
      var length = array ? array.length : 0,
          result = [];

      if (!length) {
        return result;
      }
      var index = -1,
          indexOf = getIndexOf(),
          isCommon = indexOf == baseIndexOf,
          cache = (isCommon && values.length >= LARGE_ARRAY_SIZE) ? createCache(values) : null,
          valuesLength = values.length;

      if (cache) {
        indexOf = cacheIndexOf;
        isCommon = false;
        values = cache;
      }
      outer:
      while (++index < length) {
        var value = array[index];

        if (isCommon && value === value) {
          var valuesIndex = valuesLength;
          while (valuesIndex--) {
            if (values[valuesIndex] === value) {
              continue outer;
            }
          }
          result.push(value);
        }
        else if (indexOf(values, value, 0) < 0) {
          result.push(value);
        }
      }
      return result;
    }

    /**
     * The base implementation of `_.forEach` without support for callback
     * shorthands and `this` binding.
     *
     * @private
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Array|Object|string} Returns `collection`.
     */
    var baseEach = createBaseEach(baseForOwn);

    /**
     * The base implementation of `_.forEachRight` without support for callback
     * shorthands and `this` binding.
     *
     * @private
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Array|Object|string} Returns `collection`.
     */
    var baseEachRight = createBaseEach(baseForOwnRight, true);

    /**
     * The base implementation of `_.every` without support for callback
     * shorthands and `this` binding.
     *
     * @private
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function} predicate The function invoked per iteration.
     * @returns {boolean} Returns `true` if all elements pass the predicate check,
     *  else `false`
     */
    function baseEvery(collection, predicate) {
      var result = true;
      baseEach(collection, function(value, index, collection) {
        result = !!predicate(value, index, collection);
        return result;
      });
      return result;
    }

    /**
     * Gets the extremum value of `collection` invoking `iteratee` for each value
     * in `collection` to generate the criterion by which the value is ranked.
     * The `iteratee` is invoked with three arguments: (value, index|key, collection).
     *
     * @private
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @param {Function} comparator The function used to compare values.
     * @param {*} exValue The initial extremum value.
     * @returns {*} Returns the extremum value.
     */
    function baseExtremum(collection, iteratee, comparator, exValue) {
      var computed = exValue,
          result = computed;

      baseEach(collection, function(value, index, collection) {
        var current = +iteratee(value, index, collection);
        if (comparator(current, computed) || (current === exValue && current === result)) {
          computed = current;
          result = value;
        }
      });
      return result;
    }

    /**
     * The base implementation of `_.fill` without an iteratee call guard.
     *
     * @private
     * @param {Array} array The array to fill.
     * @param {*} value The value to fill `array` with.
     * @param {number} [start=0] The start position.
     * @param {number} [end=array.length] The end position.
     * @returns {Array} Returns `array`.
     */
    function baseFill(array, value, start, end) {
      var length = array.length;

      start = start == null ? 0 : (+start || 0);
      if (start < 0) {
        start = -start > length ? 0 : (length + start);
      }
      end = (end === undefined || end > length) ? length : (+end || 0);
      if (end < 0) {
        end += length;
      }
      length = start > end ? 0 : (end >>> 0);
      start >>>= 0;

      while (start < length) {
        array[start++] = value;
      }
      return array;
    }

    /**
     * The base implementation of `_.filter` without support for callback
     * shorthands and `this` binding.
     *
     * @private
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function} predicate The function invoked per iteration.
     * @returns {Array} Returns the new filtered array.
     */
    function baseFilter(collection, predicate) {
      var result = [];
      baseEach(collection, function(value, index, collection) {
        if (predicate(value, index, collection)) {
          result.push(value);
        }
      });
      return result;
    }

    /**
     * The base implementation of `_.find`, `_.findLast`, `_.findKey`, and `_.findLastKey`,
     * without support for callback shorthands and `this` binding, which iterates
     * over `collection` using the provided `eachFunc`.
     *
     * @private
     * @param {Array|Object|string} collection The collection to search.
     * @param {Function} predicate The function invoked per iteration.
     * @param {Function} eachFunc The function to iterate over `collection`.
     * @param {boolean} [retKey] Specify returning the key of the found element
     *  instead of the element itself.
     * @returns {*} Returns the found element or its key, else `undefined`.
     */
    function baseFind(collection, predicate, eachFunc, retKey) {
      var result;
      eachFunc(collection, function(value, key, collection) {
        if (predicate(value, key, collection)) {
          result = retKey ? key : value;
          return false;
        }
      });
      return result;
    }

    /**
     * The base implementation of `_.flatten` with added support for restricting
     * flattening and specifying the start index.
     *
     * @private
     * @param {Array} array The array to flatten.
     * @param {boolean} [isDeep] Specify a deep flatten.
     * @param {boolean} [isStrict] Restrict flattening to arrays-like objects.
     * @param {Array} [result=[]] The initial result value.
     * @returns {Array} Returns the new flattened array.
     */
    function baseFlatten(array, isDeep, isStrict, result) {
      result || (result = []);

      var index = -1,
          length = array.length;

      while (++index < length) {
        var value = array[index];
        if (isObjectLike(value) && isArrayLike(value) &&
            (isStrict || isArray(value) || isArguments(value))) {
          if (isDeep) {
            // Recursively flatten arrays (susceptible to call stack limits).
            baseFlatten(value, isDeep, isStrict, result);
          } else {
            arrayPush(result, value);
          }
        } else if (!isStrict) {
          result[result.length] = value;
        }
      }
      return result;
    }

    /**
     * The base implementation of `baseForIn` and `baseForOwn` which iterates
     * over `object` properties returned by `keysFunc` invoking `iteratee` for
     * each property. Iteratee functions may exit iteration early by explicitly
     * returning `false`.
     *
     * @private
     * @param {Object} object The object to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @param {Function} keysFunc The function to get the keys of `object`.
     * @returns {Object} Returns `object`.
     */
    var baseFor = createBaseFor();

    /**
     * This function is like `baseFor` except that it iterates over properties
     * in the opposite order.
     *
     * @private
     * @param {Object} object The object to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @param {Function} keysFunc The function to get the keys of `object`.
     * @returns {Object} Returns `object`.
     */
    var baseForRight = createBaseFor(true);

    /**
     * The base implementation of `_.forIn` without support for callback
     * shorthands and `this` binding.
     *
     * @private
     * @param {Object} object The object to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Object} Returns `object`.
     */
    function baseForIn(object, iteratee) {
      return baseFor(object, iteratee, keysIn);
    }

    /**
     * The base implementation of `_.forOwn` without support for callback
     * shorthands and `this` binding.
     *
     * @private
     * @param {Object} object The object to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Object} Returns `object`.
     */
    function baseForOwn(object, iteratee) {
      return baseFor(object, iteratee, keys);
    }

    /**
     * The base implementation of `_.forOwnRight` without support for callback
     * shorthands and `this` binding.
     *
     * @private
     * @param {Object} object The object to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Object} Returns `object`.
     */
    function baseForOwnRight(object, iteratee) {
      return baseForRight(object, iteratee, keys);
    }

    /**
     * The base implementation of `_.functions` which creates an array of
     * `object` function property names filtered from those provided.
     *
     * @private
     * @param {Object} object The object to inspect.
     * @param {Array} props The property names to filter.
     * @returns {Array} Returns the new array of filtered property names.
     */
    function baseFunctions(object, props) {
      var index = -1,
          length = props.length,
          resIndex = -1,
          result = [];

      while (++index < length) {
        var key = props[index];
        if (isFunction(object[key])) {
          result[++resIndex] = key;
        }
      }
      return result;
    }

    /**
     * The base implementation of `get` without support for string paths
     * and default values.
     *
     * @private
     * @param {Object} object The object to query.
     * @param {Array} path The path of the property to get.
     * @param {string} [pathKey] The key representation of path.
     * @returns {*} Returns the resolved value.
     */
    function baseGet(object, path, pathKey) {
      if (object == null) {
        return;
      }
      if (pathKey !== undefined && pathKey in toObject(object)) {
        path = [pathKey];
      }
      var index = 0,
          length = path.length;

      while (object != null && index < length) {
        object = object[path[index++]];
      }
      return (index && index == length) ? object : undefined;
    }

    /**
     * The base implementation of `_.isEqual` without support for `this` binding
     * `customizer` functions.
     *
     * @private
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @param {Function} [customizer] The function to customize comparing values.
     * @param {boolean} [isLoose] Specify performing partial comparisons.
     * @param {Array} [stackA] Tracks traversed `value` objects.
     * @param {Array} [stackB] Tracks traversed `other` objects.
     * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
     */
    function baseIsEqual(value, other, customizer, isLoose, stackA, stackB) {
      if (value === other) {
        return true;
      }
      if (value == null || other == null || (!isObject(value) && !isObjectLike(other))) {
        return value !== value && other !== other;
      }
      return baseIsEqualDeep(value, other, baseIsEqual, customizer, isLoose, stackA, stackB);
    }

    /**
     * A specialized version of `baseIsEqual` for arrays and objects which performs
     * deep comparisons and tracks traversed objects enabling objects with circular
     * references to be compared.
     *
     * @private
     * @param {Object} object The object to compare.
     * @param {Object} other The other object to compare.
     * @param {Function} equalFunc The function to determine equivalents of values.
     * @param {Function} [customizer] The function to customize comparing objects.
     * @param {boolean} [isLoose] Specify performing partial comparisons.
     * @param {Array} [stackA=[]] Tracks traversed `value` objects.
     * @param {Array} [stackB=[]] Tracks traversed `other` objects.
     * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
     */
    function baseIsEqualDeep(object, other, equalFunc, customizer, isLoose, stackA, stackB) {
      var objIsArr = isArray(object),
          othIsArr = isArray(other),
          objTag = arrayTag,
          othTag = arrayTag;

      if (!objIsArr) {
        objTag = objToString.call(object);
        if (objTag == argsTag) {
          objTag = objectTag;
        } else if (objTag != objectTag) {
          objIsArr = isTypedArray(object);
        }
      }
      if (!othIsArr) {
        othTag = objToString.call(other);
        if (othTag == argsTag) {
          othTag = objectTag;
        } else if (othTag != objectTag) {
          othIsArr = isTypedArray(other);
        }
      }
      var objIsObj = objTag == objectTag,
          othIsObj = othTag == objectTag,
          isSameTag = objTag == othTag;

      if (isSameTag && !(objIsArr || objIsObj)) {
        return equalByTag(object, other, objTag);
      }
      if (!isLoose) {
        var objIsWrapped = objIsObj && hasOwnProperty.call(object, '__wrapped__'),
            othIsWrapped = othIsObj && hasOwnProperty.call(other, '__wrapped__');

        if (objIsWrapped || othIsWrapped) {
          return equalFunc(objIsWrapped ? object.value() : object, othIsWrapped ? other.value() : other, customizer, isLoose, stackA, stackB);
        }
      }
      if (!isSameTag) {
        return false;
      }
      // Assume cyclic values are equal.
      // For more information on detecting circular references see https://es5.github.io/#JO.
      stackA || (stackA = []);
      stackB || (stackB = []);

      var length = stackA.length;
      while (length--) {
        if (stackA[length] == object) {
          return stackB[length] == other;
        }
      }
      // Add `object` and `other` to the stack of traversed objects.
      stackA.push(object);
      stackB.push(other);

      var result = (objIsArr ? equalArrays : equalObjects)(object, other, equalFunc, customizer, isLoose, stackA, stackB);

      stackA.pop();
      stackB.pop();

      return result;
    }

    /**
     * The base implementation of `_.isMatch` without support for callback
     * shorthands and `this` binding.
     *
     * @private
     * @param {Object} object The object to inspect.
     * @param {Array} matchData The propery names, values, and compare flags to match.
     * @param {Function} [customizer] The function to customize comparing objects.
     * @returns {boolean} Returns `true` if `object` is a match, else `false`.
     */
    function baseIsMatch(object, matchData, customizer) {
      var index = matchData.length,
          length = index,
          noCustomizer = !customizer;

      if (object == null) {
        return !length;
      }
      object = toObject(object);
      while (index--) {
        var data = matchData[index];
        if ((noCustomizer && data[2])
              ? data[1] !== object[data[0]]
              : !(data[0] in object)
            ) {
          return false;
        }
      }
      while (++index < length) {
        data = matchData[index];
        var key = data[0],
            objValue = object[key],
            srcValue = data[1];

        if (noCustomizer && data[2]) {
          if (objValue === undefined && !(key in object)) {
            return false;
          }
        } else {
          var result = customizer ? customizer(objValue, srcValue, key) : undefined;
          if (!(result === undefined ? baseIsEqual(srcValue, objValue, customizer, true) : result)) {
            return false;
          }
        }
      }
      return true;
    }

    /**
     * The base implementation of `_.map` without support for callback shorthands
     * and `this` binding.
     *
     * @private
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Array} Returns the new mapped array.
     */
    function baseMap(collection, iteratee) {
      var index = -1,
          result = isArrayLike(collection) ? Array(collection.length) : [];

      baseEach(collection, function(value, key, collection) {
        result[++index] = iteratee(value, key, collection);
      });
      return result;
    }

    /**
     * The base implementation of `_.matches` which does not clone `source`.
     *
     * @private
     * @param {Object} source The object of property values to match.
     * @returns {Function} Returns the new function.
     */
    function baseMatches(source) {
      var matchData = getMatchData(source);
      if (matchData.length == 1 && matchData[0][2]) {
        var key = matchData[0][0],
            value = matchData[0][1];

        return function(object) {
          if (object == null) {
            return false;
          }
          return object[key] === value && (value !== undefined || (key in toObject(object)));
        };
      }
      return function(object) {
        return baseIsMatch(object, matchData);
      };
    }

    /**
     * The base implementation of `_.matchesProperty` which does not clone `srcValue`.
     *
     * @private
     * @param {string} path The path of the property to get.
     * @param {*} srcValue The value to compare.
     * @returns {Function} Returns the new function.
     */
    function baseMatchesProperty(path, srcValue) {
      var isArr = isArray(path),
          isCommon = isKey(path) && isStrictComparable(srcValue),
          pathKey = (path + '');

      path = toPath(path);
      return function(object) {
        if (object == null) {
          return false;
        }
        var key = pathKey;
        object = toObject(object);
        if ((isArr || !isCommon) && !(key in object)) {
          object = path.length == 1 ? object : baseGet(object, baseSlice(path, 0, -1));
          if (object == null) {
            return false;
          }
          key = last(path);
          object = toObject(object);
        }
        return object[key] === srcValue
          ? (srcValue !== undefined || (key in object))
          : baseIsEqual(srcValue, object[key], undefined, true);
      };
    }

    /**
     * The base implementation of `_.merge` without support for argument juggling,
     * multiple sources, and `this` binding `customizer` functions.
     *
     * @private
     * @param {Object} object The destination object.
     * @param {Object} source The source object.
     * @param {Function} [customizer] The function to customize merged values.
     * @param {Array} [stackA=[]] Tracks traversed source objects.
     * @param {Array} [stackB=[]] Associates values with source counterparts.
     * @returns {Object} Returns `object`.
     */
    function baseMerge(object, source, customizer, stackA, stackB) {
      if (!isObject(object)) {
        return object;
      }
      var isSrcArr = isArrayLike(source) && (isArray(source) || isTypedArray(source)),
          props = isSrcArr ? undefined : keys(source);

      arrayEach(props || source, function(srcValue, key) {
        if (props) {
          key = srcValue;
          srcValue = source[key];
        }
        if (isObjectLike(srcValue)) {
          stackA || (stackA = []);
          stackB || (stackB = []);
          baseMergeDeep(object, source, key, baseMerge, customizer, stackA, stackB);
        }
        else {
          var value = object[key],
              result = customizer ? customizer(value, srcValue, key, object, source) : undefined,
              isCommon = result === undefined;

          if (isCommon) {
            result = srcValue;
          }
          if ((result !== undefined || (isSrcArr && !(key in object))) &&
              (isCommon || (result === result ? (result !== value) : (value === value)))) {
            object[key] = result;
          }
        }
      });
      return object;
    }

    /**
     * A specialized version of `baseMerge` for arrays and objects which performs
     * deep merges and tracks traversed objects enabling objects with circular
     * references to be merged.
     *
     * @private
     * @param {Object} object The destination object.
     * @param {Object} source The source object.
     * @param {string} key The key of the value to merge.
     * @param {Function} mergeFunc The function to merge values.
     * @param {Function} [customizer] The function to customize merged values.
     * @param {Array} [stackA=[]] Tracks traversed source objects.
     * @param {Array} [stackB=[]] Associates values with source counterparts.
     * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
     */
    function baseMergeDeep(object, source, key, mergeFunc, customizer, stackA, stackB) {
      var length = stackA.length,
          srcValue = source[key];

      while (length--) {
        if (stackA[length] == srcValue) {
          object[key] = stackB[length];
          return;
        }
      }
      var value = object[key],
          result = customizer ? customizer(value, srcValue, key, object, source) : undefined,
          isCommon = result === undefined;

      if (isCommon) {
        result = srcValue;
        if (isArrayLike(srcValue) && (isArray(srcValue) || isTypedArray(srcValue))) {
          result = isArray(value)
            ? value
            : (isArrayLike(value) ? arrayCopy(value) : []);
        }
        else if (isPlainObject(srcValue) || isArguments(srcValue)) {
          result = isArguments(value)
            ? toPlainObject(value)
            : (isPlainObject(value) ? value : {});
        }
        else {
          isCommon = false;
        }
      }
      // Add the source value to the stack of traversed objects and associate
      // it with its merged value.
      stackA.push(srcValue);
      stackB.push(result);

      if (isCommon) {
        // Recursively merge objects and arrays (susceptible to call stack limits).
        object[key] = mergeFunc(result, srcValue, customizer, stackA, stackB);
      } else if (result === result ? (result !== value) : (value === value)) {
        object[key] = result;
      }
    }

    /**
     * The base implementation of `_.property` without support for deep paths.
     *
     * @private
     * @param {string} key The key of the property to get.
     * @returns {Function} Returns the new function.
     */
    function baseProperty(key) {
      return function(object) {
        return object == null ? undefined : object[key];
      };
    }

    /**
     * A specialized version of `baseProperty` which supports deep paths.
     *
     * @private
     * @param {Array|string} path The path of the property to get.
     * @returns {Function} Returns the new function.
     */
    function basePropertyDeep(path) {
      var pathKey = (path + '');
      path = toPath(path);
      return function(object) {
        return baseGet(object, path, pathKey);
      };
    }

    /**
     * The base implementation of `_.pullAt` without support for individual
     * index arguments and capturing the removed elements.
     *
     * @private
     * @param {Array} array The array to modify.
     * @param {number[]} indexes The indexes of elements to remove.
     * @returns {Array} Returns `array`.
     */
    function basePullAt(array, indexes) {
      var length = array ? indexes.length : 0;
      while (length--) {
        var index = indexes[length];
        if (index != previous && isIndex(index)) {
          var previous = index;
          splice.call(array, index, 1);
        }
      }
      return array;
    }

    /**
     * The base implementation of `_.random` without support for argument juggling
     * and returning floating-point numbers.
     *
     * @private
     * @param {number} min The minimum possible value.
     * @param {number} max The maximum possible value.
     * @returns {number} Returns the random number.
     */
    function baseRandom(min, max) {
      return min + nativeFloor(nativeRandom() * (max - min + 1));
    }

    /**
     * The base implementation of `_.reduce` and `_.reduceRight` without support
     * for callback shorthands and `this` binding, which iterates over `collection`
     * using the provided `eachFunc`.
     *
     * @private
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @param {*} accumulator The initial value.
     * @param {boolean} initFromCollection Specify using the first or last element
     *  of `collection` as the initial value.
     * @param {Function} eachFunc The function to iterate over `collection`.
     * @returns {*} Returns the accumulated value.
     */
    function baseReduce(collection, iteratee, accumulator, initFromCollection, eachFunc) {
      eachFunc(collection, function(value, index, collection) {
        accumulator = initFromCollection
          ? (initFromCollection = false, value)
          : iteratee(accumulator, value, index, collection);
      });
      return accumulator;
    }

    /**
     * The base implementation of `setData` without support for hot loop detection.
     *
     * @private
     * @param {Function} func The function to associate metadata with.
     * @param {*} data The metadata.
     * @returns {Function} Returns `func`.
     */
    var baseSetData = !metaMap ? identity : function(func, data) {
      metaMap.set(func, data);
      return func;
    };

    /**
     * The base implementation of `_.slice` without an iteratee call guard.
     *
     * @private
     * @param {Array} array The array to slice.
     * @param {number} [start=0] The start position.
     * @param {number} [end=array.length] The end position.
     * @returns {Array} Returns the slice of `array`.
     */
    function baseSlice(array, start, end) {
      var index = -1,
          length = array.length;

      start = start == null ? 0 : (+start || 0);
      if (start < 0) {
        start = -start > length ? 0 : (length + start);
      }
      end = (end === undefined || end > length) ? length : (+end || 0);
      if (end < 0) {
        end += length;
      }
      length = start > end ? 0 : ((end - start) >>> 0);
      start >>>= 0;

      var result = Array(length);
      while (++index < length) {
        result[index] = array[index + start];
      }
      return result;
    }

    /**
     * The base implementation of `_.some` without support for callback shorthands
     * and `this` binding.
     *
     * @private
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function} predicate The function invoked per iteration.
     * @returns {boolean} Returns `true` if any element passes the predicate check,
     *  else `false`.
     */
    function baseSome(collection, predicate) {
      var result;

      baseEach(collection, function(value, index, collection) {
        result = predicate(value, index, collection);
        return !result;
      });
      return !!result;
    }

    /**
     * The base implementation of `_.sortBy` which uses `comparer` to define
     * the sort order of `array` and replaces criteria objects with their
     * corresponding values.
     *
     * @private
     * @param {Array} array The array to sort.
     * @param {Function} comparer The function to define sort order.
     * @returns {Array} Returns `array`.
     */
    function baseSortBy(array, comparer) {
      var length = array.length;

      array.sort(comparer);
      while (length--) {
        array[length] = array[length].value;
      }
      return array;
    }

    /**
     * The base implementation of `_.sortByOrder` without param guards.
     *
     * @private
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function[]|Object[]|string[]} iteratees The iteratees to sort by.
     * @param {boolean[]} orders The sort orders of `iteratees`.
     * @returns {Array} Returns the new sorted array.
     */
    function baseSortByOrder(collection, iteratees, orders) {
      var callback = getCallback(),
          index = -1;

      iteratees = arrayMap(iteratees, function(iteratee) { return callback(iteratee); });

      var result = baseMap(collection, function(value) {
        var criteria = arrayMap(iteratees, function(iteratee) { return iteratee(value); });
        return { 'criteria': criteria, 'index': ++index, 'value': value };
      });

      return baseSortBy(result, function(object, other) {
        return compareMultiple(object, other, orders);
      });
    }

    /**
     * The base implementation of `_.sum` without support for callback shorthands
     * and `this` binding.
     *
     * @private
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {number} Returns the sum.
     */
    function baseSum(collection, iteratee) {
      var result = 0;
      baseEach(collection, function(value, index, collection) {
        result += +iteratee(value, index, collection) || 0;
      });
      return result;
    }

    /**
     * The base implementation of `_.uniq` without support for callback shorthands
     * and `this` binding.
     *
     * @private
     * @param {Array} array The array to inspect.
     * @param {Function} [iteratee] The function invoked per iteration.
     * @returns {Array} Returns the new duplicate-value-free array.
     */
    function baseUniq(array, iteratee) {
      var index = -1,
          indexOf = getIndexOf(),
          length = array.length,
          isCommon = indexOf == baseIndexOf,
          isLarge = isCommon && length >= LARGE_ARRAY_SIZE,
          seen = isLarge ? createCache() : null,
          result = [];

      if (seen) {
        indexOf = cacheIndexOf;
        isCommon = false;
      } else {
        isLarge = false;
        seen = iteratee ? [] : result;
      }
      outer:
      while (++index < length) {
        var value = array[index],
            computed = iteratee ? iteratee(value, index, array) : value;

        if (isCommon && value === value) {
          var seenIndex = seen.length;
          while (seenIndex--) {
            if (seen[seenIndex] === computed) {
              continue outer;
            }
          }
          if (iteratee) {
            seen.push(computed);
          }
          result.push(value);
        }
        else if (indexOf(seen, computed, 0) < 0) {
          if (iteratee || isLarge) {
            seen.push(computed);
          }
          result.push(value);
        }
      }
      return result;
    }

    /**
     * The base implementation of `_.values` and `_.valuesIn` which creates an
     * array of `object` property values corresponding to the property names
     * of `props`.
     *
     * @private
     * @param {Object} object The object to query.
     * @param {Array} props The property names to get values for.
     * @returns {Object} Returns the array of property values.
     */
    function baseValues(object, props) {
      var index = -1,
          length = props.length,
          result = Array(length);

      while (++index < length) {
        result[index] = object[props[index]];
      }
      return result;
    }

    /**
     * The base implementation of `_.dropRightWhile`, `_.dropWhile`, `_.takeRightWhile`,
     * and `_.takeWhile` without support for callback shorthands and `this` binding.
     *
     * @private
     * @param {Array} array The array to query.
     * @param {Function} predicate The function invoked per iteration.
     * @param {boolean} [isDrop] Specify dropping elements instead of taking them.
     * @param {boolean} [fromRight] Specify iterating from right to left.
     * @returns {Array} Returns the slice of `array`.
     */
    function baseWhile(array, predicate, isDrop, fromRight) {
      var length = array.length,
          index = fromRight ? length : -1;

      while ((fromRight ? index-- : ++index < length) && predicate(array[index], index, array)) {}
      return isDrop
        ? baseSlice(array, (fromRight ? 0 : index), (fromRight ? index + 1 : length))
        : baseSlice(array, (fromRight ? index + 1 : 0), (fromRight ? length : index));
    }

    /**
     * The base implementation of `wrapperValue` which returns the result of
     * performing a sequence of actions on the unwrapped `value`, where each
     * successive action is supplied the return value of the previous.
     *
     * @private
     * @param {*} value The unwrapped value.
     * @param {Array} actions Actions to peform to resolve the unwrapped value.
     * @returns {*} Returns the resolved value.
     */
    function baseWrapperValue(value, actions) {
      var result = value;
      if (result instanceof LazyWrapper) {
        result = result.value();
      }
      var index = -1,
          length = actions.length;

      while (++index < length) {
        var action = actions[index];
        result = action.func.apply(action.thisArg, arrayPush([result], action.args));
      }
      return result;
    }

    /**
     * Performs a binary search of `array` to determine the index at which `value`
     * should be inserted into `array` in order to maintain its sort order.
     *
     * @private
     * @param {Array} array The sorted array to inspect.
     * @param {*} value The value to evaluate.
     * @param {boolean} [retHighest] Specify returning the highest qualified index.
     * @returns {number} Returns the index at which `value` should be inserted
     *  into `array`.
     */
    function binaryIndex(array, value, retHighest) {
      var low = 0,
          high = array ? array.length : low;

      if (typeof value == 'number' && value === value && high <= HALF_MAX_ARRAY_LENGTH) {
        while (low < high) {
          var mid = (low + high) >>> 1,
              computed = array[mid];

          if ((retHighest ? (computed <= value) : (computed < value)) && computed !== null) {
            low = mid + 1;
          } else {
            high = mid;
          }
        }
        return high;
      }
      return binaryIndexBy(array, value, identity, retHighest);
    }

    /**
     * This function is like `binaryIndex` except that it invokes `iteratee` for
     * `value` and each element of `array` to compute their sort ranking. The
     * iteratee is invoked with one argument; (value).
     *
     * @private
     * @param {Array} array The sorted array to inspect.
     * @param {*} value The value to evaluate.
     * @param {Function} iteratee The function invoked per iteration.
     * @param {boolean} [retHighest] Specify returning the highest qualified index.
     * @returns {number} Returns the index at which `value` should be inserted
     *  into `array`.
     */
    function binaryIndexBy(array, value, iteratee, retHighest) {
      value = iteratee(value);

      var low = 0,
          high = array ? array.length : 0,
          valIsNaN = value !== value,
          valIsNull = value === null,
          valIsUndef = value === undefined;

      while (low < high) {
        var mid = nativeFloor((low + high) / 2),
            computed = iteratee(array[mid]),
            isDef = computed !== undefined,
            isReflexive = computed === computed;

        if (valIsNaN) {
          var setLow = isReflexive || retHighest;
        } else if (valIsNull) {
          setLow = isReflexive && isDef && (retHighest || computed != null);
        } else if (valIsUndef) {
          setLow = isReflexive && (retHighest || isDef);
        } else if (computed == null) {
          setLow = false;
        } else {
          setLow = retHighest ? (computed <= value) : (computed < value);
        }
        if (setLow) {
          low = mid + 1;
        } else {
          high = mid;
        }
      }
      return nativeMin(high, MAX_ARRAY_INDEX);
    }

    /**
     * A specialized version of `baseCallback` which only supports `this` binding
     * and specifying the number of arguments to provide to `func`.
     *
     * @private
     * @param {Function} func The function to bind.
     * @param {*} thisArg The `this` binding of `func`.
     * @param {number} [argCount] The number of arguments to provide to `func`.
     * @returns {Function} Returns the callback.
     */
    function bindCallback(func, thisArg, argCount) {
      if (typeof func != 'function') {
        return identity;
      }
      if (thisArg === undefined) {
        return func;
      }
      switch (argCount) {
        case 1: return function(value) {
          return func.call(thisArg, value);
        };
        case 3: return function(value, index, collection) {
          return func.call(thisArg, value, index, collection);
        };
        case 4: return function(accumulator, value, index, collection) {
          return func.call(thisArg, accumulator, value, index, collection);
        };
        case 5: return function(value, other, key, object, source) {
          return func.call(thisArg, value, other, key, object, source);
        };
      }
      return function() {
        return func.apply(thisArg, arguments);
      };
    }

    /**
     * Creates a clone of the given array buffer.
     *
     * @private
     * @param {ArrayBuffer} buffer The array buffer to clone.
     * @returns {ArrayBuffer} Returns the cloned array buffer.
     */
    function bufferClone(buffer) {
      var result = new ArrayBuffer(buffer.byteLength),
          view = new Uint8Array(result);

      view.set(new Uint8Array(buffer));
      return result;
    }

    /**
     * Creates an array that is the composition of partially applied arguments,
     * placeholders, and provided arguments into a single array of arguments.
     *
     * @private
     * @param {Array|Object} args The provided arguments.
     * @param {Array} partials The arguments to prepend to those provided.
     * @param {Array} holders The `partials` placeholder indexes.
     * @returns {Array} Returns the new array of composed arguments.
     */
    function composeArgs(args, partials, holders) {
      var holdersLength = holders.length,
          argsIndex = -1,
          argsLength = nativeMax(args.length - holdersLength, 0),
          leftIndex = -1,
          leftLength = partials.length,
          result = Array(leftLength + argsLength);

      while (++leftIndex < leftLength) {
        result[leftIndex] = partials[leftIndex];
      }
      while (++argsIndex < holdersLength) {
        result[holders[argsIndex]] = args[argsIndex];
      }
      while (argsLength--) {
        result[leftIndex++] = args[argsIndex++];
      }
      return result;
    }

    /**
     * This function is like `composeArgs` except that the arguments composition
     * is tailored for `_.partialRight`.
     *
     * @private
     * @param {Array|Object} args The provided arguments.
     * @param {Array} partials The arguments to append to those provided.
     * @param {Array} holders The `partials` placeholder indexes.
     * @returns {Array} Returns the new array of composed arguments.
     */
    function composeArgsRight(args, partials, holders) {
      var holdersIndex = -1,
          holdersLength = holders.length,
          argsIndex = -1,
          argsLength = nativeMax(args.length - holdersLength, 0),
          rightIndex = -1,
          rightLength = partials.length,
          result = Array(argsLength + rightLength);

      while (++argsIndex < argsLength) {
        result[argsIndex] = args[argsIndex];
      }
      var offset = argsIndex;
      while (++rightIndex < rightLength) {
        result[offset + rightIndex] = partials[rightIndex];
      }
      while (++holdersIndex < holdersLength) {
        result[offset + holders[holdersIndex]] = args[argsIndex++];
      }
      return result;
    }

    /**
     * Creates a `_.countBy`, `_.groupBy`, `_.indexBy`, or `_.partition` function.
     *
     * @private
     * @param {Function} setter The function to set keys and values of the accumulator object.
     * @param {Function} [initializer] The function to initialize the accumulator object.
     * @returns {Function} Returns the new aggregator function.
     */
    function createAggregator(setter, initializer) {
      return function(collection, iteratee, thisArg) {
        var result = initializer ? initializer() : {};
        iteratee = getCallback(iteratee, thisArg, 3);

        if (isArray(collection)) {
          var index = -1,
              length = collection.length;

          while (++index < length) {
            var value = collection[index];
            setter(result, value, iteratee(value, index, collection), collection);
          }
        } else {
          baseEach(collection, function(value, key, collection) {
            setter(result, value, iteratee(value, key, collection), collection);
          });
        }
        return result;
      };
    }

    /**
     * Creates a `_.assign`, `_.defaults`, or `_.merge` function.
     *
     * @private
     * @param {Function} assigner The function to assign values.
     * @returns {Function} Returns the new assigner function.
     */
    function createAssigner(assigner) {
      return restParam(function(object, sources) {
        var index = -1,
            length = object == null ? 0 : sources.length,
            customizer = length > 2 ? sources[length - 2] : undefined,
            guard = length > 2 ? sources[2] : undefined,
            thisArg = length > 1 ? sources[length - 1] : undefined;

        if (typeof customizer == 'function') {
          customizer = bindCallback(customizer, thisArg, 5);
          length -= 2;
        } else {
          customizer = typeof thisArg == 'function' ? thisArg : undefined;
          length -= (customizer ? 1 : 0);
        }
        if (guard && isIterateeCall(sources[0], sources[1], guard)) {
          customizer = length < 3 ? undefined : customizer;
          length = 1;
        }
        while (++index < length) {
          var source = sources[index];
          if (source) {
            assigner(object, source, customizer);
          }
        }
        return object;
      });
    }

    /**
     * Creates a `baseEach` or `baseEachRight` function.
     *
     * @private
     * @param {Function} eachFunc The function to iterate over a collection.
     * @param {boolean} [fromRight] Specify iterating from right to left.
     * @returns {Function} Returns the new base function.
     */
    function createBaseEach(eachFunc, fromRight) {
      return function(collection, iteratee) {
        var length = collection ? getLength(collection) : 0;
        if (!isLength(length)) {
          return eachFunc(collection, iteratee);
        }
        var index = fromRight ? length : -1,
            iterable = toObject(collection);

        while ((fromRight ? index-- : ++index < length)) {
          if (iteratee(iterable[index], index, iterable) === false) {
            break;
          }
        }
        return collection;
      };
    }

    /**
     * Creates a base function for `_.forIn` or `_.forInRight`.
     *
     * @private
     * @param {boolean} [fromRight] Specify iterating from right to left.
     * @returns {Function} Returns the new base function.
     */
    function createBaseFor(fromRight) {
      return function(object, iteratee, keysFunc) {
        var iterable = toObject(object),
            props = keysFunc(object),
            length = props.length,
            index = fromRight ? length : -1;

        while ((fromRight ? index-- : ++index < length)) {
          var key = props[index];
          if (iteratee(iterable[key], key, iterable) === false) {
            break;
          }
        }
        return object;
      };
    }

    /**
     * Creates a function that wraps `func` and invokes it with the `this`
     * binding of `thisArg`.
     *
     * @private
     * @param {Function} func The function to bind.
     * @param {*} [thisArg] The `this` binding of `func`.
     * @returns {Function} Returns the new bound function.
     */
    function createBindWrapper(func, thisArg) {
      var Ctor = createCtorWrapper(func);

      function wrapper() {
        var fn = (this && this !== root && this instanceof wrapper) ? Ctor : func;
        return fn.apply(thisArg, arguments);
      }
      return wrapper;
    }

    /**
     * Creates a `Set` cache object to optimize linear searches of large arrays.
     *
     * @private
     * @param {Array} [values] The values to cache.
     * @returns {null|Object} Returns the new cache object if `Set` is supported, else `null`.
     */
    function createCache(values) {
      return (nativeCreate && Set) ? new SetCache(values) : null;
    }

    /**
     * Creates a function that produces compound words out of the words in a
     * given string.
     *
     * @private
     * @param {Function} callback The function to combine each word.
     * @returns {Function} Returns the new compounder function.
     */
    function createCompounder(callback) {
      return function(string) {
        var index = -1,
            array = words(deburr(string)),
            length = array.length,
            result = '';

        while (++index < length) {
          result = callback(result, array[index], index);
        }
        return result;
      };
    }

    /**
     * Creates a function that produces an instance of `Ctor` regardless of
     * whether it was invoked as part of a `new` expression or by `call` or `apply`.
     *
     * @private
     * @param {Function} Ctor The constructor to wrap.
     * @returns {Function} Returns the new wrapped function.
     */
    function createCtorWrapper(Ctor) {
      return function() {
        // Use a `switch` statement to work with class constructors.
        // See http://ecma-international.org/ecma-262/6.0/#sec-ecmascript-function-objects-call-thisargument-argumentslist
        // for more details.
        var args = arguments;
        switch (args.length) {
          case 0: return new Ctor;
          case 1: return new Ctor(args[0]);
          case 2: return new Ctor(args[0], args[1]);
          case 3: return new Ctor(args[0], args[1], args[2]);
          case 4: return new Ctor(args[0], args[1], args[2], args[3]);
          case 5: return new Ctor(args[0], args[1], args[2], args[3], args[4]);
          case 6: return new Ctor(args[0], args[1], args[2], args[3], args[4], args[5]);
          case 7: return new Ctor(args[0], args[1], args[2], args[3], args[4], args[5], args[6]);
        }
        var thisBinding = baseCreate(Ctor.prototype),
            result = Ctor.apply(thisBinding, args);

        // Mimic the constructor's `return` behavior.
        // See https://es5.github.io/#x13.2.2 for more details.
        return isObject(result) ? result : thisBinding;
      };
    }

    /**
     * Creates a `_.curry` or `_.curryRight` function.
     *
     * @private
     * @param {boolean} flag The curry bit flag.
     * @returns {Function} Returns the new curry function.
     */
    function createCurry(flag) {
      function curryFunc(func, arity, guard) {
        if (guard && isIterateeCall(func, arity, guard)) {
          arity = undefined;
        }
        var result = createWrapper(func, flag, undefined, undefined, undefined, undefined, undefined, arity);
        result.placeholder = curryFunc.placeholder;
        return result;
      }
      return curryFunc;
    }

    /**
     * Creates a `_.defaults` or `_.defaultsDeep` function.
     *
     * @private
     * @param {Function} assigner The function to assign values.
     * @param {Function} customizer The function to customize assigned values.
     * @returns {Function} Returns the new defaults function.
     */
    function createDefaults(assigner, customizer) {
      return restParam(function(args) {
        var object = args[0];
        if (object == null) {
          return object;
        }
        args.push(customizer);
        return assigner.apply(undefined, args);
      });
    }

    /**
     * Creates a `_.max` or `_.min` function.
     *
     * @private
     * @param {Function} comparator The function used to compare values.
     * @param {*} exValue The initial extremum value.
     * @returns {Function} Returns the new extremum function.
     */
    function createExtremum(comparator, exValue) {
      return function(collection, iteratee, thisArg) {
        if (thisArg && isIterateeCall(collection, iteratee, thisArg)) {
          iteratee = undefined;
        }
        iteratee = getCallback(iteratee, thisArg, 3);
        if (iteratee.length == 1) {
          collection = isArray(collection) ? collection : toIterable(collection);
          var result = arrayExtremum(collection, iteratee, comparator, exValue);
          if (!(collection.length && result === exValue)) {
            return result;
          }
        }
        return baseExtremum(collection, iteratee, comparator, exValue);
      };
    }

    /**
     * Creates a `_.find` or `_.findLast` function.
     *
     * @private
     * @param {Function} eachFunc The function to iterate over a collection.
     * @param {boolean} [fromRight] Specify iterating from right to left.
     * @returns {Function} Returns the new find function.
     */
    function createFind(eachFunc, fromRight) {
      return function(collection, predicate, thisArg) {
        predicate = getCallback(predicate, thisArg, 3);
        if (isArray(collection)) {
          var index = baseFindIndex(collection, predicate, fromRight);
          return index > -1 ? collection[index] : undefined;
        }
        return baseFind(collection, predicate, eachFunc);
      };
    }

    /**
     * Creates a `_.findIndex` or `_.findLastIndex` function.
     *
     * @private
     * @param {boolean} [fromRight] Specify iterating from right to left.
     * @returns {Function} Returns the new find function.
     */
    function createFindIndex(fromRight) {
      return function(array, predicate, thisArg) {
        if (!(array && array.length)) {
          return -1;
        }
        predicate = getCallback(predicate, thisArg, 3);
        return baseFindIndex(array, predicate, fromRight);
      };
    }

    /**
     * Creates a `_.findKey` or `_.findLastKey` function.
     *
     * @private
     * @param {Function} objectFunc The function to iterate over an object.
     * @returns {Function} Returns the new find function.
     */
    function createFindKey(objectFunc) {
      return function(object, predicate, thisArg) {
        predicate = getCallback(predicate, thisArg, 3);
        return baseFind(object, predicate, objectFunc, true);
      };
    }

    /**
     * Creates a `_.flow` or `_.flowRight` function.
     *
     * @private
     * @param {boolean} [fromRight] Specify iterating from right to left.
     * @returns {Function} Returns the new flow function.
     */
    function createFlow(fromRight) {
      return function() {
        var wrapper,
            length = arguments.length,
            index = fromRight ? length : -1,
            leftIndex = 0,
            funcs = Array(length);

        while ((fromRight ? index-- : ++index < length)) {
          var func = funcs[leftIndex++] = arguments[index];
          if (typeof func != 'function') {
            throw new TypeError(FUNC_ERROR_TEXT);
          }
          if (!wrapper && LodashWrapper.prototype.thru && getFuncName(func) == 'wrapper') {
            wrapper = new LodashWrapper([], true);
          }
        }
        index = wrapper ? -1 : length;
        while (++index < length) {
          func = funcs[index];

          var funcName = getFuncName(func),
              data = funcName == 'wrapper' ? getData(func) : undefined;

          if (data && isLaziable(data[0]) && data[1] == (ARY_FLAG | CURRY_FLAG | PARTIAL_FLAG | REARG_FLAG) && !data[4].length && data[9] == 1) {
            wrapper = wrapper[getFuncName(data[0])].apply(wrapper, data[3]);
          } else {
            wrapper = (func.length == 1 && isLaziable(func)) ? wrapper[funcName]() : wrapper.thru(func);
          }
        }
        return function() {
          var args = arguments,
              value = args[0];

          if (wrapper && args.length == 1 && isArray(value) && value.length >= LARGE_ARRAY_SIZE) {
            return wrapper.plant(value).value();
          }
          var index = 0,
              result = length ? funcs[index].apply(this, args) : value;

          while (++index < length) {
            result = funcs[index].call(this, result);
          }
          return result;
        };
      };
    }

    /**
     * Creates a function for `_.forEach` or `_.forEachRight`.
     *
     * @private
     * @param {Function} arrayFunc The function to iterate over an array.
     * @param {Function} eachFunc The function to iterate over a collection.
     * @returns {Function} Returns the new each function.
     */
    function createForEach(arrayFunc, eachFunc) {
      return function(collection, iteratee, thisArg) {
        return (typeof iteratee == 'function' && thisArg === undefined && isArray(collection))
          ? arrayFunc(collection, iteratee)
          : eachFunc(collection, bindCallback(iteratee, thisArg, 3));
      };
    }

    /**
     * Creates a function for `_.forIn` or `_.forInRight`.
     *
     * @private
     * @param {Function} objectFunc The function to iterate over an object.
     * @returns {Function} Returns the new each function.
     */
    function createForIn(objectFunc) {
      return function(object, iteratee, thisArg) {
        if (typeof iteratee != 'function' || thisArg !== undefined) {
          iteratee = bindCallback(iteratee, thisArg, 3);
        }
        return objectFunc(object, iteratee, keysIn);
      };
    }

    /**
     * Creates a function for `_.forOwn` or `_.forOwnRight`.
     *
     * @private
     * @param {Function} objectFunc The function to iterate over an object.
     * @returns {Function} Returns the new each function.
     */
    function createForOwn(objectFunc) {
      return function(object, iteratee, thisArg) {
        if (typeof iteratee != 'function' || thisArg !== undefined) {
          iteratee = bindCallback(iteratee, thisArg, 3);
        }
        return objectFunc(object, iteratee);
      };
    }

    /**
     * Creates a function for `_.mapKeys` or `_.mapValues`.
     *
     * @private
     * @param {boolean} [isMapKeys] Specify mapping keys instead of values.
     * @returns {Function} Returns the new map function.
     */
    function createObjectMapper(isMapKeys) {
      return function(object, iteratee, thisArg) {
        var result = {};
        iteratee = getCallback(iteratee, thisArg, 3);

        baseForOwn(object, function(value, key, object) {
          var mapped = iteratee(value, key, object);
          key = isMapKeys ? mapped : key;
          value = isMapKeys ? value : mapped;
          result[key] = value;
        });
        return result;
      };
    }

    /**
     * Creates a function for `_.padLeft` or `_.padRight`.
     *
     * @private
     * @param {boolean} [fromRight] Specify padding from the right.
     * @returns {Function} Returns the new pad function.
     */
    function createPadDir(fromRight) {
      return function(string, length, chars) {
        string = baseToString(string);
        return (fromRight ? string : '') + createPadding(string, length, chars) + (fromRight ? '' : string);
      };
    }

    /**
     * Creates a `_.partial` or `_.partialRight` function.
     *
     * @private
     * @param {boolean} flag The partial bit flag.
     * @returns {Function} Returns the new partial function.
     */
    function createPartial(flag) {
      var partialFunc = restParam(function(func, partials) {
        var holders = replaceHolders(partials, partialFunc.placeholder);
        return createWrapper(func, flag, undefined, partials, holders);
      });
      return partialFunc;
    }

    /**
     * Creates a function for `_.reduce` or `_.reduceRight`.
     *
     * @private
     * @param {Function} arrayFunc The function to iterate over an array.
     * @param {Function} eachFunc The function to iterate over a collection.
     * @returns {Function} Returns the new each function.
     */
    function createReduce(arrayFunc, eachFunc) {
      return function(collection, iteratee, accumulator, thisArg) {
        var initFromArray = arguments.length < 3;
        return (typeof iteratee == 'function' && thisArg === undefined && isArray(collection))
          ? arrayFunc(collection, iteratee, accumulator, initFromArray)
          : baseReduce(collection, getCallback(iteratee, thisArg, 4), accumulator, initFromArray, eachFunc);
      };
    }

    /**
     * Creates a function that wraps `func` and invokes it with optional `this`
     * binding of, partial application, and currying.
     *
     * @private
     * @param {Function|string} func The function or method name to reference.
     * @param {number} bitmask The bitmask of flags. See `createWrapper` for more details.
     * @param {*} [thisArg] The `this` binding of `func`.
     * @param {Array} [partials] The arguments to prepend to those provided to the new function.
     * @param {Array} [holders] The `partials` placeholder indexes.
     * @param {Array} [partialsRight] The arguments to append to those provided to the new function.
     * @param {Array} [holdersRight] The `partialsRight` placeholder indexes.
     * @param {Array} [argPos] The argument positions of the new function.
     * @param {number} [ary] The arity cap of `func`.
     * @param {number} [arity] The arity of `func`.
     * @returns {Function} Returns the new wrapped function.
     */
    function createHybridWrapper(func, bitmask, thisArg, partials, holders, partialsRight, holdersRight, argPos, ary, arity) {
      var isAry = bitmask & ARY_FLAG,
          isBind = bitmask & BIND_FLAG,
          isBindKey = bitmask & BIND_KEY_FLAG,
          isCurry = bitmask & CURRY_FLAG,
          isCurryBound = bitmask & CURRY_BOUND_FLAG,
          isCurryRight = bitmask & CURRY_RIGHT_FLAG,
          Ctor = isBindKey ? undefined : createCtorWrapper(func);

      function wrapper() {
        // Avoid `arguments` object use disqualifying optimizations by
        // converting it to an array before providing it to other functions.
        var length = arguments.length,
            index = length,
            args = Array(length);

        while (index--) {
          args[index] = arguments[index];
        }
        if (partials) {
          args = composeArgs(args, partials, holders);
        }
        if (partialsRight) {
          args = composeArgsRight(args, partialsRight, holdersRight);
        }
        if (isCurry || isCurryRight) {
          var placeholder = wrapper.placeholder,
              argsHolders = replaceHolders(args, placeholder);

          length -= argsHolders.length;
          if (length < arity) {
            var newArgPos = argPos ? arrayCopy(argPos) : undefined,
                newArity = nativeMax(arity - length, 0),
                newsHolders = isCurry ? argsHolders : undefined,
                newHoldersRight = isCurry ? undefined : argsHolders,
                newPartials = isCurry ? args : undefined,
                newPartialsRight = isCurry ? undefined : args;

            bitmask |= (isCurry ? PARTIAL_FLAG : PARTIAL_RIGHT_FLAG);
            bitmask &= ~(isCurry ? PARTIAL_RIGHT_FLAG : PARTIAL_FLAG);

            if (!isCurryBound) {
              bitmask &= ~(BIND_FLAG | BIND_KEY_FLAG);
            }
            var newData = [func, bitmask, thisArg, newPartials, newsHolders, newPartialsRight, newHoldersRight, newArgPos, ary, newArity],
                result = createHybridWrapper.apply(undefined, newData);

            if (isLaziable(func)) {
              setData(result, newData);
            }
            result.placeholder = placeholder;
            return result;
          }
        }
        var thisBinding = isBind ? thisArg : this,
            fn = isBindKey ? thisBinding[func] : func;

        if (argPos) {
          args = reorder(args, argPos);
        }
        if (isAry && ary < args.length) {
          args.length = ary;
        }
        if (this && this !== root && this instanceof wrapper) {
          fn = Ctor || createCtorWrapper(func);
        }
        return fn.apply(thisBinding, args);
      }
      return wrapper;
    }

    /**
     * Creates the padding required for `string` based on the given `length`.
     * The `chars` string is truncated if the number of characters exceeds `length`.
     *
     * @private
     * @param {string} string The string to create padding for.
     * @param {number} [length=0] The padding length.
     * @param {string} [chars=' '] The string used as padding.
     * @returns {string} Returns the pad for `string`.
     */
    function createPadding(string, length, chars) {
      var strLength = string.length;
      length = +length;

      if (strLength >= length || !nativeIsFinite(length)) {
        return '';
      }
      var padLength = length - strLength;
      chars = chars == null ? ' ' : (chars + '');
      return repeat(chars, nativeCeil(padLength / chars.length)).slice(0, padLength);
    }

    /**
     * Creates a function that wraps `func` and invokes it with the optional `this`
     * binding of `thisArg` and the `partials` prepended to those provided to
     * the wrapper.
     *
     * @private
     * @param {Function} func The function to partially apply arguments to.
     * @param {number} bitmask The bitmask of flags. See `createWrapper` for more details.
     * @param {*} thisArg The `this` binding of `func`.
     * @param {Array} partials The arguments to prepend to those provided to the new function.
     * @returns {Function} Returns the new bound function.
     */
    function createPartialWrapper(func, bitmask, thisArg, partials) {
      var isBind = bitmask & BIND_FLAG,
          Ctor = createCtorWrapper(func);

      function wrapper() {
        // Avoid `arguments` object use disqualifying optimizations by
        // converting it to an array before providing it `func`.
        var argsIndex = -1,
            argsLength = arguments.length,
            leftIndex = -1,
            leftLength = partials.length,
            args = Array(leftLength + argsLength);

        while (++leftIndex < leftLength) {
          args[leftIndex] = partials[leftIndex];
        }
        while (argsLength--) {
          args[leftIndex++] = arguments[++argsIndex];
        }
        var fn = (this && this !== root && this instanceof wrapper) ? Ctor : func;
        return fn.apply(isBind ? thisArg : this, args);
      }
      return wrapper;
    }

    /**
     * Creates a `_.ceil`, `_.floor`, or `_.round` function.
     *
     * @private
     * @param {string} methodName The name of the `Math` method to use when rounding.
     * @returns {Function} Returns the new round function.
     */
    function createRound(methodName) {
      var func = Math[methodName];
      return function(number, precision) {
        precision = precision === undefined ? 0 : (+precision || 0);
        if (precision) {
          precision = pow(10, precision);
          return func(number * precision) / precision;
        }
        return func(number);
      };
    }

    /**
     * Creates a `_.sortedIndex` or `_.sortedLastIndex` function.
     *
     * @private
     * @param {boolean} [retHighest] Specify returning the highest qualified index.
     * @returns {Function} Returns the new index function.
     */
    function createSortedIndex(retHighest) {
      return function(array, value, iteratee, thisArg) {
        var callback = getCallback(iteratee);
        return (iteratee == null && callback === baseCallback)
          ? binaryIndex(array, value, retHighest)
          : binaryIndexBy(array, value, callback(iteratee, thisArg, 1), retHighest);
      };
    }

    /**
     * Creates a function that either curries or invokes `func` with optional
     * `this` binding and partially applied arguments.
     *
     * @private
     * @param {Function|string} func The function or method name to reference.
     * @param {number} bitmask The bitmask of flags.
     *  The bitmask may be composed of the following flags:
     *     1 - `_.bind`
     *     2 - `_.bindKey`
     *     4 - `_.curry` or `_.curryRight` of a bound function
     *     8 - `_.curry`
     *    16 - `_.curryRight`
     *    32 - `_.partial`
     *    64 - `_.partialRight`
     *   128 - `_.rearg`
     *   256 - `_.ary`
     * @param {*} [thisArg] The `this` binding of `func`.
     * @param {Array} [partials] The arguments to be partially applied.
     * @param {Array} [holders] The `partials` placeholder indexes.
     * @param {Array} [argPos] The argument positions of the new function.
     * @param {number} [ary] The arity cap of `func`.
     * @param {number} [arity] The arity of `func`.
     * @returns {Function} Returns the new wrapped function.
     */
    function createWrapper(func, bitmask, thisArg, partials, holders, argPos, ary, arity) {
      var isBindKey = bitmask & BIND_KEY_FLAG;
      if (!isBindKey && typeof func != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      var length = partials ? partials.length : 0;
      if (!length) {
        bitmask &= ~(PARTIAL_FLAG | PARTIAL_RIGHT_FLAG);
        partials = holders = undefined;
      }
      length -= (holders ? holders.length : 0);
      if (bitmask & PARTIAL_RIGHT_FLAG) {
        var partialsRight = partials,
            holdersRight = holders;

        partials = holders = undefined;
      }
      var data = isBindKey ? undefined : getData(func),
          newData = [func, bitmask, thisArg, partials, holders, partialsRight, holdersRight, argPos, ary, arity];

      if (data) {
        mergeData(newData, data);
        bitmask = newData[1];
        arity = newData[9];
      }
      newData[9] = arity == null
        ? (isBindKey ? 0 : func.length)
        : (nativeMax(arity - length, 0) || 0);

      if (bitmask == BIND_FLAG) {
        var result = createBindWrapper(newData[0], newData[2]);
      } else if ((bitmask == PARTIAL_FLAG || bitmask == (BIND_FLAG | PARTIAL_FLAG)) && !newData[4].length) {
        result = createPartialWrapper.apply(undefined, newData);
      } else {
        result = createHybridWrapper.apply(undefined, newData);
      }
      var setter = data ? baseSetData : setData;
      return setter(result, newData);
    }

    /**
     * A specialized version of `baseIsEqualDeep` for arrays with support for
     * partial deep comparisons.
     *
     * @private
     * @param {Array} array The array to compare.
     * @param {Array} other The other array to compare.
     * @param {Function} equalFunc The function to determine equivalents of values.
     * @param {Function} [customizer] The function to customize comparing arrays.
     * @param {boolean} [isLoose] Specify performing partial comparisons.
     * @param {Array} [stackA] Tracks traversed `value` objects.
     * @param {Array} [stackB] Tracks traversed `other` objects.
     * @returns {boolean} Returns `true` if the arrays are equivalent, else `false`.
     */
    function equalArrays(array, other, equalFunc, customizer, isLoose, stackA, stackB) {
      var index = -1,
          arrLength = array.length,
          othLength = other.length;

      if (arrLength != othLength && !(isLoose && othLength > arrLength)) {
        return false;
      }
      // Ignore non-index properties.
      while (++index < arrLength) {
        var arrValue = array[index],
            othValue = other[index],
            result = customizer ? customizer(isLoose ? othValue : arrValue, isLoose ? arrValue : othValue, index) : undefined;

        if (result !== undefined) {
          if (result) {
            continue;
          }
          return false;
        }
        // Recursively compare arrays (susceptible to call stack limits).
        if (isLoose) {
          if (!arraySome(other, function(othValue) {
                return arrValue === othValue || equalFunc(arrValue, othValue, customizer, isLoose, stackA, stackB);
              })) {
            return false;
          }
        } else if (!(arrValue === othValue || equalFunc(arrValue, othValue, customizer, isLoose, stackA, stackB))) {
          return false;
        }
      }
      return true;
    }

    /**
     * A specialized version of `baseIsEqualDeep` for comparing objects of
     * the same `toStringTag`.
     *
     * **Note:** This function only supports comparing values with tags of
     * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
     *
     * @private
     * @param {Object} object The object to compare.
     * @param {Object} other The other object to compare.
     * @param {string} tag The `toStringTag` of the objects to compare.
     * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
     */
    function equalByTag(object, other, tag) {
      switch (tag) {
        case boolTag:
        case dateTag:
          // Coerce dates and booleans to numbers, dates to milliseconds and booleans
          // to `1` or `0` treating invalid dates coerced to `NaN` as not equal.
          return +object == +other;

        case errorTag:
          return object.name == other.name && object.message == other.message;

        case numberTag:
          // Treat `NaN` vs. `NaN` as equal.
          return (object != +object)
            ? other != +other
            : object == +other;

        case regexpTag:
        case stringTag:
          // Coerce regexes to strings and treat strings primitives and string
          // objects as equal. See https://es5.github.io/#x15.10.6.4 for more details.
          return object == (other + '');
      }
      return false;
    }

    /**
     * A specialized version of `baseIsEqualDeep` for objects with support for
     * partial deep comparisons.
     *
     * @private
     * @param {Object} object The object to compare.
     * @param {Object} other The other object to compare.
     * @param {Function} equalFunc The function to determine equivalents of values.
     * @param {Function} [customizer] The function to customize comparing values.
     * @param {boolean} [isLoose] Specify performing partial comparisons.
     * @param {Array} [stackA] Tracks traversed `value` objects.
     * @param {Array} [stackB] Tracks traversed `other` objects.
     * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
     */
    function equalObjects(object, other, equalFunc, customizer, isLoose, stackA, stackB) {
      var objProps = keys(object),
          objLength = objProps.length,
          othProps = keys(other),
          othLength = othProps.length;

      if (objLength != othLength && !isLoose) {
        return false;
      }
      var index = objLength;
      while (index--) {
        var key = objProps[index];
        if (!(isLoose ? key in other : hasOwnProperty.call(other, key))) {
          return false;
        }
      }
      var skipCtor = isLoose;
      while (++index < objLength) {
        key = objProps[index];
        var objValue = object[key],
            othValue = other[key],
            result = customizer ? customizer(isLoose ? othValue : objValue, isLoose? objValue : othValue, key) : undefined;

        // Recursively compare objects (susceptible to call stack limits).
        if (!(result === undefined ? equalFunc(objValue, othValue, customizer, isLoose, stackA, stackB) : result)) {
          return false;
        }
        skipCtor || (skipCtor = key == 'constructor');
      }
      if (!skipCtor) {
        var objCtor = object.constructor,
            othCtor = other.constructor;

        // Non `Object` object instances with different constructors are not equal.
        if (objCtor != othCtor &&
            ('constructor' in object && 'constructor' in other) &&
            !(typeof objCtor == 'function' && objCtor instanceof objCtor &&
              typeof othCtor == 'function' && othCtor instanceof othCtor)) {
          return false;
        }
      }
      return true;
    }

    /**
     * Gets the appropriate "callback" function. If the `_.callback` method is
     * customized this function returns the custom method, otherwise it returns
     * the `baseCallback` function. If arguments are provided the chosen function
     * is invoked with them and its result is returned.
     *
     * @private
     * @returns {Function} Returns the chosen function or its result.
     */
    function getCallback(func, thisArg, argCount) {
      var result = lodash.callback || callback;
      result = result === callback ? baseCallback : result;
      return argCount ? result(func, thisArg, argCount) : result;
    }

    /**
     * Gets metadata for `func`.
     *
     * @private
     * @param {Function} func The function to query.
     * @returns {*} Returns the metadata for `func`.
     */
    var getData = !metaMap ? noop : function(func) {
      return metaMap.get(func);
    };

    /**
     * Gets the name of `func`.
     *
     * @private
     * @param {Function} func The function to query.
     * @returns {string} Returns the function name.
     */
    function getFuncName(func) {
      var result = func.name,
          array = realNames[result],
          length = array ? array.length : 0;

      while (length--) {
        var data = array[length],
            otherFunc = data.func;
        if (otherFunc == null || otherFunc == func) {
          return data.name;
        }
      }
      return result;
    }

    /**
     * Gets the appropriate "indexOf" function. If the `_.indexOf` method is
     * customized this function returns the custom method, otherwise it returns
     * the `baseIndexOf` function. If arguments are provided the chosen function
     * is invoked with them and its result is returned.
     *
     * @private
     * @returns {Function|number} Returns the chosen function or its result.
     */
    function getIndexOf(collection, target, fromIndex) {
      var result = lodash.indexOf || indexOf;
      result = result === indexOf ? baseIndexOf : result;
      return collection ? result(collection, target, fromIndex) : result;
    }

    /**
     * Gets the "length" property value of `object`.
     *
     * **Note:** This function is used to avoid a [JIT bug](https://bugs.webkit.org/show_bug.cgi?id=142792)
     * that affects Safari on at least iOS 8.1-8.3 ARM64.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {*} Returns the "length" value.
     */
    var getLength = baseProperty('length');

    /**
     * Gets the propery names, values, and compare flags of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {Array} Returns the match data of `object`.
     */
    function getMatchData(object) {
      var result = pairs(object),
          length = result.length;

      while (length--) {
        result[length][2] = isStrictComparable(result[length][1]);
      }
      return result;
    }

    /**
     * Gets the native function at `key` of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @param {string} key The key of the method to get.
     * @returns {*} Returns the function if it's native, else `undefined`.
     */
    function getNative(object, key) {
      var value = object == null ? undefined : object[key];
      return isNative(value) ? value : undefined;
    }

    /**
     * Gets the view, applying any `transforms` to the `start` and `end` positions.
     *
     * @private
     * @param {number} start The start of the view.
     * @param {number} end The end of the view.
     * @param {Array} transforms The transformations to apply to the view.
     * @returns {Object} Returns an object containing the `start` and `end`
     *  positions of the view.
     */
    function getView(start, end, transforms) {
      var index = -1,
          length = transforms.length;

      while (++index < length) {
        var data = transforms[index],
            size = data.size;

        switch (data.type) {
          case 'drop':      start += size; break;
          case 'dropRight': end -= size; break;
          case 'take':      end = nativeMin(end, start + size); break;
          case 'takeRight': start = nativeMax(start, end - size); break;
        }
      }
      return { 'start': start, 'end': end };
    }

    /**
     * Initializes an array clone.
     *
     * @private
     * @param {Array} array The array to clone.
     * @returns {Array} Returns the initialized clone.
     */
    function initCloneArray(array) {
      var length = array.length,
          result = new array.constructor(length);

      // Add array properties assigned by `RegExp#exec`.
      if (length && typeof array[0] == 'string' && hasOwnProperty.call(array, 'index')) {
        result.index = array.index;
        result.input = array.input;
      }
      return result;
    }

    /**
     * Initializes an object clone.
     *
     * @private
     * @param {Object} object The object to clone.
     * @returns {Object} Returns the initialized clone.
     */
    function initCloneObject(object) {
      var Ctor = object.constructor;
      if (!(typeof Ctor == 'function' && Ctor instanceof Ctor)) {
        Ctor = Object;
      }
      return new Ctor;
    }

    /**
     * Initializes an object clone based on its `toStringTag`.
     *
     * **Note:** This function only supports cloning values with tags of
     * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
     *
     * @private
     * @param {Object} object The object to clone.
     * @param {string} tag The `toStringTag` of the object to clone.
     * @param {boolean} [isDeep] Specify a deep clone.
     * @returns {Object} Returns the initialized clone.
     */
    function initCloneByTag(object, tag, isDeep) {
      var Ctor = object.constructor;
      switch (tag) {
        case arrayBufferTag:
          return bufferClone(object);

        case boolTag:
        case dateTag:
          return new Ctor(+object);

        case float32Tag: case float64Tag:
        case int8Tag: case int16Tag: case int32Tag:
        case uint8Tag: case uint8ClampedTag: case uint16Tag: case uint32Tag:
          var buffer = object.buffer;
          return new Ctor(isDeep ? bufferClone(buffer) : buffer, object.byteOffset, object.length);

        case numberTag:
        case stringTag:
          return new Ctor(object);

        case regexpTag:
          var result = new Ctor(object.source, reFlags.exec(object));
          result.lastIndex = object.lastIndex;
      }
      return result;
    }

    /**
     * Invokes the method at `path` on `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @param {Array|string} path The path of the method to invoke.
     * @param {Array} args The arguments to invoke the method with.
     * @returns {*} Returns the result of the invoked method.
     */
    function invokePath(object, path, args) {
      if (object != null && !isKey(path, object)) {
        path = toPath(path);
        object = path.length == 1 ? object : baseGet(object, baseSlice(path, 0, -1));
        path = last(path);
      }
      var func = object == null ? object : object[path];
      return func == null ? undefined : func.apply(object, args);
    }

    /**
     * Checks if `value` is array-like.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
     */
    function isArrayLike(value) {
      return value != null && isLength(getLength(value));
    }

    /**
     * Checks if `value` is a valid array-like index.
     *
     * @private
     * @param {*} value The value to check.
     * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
     * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
     */
    function isIndex(value, length) {
      value = (typeof value == 'number' || reIsUint.test(value)) ? +value : -1;
      length = length == null ? MAX_SAFE_INTEGER : length;
      return value > -1 && value % 1 == 0 && value < length;
    }

    /**
     * Checks if the provided arguments are from an iteratee call.
     *
     * @private
     * @param {*} value The potential iteratee value argument.
     * @param {*} index The potential iteratee index or key argument.
     * @param {*} object The potential iteratee object argument.
     * @returns {boolean} Returns `true` if the arguments are from an iteratee call, else `false`.
     */
    function isIterateeCall(value, index, object) {
      if (!isObject(object)) {
        return false;
      }
      var type = typeof index;
      if (type == 'number'
          ? (isArrayLike(object) && isIndex(index, object.length))
          : (type == 'string' && index in object)) {
        var other = object[index];
        return value === value ? (value === other) : (other !== other);
      }
      return false;
    }

    /**
     * Checks if `value` is a property name and not a property path.
     *
     * @private
     * @param {*} value The value to check.
     * @param {Object} [object] The object to query keys on.
     * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
     */
    function isKey(value, object) {
      var type = typeof value;
      if ((type == 'string' && reIsPlainProp.test(value)) || type == 'number') {
        return true;
      }
      if (isArray(value)) {
        return false;
      }
      var result = !reIsDeepProp.test(value);
      return result || (object != null && value in toObject(object));
    }

    /**
     * Checks if `func` has a lazy counterpart.
     *
     * @private
     * @param {Function} func The function to check.
     * @returns {boolean} Returns `true` if `func` has a lazy counterpart, else `false`.
     */
    function isLaziable(func) {
      var funcName = getFuncName(func);
      if (!(funcName in LazyWrapper.prototype)) {
        return false;
      }
      var other = lodash[funcName];
      if (func === other) {
        return true;
      }
      var data = getData(other);
      return !!data && func === data[0];
    }

    /**
     * Checks if `value` is a valid array-like length.
     *
     * **Note:** This function is based on [`ToLength`](http://ecma-international.org/ecma-262/6.0/#sec-tolength).
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
     */
    function isLength(value) {
      return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
    }

    /**
     * Checks if `value` is suitable for strict equality comparisons, i.e. `===`.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` if suitable for strict
     *  equality comparisons, else `false`.
     */
    function isStrictComparable(value) {
      return value === value && !isObject(value);
    }

    /**
     * Merges the function metadata of `source` into `data`.
     *
     * Merging metadata reduces the number of wrappers required to invoke a function.
     * This is possible because methods like `_.bind`, `_.curry`, and `_.partial`
     * may be applied regardless of execution order. Methods like `_.ary` and `_.rearg`
     * augment function arguments, making the order in which they are executed important,
     * preventing the merging of metadata. However, we make an exception for a safe
     * common case where curried functions have `_.ary` and or `_.rearg` applied.
     *
     * @private
     * @param {Array} data The destination metadata.
     * @param {Array} source The source metadata.
     * @returns {Array} Returns `data`.
     */
    function mergeData(data, source) {
      var bitmask = data[1],
          srcBitmask = source[1],
          newBitmask = bitmask | srcBitmask,
          isCommon = newBitmask < ARY_FLAG;

      var isCombo =
        (srcBitmask == ARY_FLAG && bitmask == CURRY_FLAG) ||
        (srcBitmask == ARY_FLAG && bitmask == REARG_FLAG && data[7].length <= source[8]) ||
        (srcBitmask == (ARY_FLAG | REARG_FLAG) && bitmask == CURRY_FLAG);

      // Exit early if metadata can't be merged.
      if (!(isCommon || isCombo)) {
        return data;
      }
      // Use source `thisArg` if available.
      if (srcBitmask & BIND_FLAG) {
        data[2] = source[2];
        // Set when currying a bound function.
        newBitmask |= (bitmask & BIND_FLAG) ? 0 : CURRY_BOUND_FLAG;
      }
      // Compose partial arguments.
      var value = source[3];
      if (value) {
        var partials = data[3];
        data[3] = partials ? composeArgs(partials, value, source[4]) : arrayCopy(value);
        data[4] = partials ? replaceHolders(data[3], PLACEHOLDER) : arrayCopy(source[4]);
      }
      // Compose partial right arguments.
      value = source[5];
      if (value) {
        partials = data[5];
        data[5] = partials ? composeArgsRight(partials, value, source[6]) : arrayCopy(value);
        data[6] = partials ? replaceHolders(data[5], PLACEHOLDER) : arrayCopy(source[6]);
      }
      // Use source `argPos` if available.
      value = source[7];
      if (value) {
        data[7] = arrayCopy(value);
      }
      // Use source `ary` if it's smaller.
      if (srcBitmask & ARY_FLAG) {
        data[8] = data[8] == null ? source[8] : nativeMin(data[8], source[8]);
      }
      // Use source `arity` if one is not provided.
      if (data[9] == null) {
        data[9] = source[9];
      }
      // Use source `func` and merge bitmasks.
      data[0] = source[0];
      data[1] = newBitmask;

      return data;
    }

    /**
     * Used by `_.defaultsDeep` to customize its `_.merge` use.
     *
     * @private
     * @param {*} objectValue The destination object property value.
     * @param {*} sourceValue The source object property value.
     * @returns {*} Returns the value to assign to the destination object.
     */
    function mergeDefaults(objectValue, sourceValue) {
      return objectValue === undefined ? sourceValue : merge(objectValue, sourceValue, mergeDefaults);
    }

    /**
     * A specialized version of `_.pick` which picks `object` properties specified
     * by `props`.
     *
     * @private
     * @param {Object} object The source object.
     * @param {string[]} props The property names to pick.
     * @returns {Object} Returns the new object.
     */
    function pickByArray(object, props) {
      object = toObject(object);

      var index = -1,
          length = props.length,
          result = {};

      while (++index < length) {
        var key = props[index];
        if (key in object) {
          result[key] = object[key];
        }
      }
      return result;
    }

    /**
     * A specialized version of `_.pick` which picks `object` properties `predicate`
     * returns truthy for.
     *
     * @private
     * @param {Object} object The source object.
     * @param {Function} predicate The function invoked per iteration.
     * @returns {Object} Returns the new object.
     */
    function pickByCallback(object, predicate) {
      var result = {};
      baseForIn(object, function(value, key, object) {
        if (predicate(value, key, object)) {
          result[key] = value;
        }
      });
      return result;
    }

    /**
     * Reorder `array` according to the specified indexes where the element at
     * the first index is assigned as the first element, the element at
     * the second index is assigned as the second element, and so on.
     *
     * @private
     * @param {Array} array The array to reorder.
     * @param {Array} indexes The arranged array indexes.
     * @returns {Array} Returns `array`.
     */
    function reorder(array, indexes) {
      var arrLength = array.length,
          length = nativeMin(indexes.length, arrLength),
          oldArray = arrayCopy(array);

      while (length--) {
        var index = indexes[length];
        array[length] = isIndex(index, arrLength) ? oldArray[index] : undefined;
      }
      return array;
    }

    /**
     * Sets metadata for `func`.
     *
     * **Note:** If this function becomes hot, i.e. is invoked a lot in a short
     * period of time, it will trip its breaker and transition to an identity function
     * to avoid garbage collection pauses in V8. See [V8 issue 2070](https://code.google.com/p/v8/issues/detail?id=2070)
     * for more details.
     *
     * @private
     * @param {Function} func The function to associate metadata with.
     * @param {*} data The metadata.
     * @returns {Function} Returns `func`.
     */
    var setData = (function() {
      var count = 0,
          lastCalled = 0;

      return function(key, value) {
        var stamp = now(),
            remaining = HOT_SPAN - (stamp - lastCalled);

        lastCalled = stamp;
        if (remaining > 0) {
          if (++count >= HOT_COUNT) {
            return key;
          }
        } else {
          count = 0;
        }
        return baseSetData(key, value);
      };
    }());

    /**
     * A fallback implementation of `Object.keys` which creates an array of the
     * own enumerable property names of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property names.
     */
    function shimKeys(object) {
      var props = keysIn(object),
          propsLength = props.length,
          length = propsLength && object.length;

      var allowIndexes = !!length && isLength(length) &&
        (isArray(object) || isArguments(object));

      var index = -1,
          result = [];

      while (++index < propsLength) {
        var key = props[index];
        if ((allowIndexes && isIndex(key, length)) || hasOwnProperty.call(object, key)) {
          result.push(key);
        }
      }
      return result;
    }

    /**
     * Converts `value` to an array-like object if it's not one.
     *
     * @private
     * @param {*} value The value to process.
     * @returns {Array|Object} Returns the array-like object.
     */
    function toIterable(value) {
      if (value == null) {
        return [];
      }
      if (!isArrayLike(value)) {
        return values(value);
      }
      return isObject(value) ? value : Object(value);
    }

    /**
     * Converts `value` to an object if it's not one.
     *
     * @private
     * @param {*} value The value to process.
     * @returns {Object} Returns the object.
     */
    function toObject(value) {
      return isObject(value) ? value : Object(value);
    }

    /**
     * Converts `value` to property path array if it's not one.
     *
     * @private
     * @param {*} value The value to process.
     * @returns {Array} Returns the property path array.
     */
    function toPath(value) {
      if (isArray(value)) {
        return value;
      }
      var result = [];
      baseToString(value).replace(rePropName, function(match, number, quote, string) {
        result.push(quote ? string.replace(reEscapeChar, '$1') : (number || match));
      });
      return result;
    }

    /**
     * Creates a clone of `wrapper`.
     *
     * @private
     * @param {Object} wrapper The wrapper to clone.
     * @returns {Object} Returns the cloned wrapper.
     */
    function wrapperClone(wrapper) {
      return wrapper instanceof LazyWrapper
        ? wrapper.clone()
        : new LodashWrapper(wrapper.__wrapped__, wrapper.__chain__, arrayCopy(wrapper.__actions__));
    }

    /*------------------------------------------------------------------------*/

    /**
     * Creates an array of elements split into groups the length of `size`.
     * If `collection` can't be split evenly, the final chunk will be the remaining
     * elements.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to process.
     * @param {number} [size=1] The length of each chunk.
     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
     * @returns {Array} Returns the new array containing chunks.
     * @example
     *
     * _.chunk(['a', 'b', 'c', 'd'], 2);
     * // => [['a', 'b'], ['c', 'd']]
     *
     * _.chunk(['a', 'b', 'c', 'd'], 3);
     * // => [['a', 'b', 'c'], ['d']]
     */
    function chunk(array, size, guard) {
      if (guard ? isIterateeCall(array, size, guard) : size == null) {
        size = 1;
      } else {
        size = nativeMax(nativeFloor(size) || 1, 1);
      }
      var index = 0,
          length = array ? array.length : 0,
          resIndex = -1,
          result = Array(nativeCeil(length / size));

      while (index < length) {
        result[++resIndex] = baseSlice(array, index, (index += size));
      }
      return result;
    }

    /**
     * Creates an array with all falsey values removed. The values `false`, `null`,
     * `0`, `""`, `undefined`, and `NaN` are falsey.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to compact.
     * @returns {Array} Returns the new array of filtered values.
     * @example
     *
     * _.compact([0, 1, false, 2, '', 3]);
     * // => [1, 2, 3]
     */
    function compact(array) {
      var index = -1,
          length = array ? array.length : 0,
          resIndex = -1,
          result = [];

      while (++index < length) {
        var value = array[index];
        if (value) {
          result[++resIndex] = value;
        }
      }
      return result;
    }

    /**
     * Creates an array of unique `array` values not included in the other
     * provided arrays using [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
     * for equality comparisons.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to inspect.
     * @param {...Array} [values] The arrays of values to exclude.
     * @returns {Array} Returns the new array of filtered values.
     * @example
     *
     * _.difference([1, 2, 3], [4, 2]);
     * // => [1, 3]
     */
    var difference = restParam(function(array, values) {
      return (isObjectLike(array) && isArrayLike(array))
        ? baseDifference(array, baseFlatten(values, false, true))
        : [];
    });

    /**
     * Creates a slice of `array` with `n` elements dropped from the beginning.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to query.
     * @param {number} [n=1] The number of elements to drop.
     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * _.drop([1, 2, 3]);
     * // => [2, 3]
     *
     * _.drop([1, 2, 3], 2);
     * // => [3]
     *
     * _.drop([1, 2, 3], 5);
     * // => []
     *
     * _.drop([1, 2, 3], 0);
     * // => [1, 2, 3]
     */
    function drop(array, n, guard) {
      var length = array ? array.length : 0;
      if (!length) {
        return [];
      }
      if (guard ? isIterateeCall(array, n, guard) : n == null) {
        n = 1;
      }
      return baseSlice(array, n < 0 ? 0 : n);
    }

    /**
     * Creates a slice of `array` with `n` elements dropped from the end.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to query.
     * @param {number} [n=1] The number of elements to drop.
     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * _.dropRight([1, 2, 3]);
     * // => [1, 2]
     *
     * _.dropRight([1, 2, 3], 2);
     * // => [1]
     *
     * _.dropRight([1, 2, 3], 5);
     * // => []
     *
     * _.dropRight([1, 2, 3], 0);
     * // => [1, 2, 3]
     */
    function dropRight(array, n, guard) {
      var length = array ? array.length : 0;
      if (!length) {
        return [];
      }
      if (guard ? isIterateeCall(array, n, guard) : n == null) {
        n = 1;
      }
      n = length - (+n || 0);
      return baseSlice(array, 0, n < 0 ? 0 : n);
    }

    /**
     * Creates a slice of `array` excluding elements dropped from the end.
     * Elements are dropped until `predicate` returns falsey. The predicate is
     * bound to `thisArg` and invoked with three arguments: (value, index, array).
     *
     * If a property name is provided for `predicate` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `predicate` the created `_.matches` style
     * callback returns `true` for elements that match the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to query.
     * @param {Function|Object|string} [predicate=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * _.dropRightWhile([1, 2, 3], function(n) {
     *   return n > 1;
     * });
     * // => [1]
     *
     * var users = [
     *   { 'user': 'barney',  'active': true },
     *   { 'user': 'fred',    'active': false },
     *   { 'user': 'pebbles', 'active': false }
     * ];
     *
     * // using the `_.matches` callback shorthand
     * _.pluck(_.dropRightWhile(users, { 'user': 'pebbles', 'active': false }), 'user');
     * // => ['barney', 'fred']
     *
     * // using the `_.matchesProperty` callback shorthand
     * _.pluck(_.dropRightWhile(users, 'active', false), 'user');
     * // => ['barney']
     *
     * // using the `_.property` callback shorthand
     * _.pluck(_.dropRightWhile(users, 'active'), 'user');
     * // => ['barney', 'fred', 'pebbles']
     */
    function dropRightWhile(array, predicate, thisArg) {
      return (array && array.length)
        ? baseWhile(array, getCallback(predicate, thisArg, 3), true, true)
        : [];
    }

    /**
     * Creates a slice of `array` excluding elements dropped from the beginning.
     * Elements are dropped until `predicate` returns falsey. The predicate is
     * bound to `thisArg` and invoked with three arguments: (value, index, array).
     *
     * If a property name is provided for `predicate` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `predicate` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to query.
     * @param {Function|Object|string} [predicate=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * _.dropWhile([1, 2, 3], function(n) {
     *   return n < 3;
     * });
     * // => [3]
     *
     * var users = [
     *   { 'user': 'barney',  'active': false },
     *   { 'user': 'fred',    'active': false },
     *   { 'user': 'pebbles', 'active': true }
     * ];
     *
     * // using the `_.matches` callback shorthand
     * _.pluck(_.dropWhile(users, { 'user': 'barney', 'active': false }), 'user');
     * // => ['fred', 'pebbles']
     *
     * // using the `_.matchesProperty` callback shorthand
     * _.pluck(_.dropWhile(users, 'active', false), 'user');
     * // => ['pebbles']
     *
     * // using the `_.property` callback shorthand
     * _.pluck(_.dropWhile(users, 'active'), 'user');
     * // => ['barney', 'fred', 'pebbles']
     */
    function dropWhile(array, predicate, thisArg) {
      return (array && array.length)
        ? baseWhile(array, getCallback(predicate, thisArg, 3), true)
        : [];
    }

    /**
     * Fills elements of `array` with `value` from `start` up to, but not
     * including, `end`.
     *
     * **Note:** This method mutates `array`.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to fill.
     * @param {*} value The value to fill `array` with.
     * @param {number} [start=0] The start position.
     * @param {number} [end=array.length] The end position.
     * @returns {Array} Returns `array`.
     * @example
     *
     * var array = [1, 2, 3];
     *
     * _.fill(array, 'a');
     * console.log(array);
     * // => ['a', 'a', 'a']
     *
     * _.fill(Array(3), 2);
     * // => [2, 2, 2]
     *
     * _.fill([4, 6, 8], '*', 1, 2);
     * // => [4, '*', 8]
     */
    function fill(array, value, start, end) {
      var length = array ? array.length : 0;
      if (!length) {
        return [];
      }
      if (start && typeof start != 'number' && isIterateeCall(array, value, start)) {
        start = 0;
        end = length;
      }
      return baseFill(array, value, start, end);
    }

    /**
     * This method is like `_.find` except that it returns the index of the first
     * element `predicate` returns truthy for instead of the element itself.
     *
     * If a property name is provided for `predicate` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `predicate` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to search.
     * @param {Function|Object|string} [predicate=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {number} Returns the index of the found element, else `-1`.
     * @example
     *
     * var users = [
     *   { 'user': 'barney',  'active': false },
     *   { 'user': 'fred',    'active': false },
     *   { 'user': 'pebbles', 'active': true }
     * ];
     *
     * _.findIndex(users, function(chr) {
     *   return chr.user == 'barney';
     * });
     * // => 0
     *
     * // using the `_.matches` callback shorthand
     * _.findIndex(users, { 'user': 'fred', 'active': false });
     * // => 1
     *
     * // using the `_.matchesProperty` callback shorthand
     * _.findIndex(users, 'active', false);
     * // => 0
     *
     * // using the `_.property` callback shorthand
     * _.findIndex(users, 'active');
     * // => 2
     */
    var findIndex = createFindIndex();

    /**
     * This method is like `_.findIndex` except that it iterates over elements
     * of `collection` from right to left.
     *
     * If a property name is provided for `predicate` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `predicate` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to search.
     * @param {Function|Object|string} [predicate=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {number} Returns the index of the found element, else `-1`.
     * @example
     *
     * var users = [
     *   { 'user': 'barney',  'active': true },
     *   { 'user': 'fred',    'active': false },
     *   { 'user': 'pebbles', 'active': false }
     * ];
     *
     * _.findLastIndex(users, function(chr) {
     *   return chr.user == 'pebbles';
     * });
     * // => 2
     *
     * // using the `_.matches` callback shorthand
     * _.findLastIndex(users, { 'user': 'barney', 'active': true });
     * // => 0
     *
     * // using the `_.matchesProperty` callback shorthand
     * _.findLastIndex(users, 'active', false);
     * // => 2
     *
     * // using the `_.property` callback shorthand
     * _.findLastIndex(users, 'active');
     * // => 0
     */
    var findLastIndex = createFindIndex(true);

    /**
     * Gets the first element of `array`.
     *
     * @static
     * @memberOf _
     * @alias head
     * @category Array
     * @param {Array} array The array to query.
     * @returns {*} Returns the first element of `array`.
     * @example
     *
     * _.first([1, 2, 3]);
     * // => 1
     *
     * _.first([]);
     * // => undefined
     */
    function first(array) {
      return array ? array[0] : undefined;
    }

    /**
     * Flattens a nested array. If `isDeep` is `true` the array is recursively
     * flattened, otherwise it is only flattened a single level.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to flatten.
     * @param {boolean} [isDeep] Specify a deep flatten.
     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
     * @returns {Array} Returns the new flattened array.
     * @example
     *
     * _.flatten([1, [2, 3, [4]]]);
     * // => [1, 2, 3, [4]]
     *
     * // using `isDeep`
     * _.flatten([1, [2, 3, [4]]], true);
     * // => [1, 2, 3, 4]
     */
    function flatten(array, isDeep, guard) {
      var length = array ? array.length : 0;
      if (guard && isIterateeCall(array, isDeep, guard)) {
        isDeep = false;
      }
      return length ? baseFlatten(array, isDeep) : [];
    }

    /**
     * Recursively flattens a nested array.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to recursively flatten.
     * @returns {Array} Returns the new flattened array.
     * @example
     *
     * _.flattenDeep([1, [2, 3, [4]]]);
     * // => [1, 2, 3, 4]
     */
    function flattenDeep(array) {
      var length = array ? array.length : 0;
      return length ? baseFlatten(array, true) : [];
    }

    /**
     * Gets the index at which the first occurrence of `value` is found in `array`
     * using [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
     * for equality comparisons. If `fromIndex` is negative, it is used as the offset
     * from the end of `array`. If `array` is sorted providing `true` for `fromIndex`
     * performs a faster binary search.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to search.
     * @param {*} value The value to search for.
     * @param {boolean|number} [fromIndex=0] The index to search from or `true`
     *  to perform a binary search on a sorted array.
     * @returns {number} Returns the index of the matched value, else `-1`.
     * @example
     *
     * _.indexOf([1, 2, 1, 2], 2);
     * // => 1
     *
     * // using `fromIndex`
     * _.indexOf([1, 2, 1, 2], 2, 2);
     * // => 3
     *
     * // performing a binary search
     * _.indexOf([1, 1, 2, 2], 2, true);
     * // => 2
     */
    function indexOf(array, value, fromIndex) {
      var length = array ? array.length : 0;
      if (!length) {
        return -1;
      }
      if (typeof fromIndex == 'number') {
        fromIndex = fromIndex < 0 ? nativeMax(length + fromIndex, 0) : fromIndex;
      } else if (fromIndex) {
        var index = binaryIndex(array, value);
        if (index < length &&
            (value === value ? (value === array[index]) : (array[index] !== array[index]))) {
          return index;
        }
        return -1;
      }
      return baseIndexOf(array, value, fromIndex || 0);
    }

    /**
     * Gets all but the last element of `array`.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to query.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * _.initial([1, 2, 3]);
     * // => [1, 2]
     */
    function initial(array) {
      return dropRight(array, 1);
    }

    /**
     * Creates an array of unique values that are included in all of the provided
     * arrays using [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
     * for equality comparisons.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {...Array} [arrays] The arrays to inspect.
     * @returns {Array} Returns the new array of shared values.
     * @example
     * _.intersection([1, 2], [4, 2], [2, 1]);
     * // => [2]
     */
    var intersection = restParam(function(arrays) {
      var othLength = arrays.length,
          othIndex = othLength,
          caches = Array(length),
          indexOf = getIndexOf(),
          isCommon = indexOf == baseIndexOf,
          result = [];

      while (othIndex--) {
        var value = arrays[othIndex] = isArrayLike(value = arrays[othIndex]) ? value : [];
        caches[othIndex] = (isCommon && value.length >= 120) ? createCache(othIndex && value) : null;
      }
      var array = arrays[0],
          index = -1,
          length = array ? array.length : 0,
          seen = caches[0];

      outer:
      while (++index < length) {
        value = array[index];
        if ((seen ? cacheIndexOf(seen, value) : indexOf(result, value, 0)) < 0) {
          var othIndex = othLength;
          while (--othIndex) {
            var cache = caches[othIndex];
            if ((cache ? cacheIndexOf(cache, value) : indexOf(arrays[othIndex], value, 0)) < 0) {
              continue outer;
            }
          }
          if (seen) {
            seen.push(value);
          }
          result.push(value);
        }
      }
      return result;
    });

    /**
     * Gets the last element of `array`.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to query.
     * @returns {*} Returns the last element of `array`.
     * @example
     *
     * _.last([1, 2, 3]);
     * // => 3
     */
    function last(array) {
      var length = array ? array.length : 0;
      return length ? array[length - 1] : undefined;
    }

    /**
     * This method is like `_.indexOf` except that it iterates over elements of
     * `array` from right to left.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to search.
     * @param {*} value The value to search for.
     * @param {boolean|number} [fromIndex=array.length-1] The index to search from
     *  or `true` to perform a binary search on a sorted array.
     * @returns {number} Returns the index of the matched value, else `-1`.
     * @example
     *
     * _.lastIndexOf([1, 2, 1, 2], 2);
     * // => 3
     *
     * // using `fromIndex`
     * _.lastIndexOf([1, 2, 1, 2], 2, 2);
     * // => 1
     *
     * // performing a binary search
     * _.lastIndexOf([1, 1, 2, 2], 2, true);
     * // => 3
     */
    function lastIndexOf(array, value, fromIndex) {
      var length = array ? array.length : 0;
      if (!length) {
        return -1;
      }
      var index = length;
      if (typeof fromIndex == 'number') {
        index = (fromIndex < 0 ? nativeMax(length + fromIndex, 0) : nativeMin(fromIndex || 0, length - 1)) + 1;
      } else if (fromIndex) {
        index = binaryIndex(array, value, true) - 1;
        var other = array[index];
        if (value === value ? (value === other) : (other !== other)) {
          return index;
        }
        return -1;
      }
      if (value !== value) {
        return indexOfNaN(array, index, true);
      }
      while (index--) {
        if (array[index] === value) {
          return index;
        }
      }
      return -1;
    }

    /**
     * Removes all provided values from `array` using
     * [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
     * for equality comparisons.
     *
     * **Note:** Unlike `_.without`, this method mutates `array`.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to modify.
     * @param {...*} [values] The values to remove.
     * @returns {Array} Returns `array`.
     * @example
     *
     * var array = [1, 2, 3, 1, 2, 3];
     *
     * _.pull(array, 2, 3);
     * console.log(array);
     * // => [1, 1]
     */
    function pull() {
      var args = arguments,
          array = args[0];

      if (!(array && array.length)) {
        return array;
      }
      var index = 0,
          indexOf = getIndexOf(),
          length = args.length;

      while (++index < length) {
        var fromIndex = 0,
            value = args[index];

        while ((fromIndex = indexOf(array, value, fromIndex)) > -1) {
          splice.call(array, fromIndex, 1);
        }
      }
      return array;
    }

    /**
     * Removes elements from `array` corresponding to the given indexes and returns
     * an array of the removed elements. Indexes may be specified as an array of
     * indexes or as individual arguments.
     *
     * **Note:** Unlike `_.at`, this method mutates `array`.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to modify.
     * @param {...(number|number[])} [indexes] The indexes of elements to remove,
     *  specified as individual indexes or arrays of indexes.
     * @returns {Array} Returns the new array of removed elements.
     * @example
     *
     * var array = [5, 10, 15, 20];
     * var evens = _.pullAt(array, 1, 3);
     *
     * console.log(array);
     * // => [5, 15]
     *
     * console.log(evens);
     * // => [10, 20]
     */
    var pullAt = restParam(function(array, indexes) {
      indexes = baseFlatten(indexes);

      var result = baseAt(array, indexes);
      basePullAt(array, indexes.sort(baseCompareAscending));
      return result;
    });

    /**
     * Removes all elements from `array` that `predicate` returns truthy for
     * and returns an array of the removed elements. The predicate is bound to
     * `thisArg` and invoked with three arguments: (value, index, array).
     *
     * If a property name is provided for `predicate` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `predicate` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * **Note:** Unlike `_.filter`, this method mutates `array`.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to modify.
     * @param {Function|Object|string} [predicate=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {Array} Returns the new array of removed elements.
     * @example
     *
     * var array = [1, 2, 3, 4];
     * var evens = _.remove(array, function(n) {
     *   return n % 2 == 0;
     * });
     *
     * console.log(array);
     * // => [1, 3]
     *
     * console.log(evens);
     * // => [2, 4]
     */
    function remove(array, predicate, thisArg) {
      var result = [];
      if (!(array && array.length)) {
        return result;
      }
      var index = -1,
          indexes = [],
          length = array.length;

      predicate = getCallback(predicate, thisArg, 3);
      while (++index < length) {
        var value = array[index];
        if (predicate(value, index, array)) {
          result.push(value);
          indexes.push(index);
        }
      }
      basePullAt(array, indexes);
      return result;
    }

    /**
     * Gets all but the first element of `array`.
     *
     * @static
     * @memberOf _
     * @alias tail
     * @category Array
     * @param {Array} array The array to query.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * _.rest([1, 2, 3]);
     * // => [2, 3]
     */
    function rest(array) {
      return drop(array, 1);
    }

    /**
     * Creates a slice of `array` from `start` up to, but not including, `end`.
     *
     * **Note:** This method is used instead of `Array#slice` to support node
     * lists in IE < 9 and to ensure dense arrays are returned.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to slice.
     * @param {number} [start=0] The start position.
     * @param {number} [end=array.length] The end position.
     * @returns {Array} Returns the slice of `array`.
     */
    function slice(array, start, end) {
      var length = array ? array.length : 0;
      if (!length) {
        return [];
      }
      if (end && typeof end != 'number' && isIterateeCall(array, start, end)) {
        start = 0;
        end = length;
      }
      return baseSlice(array, start, end);
    }

    /**
     * Uses a binary search to determine the lowest index at which `value` should
     * be inserted into `array` in order to maintain its sort order. If an iteratee
     * function is provided it is invoked for `value` and each element of `array`
     * to compute their sort ranking. The iteratee is bound to `thisArg` and
     * invoked with one argument; (value).
     *
     * If a property name is provided for `iteratee` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `iteratee` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The sorted array to inspect.
     * @param {*} value The value to evaluate.
     * @param {Function|Object|string} [iteratee=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {number} Returns the index at which `value` should be inserted
     *  into `array`.
     * @example
     *
     * _.sortedIndex([30, 50], 40);
     * // => 1
     *
     * _.sortedIndex([4, 4, 5, 5], 5);
     * // => 2
     *
     * var dict = { 'data': { 'thirty': 30, 'forty': 40, 'fifty': 50 } };
     *
     * // using an iteratee function
     * _.sortedIndex(['thirty', 'fifty'], 'forty', function(word) {
     *   return this.data[word];
     * }, dict);
     * // => 1
     *
     * // using the `_.property` callback shorthand
     * _.sortedIndex([{ 'x': 30 }, { 'x': 50 }], { 'x': 40 }, 'x');
     * // => 1
     */
    var sortedIndex = createSortedIndex();

    /**
     * This method is like `_.sortedIndex` except that it returns the highest
     * index at which `value` should be inserted into `array` in order to
     * maintain its sort order.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The sorted array to inspect.
     * @param {*} value The value to evaluate.
     * @param {Function|Object|string} [iteratee=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {number} Returns the index at which `value` should be inserted
     *  into `array`.
     * @example
     *
     * _.sortedLastIndex([4, 4, 5, 5], 5);
     * // => 4
     */
    var sortedLastIndex = createSortedIndex(true);

    /**
     * Creates a slice of `array` with `n` elements taken from the beginning.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to query.
     * @param {number} [n=1] The number of elements to take.
     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * _.take([1, 2, 3]);
     * // => [1]
     *
     * _.take([1, 2, 3], 2);
     * // => [1, 2]
     *
     * _.take([1, 2, 3], 5);
     * // => [1, 2, 3]
     *
     * _.take([1, 2, 3], 0);
     * // => []
     */
    function take(array, n, guard) {
      var length = array ? array.length : 0;
      if (!length) {
        return [];
      }
      if (guard ? isIterateeCall(array, n, guard) : n == null) {
        n = 1;
      }
      return baseSlice(array, 0, n < 0 ? 0 : n);
    }

    /**
     * Creates a slice of `array` with `n` elements taken from the end.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to query.
     * @param {number} [n=1] The number of elements to take.
     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * _.takeRight([1, 2, 3]);
     * // => [3]
     *
     * _.takeRight([1, 2, 3], 2);
     * // => [2, 3]
     *
     * _.takeRight([1, 2, 3], 5);
     * // => [1, 2, 3]
     *
     * _.takeRight([1, 2, 3], 0);
     * // => []
     */
    function takeRight(array, n, guard) {
      var length = array ? array.length : 0;
      if (!length) {
        return [];
      }
      if (guard ? isIterateeCall(array, n, guard) : n == null) {
        n = 1;
      }
      n = length - (+n || 0);
      return baseSlice(array, n < 0 ? 0 : n);
    }

    /**
     * Creates a slice of `array` with elements taken from the end. Elements are
     * taken until `predicate` returns falsey. The predicate is bound to `thisArg`
     * and invoked with three arguments: (value, index, array).
     *
     * If a property name is provided for `predicate` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `predicate` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to query.
     * @param {Function|Object|string} [predicate=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * _.takeRightWhile([1, 2, 3], function(n) {
     *   return n > 1;
     * });
     * // => [2, 3]
     *
     * var users = [
     *   { 'user': 'barney',  'active': true },
     *   { 'user': 'fred',    'active': false },
     *   { 'user': 'pebbles', 'active': false }
     * ];
     *
     * // using the `_.matches` callback shorthand
     * _.pluck(_.takeRightWhile(users, { 'user': 'pebbles', 'active': false }), 'user');
     * // => ['pebbles']
     *
     * // using the `_.matchesProperty` callback shorthand
     * _.pluck(_.takeRightWhile(users, 'active', false), 'user');
     * // => ['fred', 'pebbles']
     *
     * // using the `_.property` callback shorthand
     * _.pluck(_.takeRightWhile(users, 'active'), 'user');
     * // => []
     */
    function takeRightWhile(array, predicate, thisArg) {
      return (array && array.length)
        ? baseWhile(array, getCallback(predicate, thisArg, 3), false, true)
        : [];
    }

    /**
     * Creates a slice of `array` with elements taken from the beginning. Elements
     * are taken until `predicate` returns falsey. The predicate is bound to
     * `thisArg` and invoked with three arguments: (value, index, array).
     *
     * If a property name is provided for `predicate` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `predicate` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to query.
     * @param {Function|Object|string} [predicate=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * _.takeWhile([1, 2, 3], function(n) {
     *   return n < 3;
     * });
     * // => [1, 2]
     *
     * var users = [
     *   { 'user': 'barney',  'active': false },
     *   { 'user': 'fred',    'active': false},
     *   { 'user': 'pebbles', 'active': true }
     * ];
     *
     * // using the `_.matches` callback shorthand
     * _.pluck(_.takeWhile(users, { 'user': 'barney', 'active': false }), 'user');
     * // => ['barney']
     *
     * // using the `_.matchesProperty` callback shorthand
     * _.pluck(_.takeWhile(users, 'active', false), 'user');
     * // => ['barney', 'fred']
     *
     * // using the `_.property` callback shorthand
     * _.pluck(_.takeWhile(users, 'active'), 'user');
     * // => []
     */
    function takeWhile(array, predicate, thisArg) {
      return (array && array.length)
        ? baseWhile(array, getCallback(predicate, thisArg, 3))
        : [];
    }

    /**
     * Creates an array of unique values, in order, from all of the provided arrays
     * using [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
     * for equality comparisons.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {...Array} [arrays] The arrays to inspect.
     * @returns {Array} Returns the new array of combined values.
     * @example
     *
     * _.union([1, 2], [4, 2], [2, 1]);
     * // => [1, 2, 4]
     */
    var union = restParam(function(arrays) {
      return baseUniq(baseFlatten(arrays, false, true));
    });

    /**
     * Creates a duplicate-free version of an array, using
     * [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
     * for equality comparisons, in which only the first occurence of each element
     * is kept. Providing `true` for `isSorted` performs a faster search algorithm
     * for sorted arrays. If an iteratee function is provided it is invoked for
     * each element in the array to generate the criterion by which uniqueness
     * is computed. The `iteratee` is bound to `thisArg` and invoked with three
     * arguments: (value, index, array).
     *
     * If a property name is provided for `iteratee` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `iteratee` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @alias unique
     * @category Array
     * @param {Array} array The array to inspect.
     * @param {boolean} [isSorted] Specify the array is sorted.
     * @param {Function|Object|string} [iteratee] The function invoked per iteration.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {Array} Returns the new duplicate-value-free array.
     * @example
     *
     * _.uniq([2, 1, 2]);
     * // => [2, 1]
     *
     * // using `isSorted`
     * _.uniq([1, 1, 2], true);
     * // => [1, 2]
     *
     * // using an iteratee function
     * _.uniq([1, 2.5, 1.5, 2], function(n) {
     *   return this.floor(n);
     * }, Math);
     * // => [1, 2.5]
     *
     * // using the `_.property` callback shorthand
     * _.uniq([{ 'x': 1 }, { 'x': 2 }, { 'x': 1 }], 'x');
     * // => [{ 'x': 1 }, { 'x': 2 }]
     */
    function uniq(array, isSorted, iteratee, thisArg) {
      var length = array ? array.length : 0;
      if (!length) {
        return [];
      }
      if (isSorted != null && typeof isSorted != 'boolean') {
        thisArg = iteratee;
        iteratee = isIterateeCall(array, isSorted, thisArg) ? undefined : isSorted;
        isSorted = false;
      }
      var callback = getCallback();
      if (!(iteratee == null && callback === baseCallback)) {
        iteratee = callback(iteratee, thisArg, 3);
      }
      return (isSorted && getIndexOf() == baseIndexOf)
        ? sortedUniq(array, iteratee)
        : baseUniq(array, iteratee);
    }

    /**
     * This method is like `_.zip` except that it accepts an array of grouped
     * elements and creates an array regrouping the elements to their pre-zip
     * configuration.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array of grouped elements to process.
     * @returns {Array} Returns the new array of regrouped elements.
     * @example
     *
     * var zipped = _.zip(['fred', 'barney'], [30, 40], [true, false]);
     * // => [['fred', 30, true], ['barney', 40, false]]
     *
     * _.unzip(zipped);
     * // => [['fred', 'barney'], [30, 40], [true, false]]
     */
    function unzip(array) {
      if (!(array && array.length)) {
        return [];
      }
      var index = -1,
          length = 0;

      array = arrayFilter(array, function(group) {
        if (isArrayLike(group)) {
          length = nativeMax(group.length, length);
          return true;
        }
      });
      var result = Array(length);
      while (++index < length) {
        result[index] = arrayMap(array, baseProperty(index));
      }
      return result;
    }

    /**
     * This method is like `_.unzip` except that it accepts an iteratee to specify
     * how regrouped values should be combined. The `iteratee` is bound to `thisArg`
     * and invoked with four arguments: (accumulator, value, index, group).
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array of grouped elements to process.
     * @param {Function} [iteratee] The function to combine regrouped values.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {Array} Returns the new array of regrouped elements.
     * @example
     *
     * var zipped = _.zip([1, 2], [10, 20], [100, 200]);
     * // => [[1, 10, 100], [2, 20, 200]]
     *
     * _.unzipWith(zipped, _.add);
     * // => [3, 30, 300]
     */
    function unzipWith(array, iteratee, thisArg) {
      var length = array ? array.length : 0;
      if (!length) {
        return [];
      }
      var result = unzip(array);
      if (iteratee == null) {
        return result;
      }
      iteratee = bindCallback(iteratee, thisArg, 4);
      return arrayMap(result, function(group) {
        return arrayReduce(group, iteratee, undefined, true);
      });
    }

    /**
     * Creates an array excluding all provided values using
     * [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
     * for equality comparisons.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to filter.
     * @param {...*} [values] The values to exclude.
     * @returns {Array} Returns the new array of filtered values.
     * @example
     *
     * _.without([1, 2, 1, 3], 1, 2);
     * // => [3]
     */
    var without = restParam(function(array, values) {
      return isArrayLike(array)
        ? baseDifference(array, values)
        : [];
    });

    /**
     * Creates an array of unique values that is the [symmetric difference](https://en.wikipedia.org/wiki/Symmetric_difference)
     * of the provided arrays.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {...Array} [arrays] The arrays to inspect.
     * @returns {Array} Returns the new array of values.
     * @example
     *
     * _.xor([1, 2], [4, 2]);
     * // => [1, 4]
     */
    function xor() {
      var index = -1,
          length = arguments.length;

      while (++index < length) {
        var array = arguments[index];
        if (isArrayLike(array)) {
          var result = result
            ? arrayPush(baseDifference(result, array), baseDifference(array, result))
            : array;
        }
      }
      return result ? baseUniq(result) : [];
    }

    /**
     * Creates an array of grouped elements, the first of which contains the first
     * elements of the given arrays, the second of which contains the second elements
     * of the given arrays, and so on.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {...Array} [arrays] The arrays to process.
     * @returns {Array} Returns the new array of grouped elements.
     * @example
     *
     * _.zip(['fred', 'barney'], [30, 40], [true, false]);
     * // => [['fred', 30, true], ['barney', 40, false]]
     */
    var zip = restParam(unzip);

    /**
     * The inverse of `_.pairs`; this method returns an object composed from arrays
     * of property names and values. Provide either a single two dimensional array,
     * e.g. `[[key1, value1], [key2, value2]]` or two arrays, one of property names
     * and one of corresponding values.
     *
     * @static
     * @memberOf _
     * @alias object
     * @category Array
     * @param {Array} props The property names.
     * @param {Array} [values=[]] The property values.
     * @returns {Object} Returns the new object.
     * @example
     *
     * _.zipObject([['fred', 30], ['barney', 40]]);
     * // => { 'fred': 30, 'barney': 40 }
     *
     * _.zipObject(['fred', 'barney'], [30, 40]);
     * // => { 'fred': 30, 'barney': 40 }
     */
    function zipObject(props, values) {
      var index = -1,
          length = props ? props.length : 0,
          result = {};

      if (length && !values && !isArray(props[0])) {
        values = [];
      }
      while (++index < length) {
        var key = props[index];
        if (values) {
          result[key] = values[index];
        } else if (key) {
          result[key[0]] = key[1];
        }
      }
      return result;
    }

    /**
     * This method is like `_.zip` except that it accepts an iteratee to specify
     * how grouped values should be combined. The `iteratee` is bound to `thisArg`
     * and invoked with four arguments: (accumulator, value, index, group).
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {...Array} [arrays] The arrays to process.
     * @param {Function} [iteratee] The function to combine grouped values.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {Array} Returns the new array of grouped elements.
     * @example
     *
     * _.zipWith([1, 2], [10, 20], [100, 200], _.add);
     * // => [111, 222]
     */
    var zipWith = restParam(function(arrays) {
      var length = arrays.length,
          iteratee = length > 2 ? arrays[length - 2] : undefined,
          thisArg = length > 1 ? arrays[length - 1] : undefined;

      if (length > 2 && typeof iteratee == 'function') {
        length -= 2;
      } else {
        iteratee = (length > 1 && typeof thisArg == 'function') ? (--length, thisArg) : undefined;
        thisArg = undefined;
      }
      arrays.length = length;
      return unzipWith(arrays, iteratee, thisArg);
    });

    /*------------------------------------------------------------------------*/

    /**
     * Creates a `lodash` object that wraps `value` with explicit method
     * chaining enabled.
     *
     * @static
     * @memberOf _
     * @category Chain
     * @param {*} value The value to wrap.
     * @returns {Object} Returns the new `lodash` wrapper instance.
     * @example
     *
     * var users = [
     *   { 'user': 'barney',  'age': 36 },
     *   { 'user': 'fred',    'age': 40 },
     *   { 'user': 'pebbles', 'age': 1 }
     * ];
     *
     * var youngest = _.chain(users)
     *   .sortBy('age')
     *   .map(function(chr) {
     *     return chr.user + ' is ' + chr.age;
     *   })
     *   .first()
     *   .value();
     * // => 'pebbles is 1'
     */
    function chain(value) {
      var result = lodash(value);
      result.__chain__ = true;
      return result;
    }

    /**
     * This method invokes `interceptor` and returns `value`. The interceptor is
     * bound to `thisArg` and invoked with one argument; (value). The purpose of
     * this method is to "tap into" a method chain in order to perform operations
     * on intermediate results within the chain.
     *
     * @static
     * @memberOf _
     * @category Chain
     * @param {*} value The value to provide to `interceptor`.
     * @param {Function} interceptor The function to invoke.
     * @param {*} [thisArg] The `this` binding of `interceptor`.
     * @returns {*} Returns `value`.
     * @example
     *
     * _([1, 2, 3])
     *  .tap(function(array) {
     *    array.pop();
     *  })
     *  .reverse()
     *  .value();
     * // => [2, 1]
     */
    function tap(value, interceptor, thisArg) {
      interceptor.call(thisArg, value);
      return value;
    }

    /**
     * This method is like `_.tap` except that it returns the result of `interceptor`.
     *
     * @static
     * @memberOf _
     * @category Chain
     * @param {*} value The value to provide to `interceptor`.
     * @param {Function} interceptor The function to invoke.
     * @param {*} [thisArg] The `this` binding of `interceptor`.
     * @returns {*} Returns the result of `interceptor`.
     * @example
     *
     * _('  abc  ')
     *  .chain()
     *  .trim()
     *  .thru(function(value) {
     *    return [value];
     *  })
     *  .value();
     * // => ['abc']
     */
    function thru(value, interceptor, thisArg) {
      return interceptor.call(thisArg, value);
    }

    /**
     * Enables explicit method chaining on the wrapper object.
     *
     * @name chain
     * @memberOf _
     * @category Chain
     * @returns {Object} Returns the new `lodash` wrapper instance.
     * @example
     *
     * var users = [
     *   { 'user': 'barney', 'age': 36 },
     *   { 'user': 'fred',   'age': 40 }
     * ];
     *
     * // without explicit chaining
     * _(users).first();
     * // => { 'user': 'barney', 'age': 36 }
     *
     * // with explicit chaining
     * _(users).chain()
     *   .first()
     *   .pick('user')
     *   .value();
     * // => { 'user': 'barney' }
     */
    function wrapperChain() {
      return chain(this);
    }

    /**
     * Executes the chained sequence and returns the wrapped result.
     *
     * @name commit
     * @memberOf _
     * @category Chain
     * @returns {Object} Returns the new `lodash` wrapper instance.
     * @example
     *
     * var array = [1, 2];
     * var wrapped = _(array).push(3);
     *
     * console.log(array);
     * // => [1, 2]
     *
     * wrapped = wrapped.commit();
     * console.log(array);
     * // => [1, 2, 3]
     *
     * wrapped.last();
     * // => 3
     *
     * console.log(array);
     * // => [1, 2, 3]
     */
    function wrapperCommit() {
      return new LodashWrapper(this.value(), this.__chain__);
    }

    /**
     * Creates a new array joining a wrapped array with any additional arrays
     * and/or values.
     *
     * @name concat
     * @memberOf _
     * @category Chain
     * @param {...*} [values] The values to concatenate.
     * @returns {Array} Returns the new concatenated array.
     * @example
     *
     * var array = [1];
     * var wrapped = _(array).concat(2, [3], [[4]]);
     *
     * console.log(wrapped.value());
     * // => [1, 2, 3, [4]]
     *
     * console.log(array);
     * // => [1]
     */
    var wrapperConcat = restParam(function(values) {
      values = baseFlatten(values);
      return this.thru(function(array) {
        return arrayConcat(isArray(array) ? array : [toObject(array)], values);
      });
    });

    /**
     * Creates a clone of the chained sequence planting `value` as the wrapped value.
     *
     * @name plant
     * @memberOf _
     * @category Chain
     * @returns {Object} Returns the new `lodash` wrapper instance.
     * @example
     *
     * var array = [1, 2];
     * var wrapped = _(array).map(function(value) {
     *   return Math.pow(value, 2);
     * });
     *
     * var other = [3, 4];
     * var otherWrapped = wrapped.plant(other);
     *
     * otherWrapped.value();
     * // => [9, 16]
     *
     * wrapped.value();
     * // => [1, 4]
     */
    function wrapperPlant(value) {
      var result,
          parent = this;

      while (parent instanceof baseLodash) {
        var clone = wrapperClone(parent);
        if (result) {
          previous.__wrapped__ = clone;
        } else {
          result = clone;
        }
        var previous = clone;
        parent = parent.__wrapped__;
      }
      previous.__wrapped__ = value;
      return result;
    }

    /**
     * Reverses the wrapped array so the first element becomes the last, the
     * second element becomes the second to last, and so on.
     *
     * **Note:** This method mutates the wrapped array.
     *
     * @name reverse
     * @memberOf _
     * @category Chain
     * @returns {Object} Returns the new reversed `lodash` wrapper instance.
     * @example
     *
     * var array = [1, 2, 3];
     *
     * _(array).reverse().value()
     * // => [3, 2, 1]
     *
     * console.log(array);
     * // => [3, 2, 1]
     */
    function wrapperReverse() {
      var value = this.__wrapped__;

      var interceptor = function(value) {
        return (wrapped && wrapped.__dir__ < 0) ? value : value.reverse();
      };
      if (value instanceof LazyWrapper) {
        var wrapped = value;
        if (this.__actions__.length) {
          wrapped = new LazyWrapper(this);
        }
        wrapped = wrapped.reverse();
        wrapped.__actions__.push({ 'func': thru, 'args': [interceptor], 'thisArg': undefined });
        return new LodashWrapper(wrapped, this.__chain__);
      }
      return this.thru(interceptor);
    }

    /**
     * Produces the result of coercing the unwrapped value to a string.
     *
     * @name toString
     * @memberOf _
     * @category Chain
     * @returns {string} Returns the coerced string value.
     * @example
     *
     * _([1, 2, 3]).toString();
     * // => '1,2,3'
     */
    function wrapperToString() {
      return (this.value() + '');
    }

    /**
     * Executes the chained sequence to extract the unwrapped value.
     *
     * @name value
     * @memberOf _
     * @alias run, toJSON, valueOf
     * @category Chain
     * @returns {*} Returns the resolved unwrapped value.
     * @example
     *
     * _([1, 2, 3]).value();
     * // => [1, 2, 3]
     */
    function wrapperValue() {
      return baseWrapperValue(this.__wrapped__, this.__actions__);
    }

    /*------------------------------------------------------------------------*/

    /**
     * Creates an array of elements corresponding to the given keys, or indexes,
     * of `collection`. Keys may be specified as individual arguments or as arrays
     * of keys.
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {...(number|number[]|string|string[])} [props] The property names
     *  or indexes of elements to pick, specified individually or in arrays.
     * @returns {Array} Returns the new array of picked elements.
     * @example
     *
     * _.at(['a', 'b', 'c'], [0, 2]);
     * // => ['a', 'c']
     *
     * _.at(['barney', 'fred', 'pebbles'], 0, 2);
     * // => ['barney', 'pebbles']
     */
    var at = restParam(function(collection, props) {
      return baseAt(collection, baseFlatten(props));
    });

    /**
     * Creates an object composed of keys generated from the results of running
     * each element of `collection` through `iteratee`. The corresponding value
     * of each key is the number of times the key was returned by `iteratee`.
     * The `iteratee` is bound to `thisArg` and invoked with three arguments:
     * (value, index|key, collection).
     *
     * If a property name is provided for `iteratee` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `iteratee` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [iteratee=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {Object} Returns the composed aggregate object.
     * @example
     *
     * _.countBy([4.3, 6.1, 6.4], function(n) {
     *   return Math.floor(n);
     * });
     * // => { '4': 1, '6': 2 }
     *
     * _.countBy([4.3, 6.1, 6.4], function(n) {
     *   return this.floor(n);
     * }, Math);
     * // => { '4': 1, '6': 2 }
     *
     * _.countBy(['one', 'two', 'three'], 'length');
     * // => { '3': 2, '5': 1 }
     */
    var countBy = createAggregator(function(result, value, key) {
      hasOwnProperty.call(result, key) ? ++result[key] : (result[key] = 1);
    });

    /**
     * Checks if `predicate` returns truthy for **all** elements of `collection`.
     * The predicate is bound to `thisArg` and invoked with three arguments:
     * (value, index|key, collection).
     *
     * If a property name is provided for `predicate` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `predicate` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @alias all
     * @category Collection
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [predicate=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {boolean} Returns `true` if all elements pass the predicate check,
     *  else `false`.
     * @example
     *
     * _.every([true, 1, null, 'yes'], Boolean);
     * // => false
     *
     * var users = [
     *   { 'user': 'barney', 'active': false },
     *   { 'user': 'fred',   'active': false }
     * ];
     *
     * // using the `_.matches` callback shorthand
     * _.every(users, { 'user': 'barney', 'active': false });
     * // => false
     *
     * // using the `_.matchesProperty` callback shorthand
     * _.every(users, 'active', false);
     * // => true
     *
     * // using the `_.property` callback shorthand
     * _.every(users, 'active');
     * // => false
     */
    function every(collection, predicate, thisArg) {
      var func = isArray(collection) ? arrayEvery : baseEvery;
      if (thisArg && isIterateeCall(collection, predicate, thisArg)) {
        predicate = undefined;
      }
      if (typeof predicate != 'function' || thisArg !== undefined) {
        predicate = getCallback(predicate, thisArg, 3);
      }
      return func(collection, predicate);
    }

    /**
     * Iterates over elements of `collection`, returning an array of all elements
     * `predicate` returns truthy for. The predicate is bound to `thisArg` and
     * invoked with three arguments: (value, index|key, collection).
     *
     * If a property name is provided for `predicate` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `predicate` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @alias select
     * @category Collection
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [predicate=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {Array} Returns the new filtered array.
     * @example
     *
     * _.filter([4, 5, 6], function(n) {
     *   return n % 2 == 0;
     * });
     * // => [4, 6]
     *
     * var users = [
     *   { 'user': 'barney', 'age': 36, 'active': true },
     *   { 'user': 'fred',   'age': 40, 'active': false }
     * ];
     *
     * // using the `_.matches` callback shorthand
     * _.pluck(_.filter(users, { 'age': 36, 'active': true }), 'user');
     * // => ['barney']
     *
     * // using the `_.matchesProperty` callback shorthand
     * _.pluck(_.filter(users, 'active', false), 'user');
     * // => ['fred']
     *
     * // using the `_.property` callback shorthand
     * _.pluck(_.filter(users, 'active'), 'user');
     * // => ['barney']
     */
    function filter(collection, predicate, thisArg) {
      var func = isArray(collection) ? arrayFilter : baseFilter;
      predicate = getCallback(predicate, thisArg, 3);
      return func(collection, predicate);
    }

    /**
     * Iterates over elements of `collection`, returning the first element
     * `predicate` returns truthy for. The predicate is bound to `thisArg` and
     * invoked with three arguments: (value, index|key, collection).
     *
     * If a property name is provided for `predicate` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `predicate` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @alias detect
     * @category Collection
     * @param {Array|Object|string} collection The collection to search.
     * @param {Function|Object|string} [predicate=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {*} Returns the matched element, else `undefined`.
     * @example
     *
     * var users = [
     *   { 'user': 'barney',  'age': 36, 'active': true },
     *   { 'user': 'fred',    'age': 40, 'active': false },
     *   { 'user': 'pebbles', 'age': 1,  'active': true }
     * ];
     *
     * _.result(_.find(users, function(chr) {
     *   return chr.age < 40;
     * }), 'user');
     * // => 'barney'
     *
     * // using the `_.matches` callback shorthand
     * _.result(_.find(users, { 'age': 1, 'active': true }), 'user');
     * // => 'pebbles'
     *
     * // using the `_.matchesProperty` callback shorthand
     * _.result(_.find(users, 'active', false), 'user');
     * // => 'fred'
     *
     * // using the `_.property` callback shorthand
     * _.result(_.find(users, 'active'), 'user');
     * // => 'barney'
     */
    var find = createFind(baseEach);

    /**
     * This method is like `_.find` except that it iterates over elements of
     * `collection` from right to left.
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object|string} collection The collection to search.
     * @param {Function|Object|string} [predicate=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {*} Returns the matched element, else `undefined`.
     * @example
     *
     * _.findLast([1, 2, 3, 4], function(n) {
     *   return n % 2 == 1;
     * });
     * // => 3
     */
    var findLast = createFind(baseEachRight, true);

    /**
     * Performs a deep comparison between each element in `collection` and the
     * source object, returning the first element that has equivalent property
     * values.
     *
     * **Note:** This method supports comparing arrays, booleans, `Date` objects,
     * numbers, `Object` objects, regexes, and strings. Objects are compared by
     * their own, not inherited, enumerable properties. For comparing a single
     * own or inherited property value see `_.matchesProperty`.
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object|string} collection The collection to search.
     * @param {Object} source The object of property values to match.
     * @returns {*} Returns the matched element, else `undefined`.
     * @example
     *
     * var users = [
     *   { 'user': 'barney', 'age': 36, 'active': true },
     *   { 'user': 'fred',   'age': 40, 'active': false }
     * ];
     *
     * _.result(_.findWhere(users, { 'age': 36, 'active': true }), 'user');
     * // => 'barney'
     *
     * _.result(_.findWhere(users, { 'age': 40, 'active': false }), 'user');
     * // => 'fred'
     */
    function findWhere(collection, source) {
      return find(collection, baseMatches(source));
    }

    /**
     * Iterates over elements of `collection` invoking `iteratee` for each element.
     * The `iteratee` is bound to `thisArg` and invoked with three arguments:
     * (value, index|key, collection). Iteratee functions may exit iteration early
     * by explicitly returning `false`.
     *
     * **Note:** As with other "Collections" methods, objects with a "length" property
     * are iterated like arrays. To avoid this behavior `_.forIn` or `_.forOwn`
     * may be used for object iteration.
     *
     * @static
     * @memberOf _
     * @alias each
     * @category Collection
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {Array|Object|string} Returns `collection`.
     * @example
     *
     * _([1, 2]).forEach(function(n) {
     *   console.log(n);
     * }).value();
     * // => logs each value from left to right and returns the array
     *
     * _.forEach({ 'a': 1, 'b': 2 }, function(n, key) {
     *   console.log(n, key);
     * });
     * // => logs each value-key pair and returns the object (iteration order is not guaranteed)
     */
    var forEach = createForEach(arrayEach, baseEach);

    /**
     * This method is like `_.forEach` except that it iterates over elements of
     * `collection` from right to left.
     *
     * @static
     * @memberOf _
     * @alias eachRight
     * @category Collection
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {Array|Object|string} Returns `collection`.
     * @example
     *
     * _([1, 2]).forEachRight(function(n) {
     *   console.log(n);
     * }).value();
     * // => logs each value from right to left and returns the array
     */
    var forEachRight = createForEach(arrayEachRight, baseEachRight);

    /**
     * Creates an object composed of keys generated from the results of running
     * each element of `collection` through `iteratee`. The corresponding value
     * of each key is an array of the elements responsible for generating the key.
     * The `iteratee` is bound to `thisArg` and invoked with three arguments:
     * (value, index|key, collection).
     *
     * If a property name is provided for `iteratee` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `iteratee` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [iteratee=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {Object} Returns the composed aggregate object.
     * @example
     *
     * _.groupBy([4.2, 6.1, 6.4], function(n) {
     *   return Math.floor(n);
     * });
     * // => { '4': [4.2], '6': [6.1, 6.4] }
     *
     * _.groupBy([4.2, 6.1, 6.4], function(n) {
     *   return this.floor(n);
     * }, Math);
     * // => { '4': [4.2], '6': [6.1, 6.4] }
     *
     * // using the `_.property` callback shorthand
     * _.groupBy(['one', 'two', 'three'], 'length');
     * // => { '3': ['one', 'two'], '5': ['three'] }
     */
    var groupBy = createAggregator(function(result, value, key) {
      if (hasOwnProperty.call(result, key)) {
        result[key].push(value);
      } else {
        result[key] = [value];
      }
    });

    /**
     * Checks if `value` is in `collection` using
     * [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
     * for equality comparisons. If `fromIndex` is negative, it is used as the offset
     * from the end of `collection`.
     *
     * @static
     * @memberOf _
     * @alias contains, include
     * @category Collection
     * @param {Array|Object|string} collection The collection to search.
     * @param {*} target The value to search for.
     * @param {number} [fromIndex=0] The index to search from.
     * @param- {Object} [guard] Enables use as a callback for functions like `_.reduce`.
     * @returns {boolean} Returns `true` if a matching element is found, else `false`.
     * @example
     *
     * _.includes([1, 2, 3], 1);
     * // => true
     *
     * _.includes([1, 2, 3], 1, 2);
     * // => false
     *
     * _.includes({ 'user': 'fred', 'age': 40 }, 'fred');
     * // => true
     *
     * _.includes('pebbles', 'eb');
     * // => true
     */
    function includes(collection, target, fromIndex, guard) {
      var length = collection ? getLength(collection) : 0;
      if (!isLength(length)) {
        collection = values(collection);
        length = collection.length;
      }
      if (typeof fromIndex != 'number' || (guard && isIterateeCall(target, fromIndex, guard))) {
        fromIndex = 0;
      } else {
        fromIndex = fromIndex < 0 ? nativeMax(length + fromIndex, 0) : (fromIndex || 0);
      }
      return (typeof collection == 'string' || !isArray(collection) && isString(collection))
        ? (fromIndex <= length && collection.indexOf(target, fromIndex) > -1)
        : (!!length && getIndexOf(collection, target, fromIndex) > -1);
    }

    /**
     * Creates an object composed of keys generated from the results of running
     * each element of `collection` through `iteratee`. The corresponding value
     * of each key is the last element responsible for generating the key. The
     * iteratee function is bound to `thisArg` and invoked with three arguments:
     * (value, index|key, collection).
     *
     * If a property name is provided for `iteratee` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `iteratee` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [iteratee=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {Object} Returns the composed aggregate object.
     * @example
     *
     * var keyData = [
     *   { 'dir': 'left', 'code': 97 },
     *   { 'dir': 'right', 'code': 100 }
     * ];
     *
     * _.indexBy(keyData, 'dir');
     * // => { 'left': { 'dir': 'left', 'code': 97 }, 'right': { 'dir': 'right', 'code': 100 } }
     *
     * _.indexBy(keyData, function(object) {
     *   return String.fromCharCode(object.code);
     * });
     * // => { 'a': { 'dir': 'left', 'code': 97 }, 'd': { 'dir': 'right', 'code': 100 } }
     *
     * _.indexBy(keyData, function(object) {
     *   return this.fromCharCode(object.code);
     * }, String);
     * // => { 'a': { 'dir': 'left', 'code': 97 }, 'd': { 'dir': 'right', 'code': 100 } }
     */
    var indexBy = createAggregator(function(result, value, key) {
      result[key] = value;
    });

    /**
     * Invokes the method at `path` of each element in `collection`, returning
     * an array of the results of each invoked method. Any additional arguments
     * are provided to each invoked method. If `methodName` is a function it is
     * invoked for, and `this` bound to, each element in `collection`.
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Array|Function|string} path The path of the method to invoke or
     *  the function invoked per iteration.
     * @param {...*} [args] The arguments to invoke the method with.
     * @returns {Array} Returns the array of results.
     * @example
     *
     * _.invoke([[5, 1, 7], [3, 2, 1]], 'sort');
     * // => [[1, 5, 7], [1, 2, 3]]
     *
     * _.invoke([123, 456], String.prototype.split, '');
     * // => [['1', '2', '3'], ['4', '5', '6']]
     */
    var invoke = restParam(function(collection, path, args) {
      var index = -1,
          isFunc = typeof path == 'function',
          isProp = isKey(path),
          result = isArrayLike(collection) ? Array(collection.length) : [];

      baseEach(collection, function(value) {
        var func = isFunc ? path : ((isProp && value != null) ? value[path] : undefined);
        result[++index] = func ? func.apply(value, args) : invokePath(value, path, args);
      });
      return result;
    });

    /**
     * Creates an array of values by running each element in `collection` through
     * `iteratee`. The `iteratee` is bound to `thisArg` and invoked with three
     * arguments: (value, index|key, collection).
     *
     * If a property name is provided for `iteratee` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `iteratee` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * Many lodash methods are guarded to work as iteratees for methods like
     * `_.every`, `_.filter`, `_.map`, `_.mapValues`, `_.reject`, and `_.some`.
     *
     * The guarded methods are:
     * `ary`, `callback`, `chunk`, `clone`, `create`, `curry`, `curryRight`,
     * `drop`, `dropRight`, `every`, `fill`, `flatten`, `invert`, `max`, `min`,
     * `parseInt`, `slice`, `sortBy`, `take`, `takeRight`, `template`, `trim`,
     * `trimLeft`, `trimRight`, `trunc`, `random`, `range`, `sample`, `some`,
     * `sum`, `uniq`, and `words`
     *
     * @static
     * @memberOf _
     * @alias collect
     * @category Collection
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [iteratee=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {Array} Returns the new mapped array.
     * @example
     *
     * function timesThree(n) {
     *   return n * 3;
     * }
     *
     * _.map([1, 2], timesThree);
     * // => [3, 6]
     *
     * _.map({ 'a': 1, 'b': 2 }, timesThree);
     * // => [3, 6] (iteration order is not guaranteed)
     *
     * var users = [
     *   { 'user': 'barney' },
     *   { 'user': 'fred' }
     * ];
     *
     * // using the `_.property` callback shorthand
     * _.map(users, 'user');
     * // => ['barney', 'fred']
     */
    function map(collection, iteratee, thisArg) {
      var func = isArray(collection) ? arrayMap : baseMap;
      iteratee = getCallback(iteratee, thisArg, 3);
      return func(collection, iteratee);
    }

    /**
     * Creates an array of elements split into two groups, the first of which
     * contains elements `predicate` returns truthy for, while the second of which
     * contains elements `predicate` returns falsey for. The predicate is bound
     * to `thisArg` and invoked with three arguments: (value, index|key, collection).
     *
     * If a property name is provided for `predicate` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `predicate` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [predicate=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {Array} Returns the array of grouped elements.
     * @example
     *
     * _.partition([1, 2, 3], function(n) {
     *   return n % 2;
     * });
     * // => [[1, 3], [2]]
     *
     * _.partition([1.2, 2.3, 3.4], function(n) {
     *   return this.floor(n) % 2;
     * }, Math);
     * // => [[1.2, 3.4], [2.3]]
     *
     * var users = [
     *   { 'user': 'barney',  'age': 36, 'active': false },
     *   { 'user': 'fred',    'age': 40, 'active': true },
     *   { 'user': 'pebbles', 'age': 1,  'active': false }
     * ];
     *
     * var mapper = function(array) {
     *   return _.pluck(array, 'user');
     * };
     *
     * // using the `_.matches` callback shorthand
     * _.map(_.partition(users, { 'age': 1, 'active': false }), mapper);
     * // => [['pebbles'], ['barney', 'fred']]
     *
     * // using the `_.matchesProperty` callback shorthand
     * _.map(_.partition(users, 'active', false), mapper);
     * // => [['barney', 'pebbles'], ['fred']]
     *
     * // using the `_.property` callback shorthand
     * _.map(_.partition(users, 'active'), mapper);
     * // => [['fred'], ['barney', 'pebbles']]
     */
    var partition = createAggregator(function(result, value, key) {
      result[key ? 0 : 1].push(value);
    }, function() { return [[], []]; });

    /**
     * Gets the property value of `path` from all elements in `collection`.
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Array|string} path The path of the property to pluck.
     * @returns {Array} Returns the property values.
     * @example
     *
     * var users = [
     *   { 'user': 'barney', 'age': 36 },
     *   { 'user': 'fred',   'age': 40 }
     * ];
     *
     * _.pluck(users, 'user');
     * // => ['barney', 'fred']
     *
     * var userIndex = _.indexBy(users, 'user');
     * _.pluck(userIndex, 'age');
     * // => [36, 40] (iteration order is not guaranteed)
     */
    function pluck(collection, path) {
      return map(collection, property(path));
    }

    /**
     * Reduces `collection` to a value which is the accumulated result of running
     * each element in `collection` through `iteratee`, where each successive
     * invocation is supplied the return value of the previous. If `accumulator`
     * is not provided the first element of `collection` is used as the initial
     * value. The `iteratee` is bound to `thisArg` and invoked with four arguments:
     * (accumulator, value, index|key, collection).
     *
     * Many lodash methods are guarded to work as iteratees for methods like
     * `_.reduce`, `_.reduceRight`, and `_.transform`.
     *
     * The guarded methods are:
     * `assign`, `defaults`, `defaultsDeep`, `includes`, `merge`, `sortByAll`,
     * and `sortByOrder`
     *
     * @static
     * @memberOf _
     * @alias foldl, inject
     * @category Collection
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @param {*} [accumulator] The initial value.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {*} Returns the accumulated value.
     * @example
     *
     * _.reduce([1, 2], function(total, n) {
     *   return total + n;
     * });
     * // => 3
     *
     * _.reduce({ 'a': 1, 'b': 2 }, function(result, n, key) {
     *   result[key] = n * 3;
     *   return result;
     * }, {});
     * // => { 'a': 3, 'b': 6 } (iteration order is not guaranteed)
     */
    var reduce = createReduce(arrayReduce, baseEach);

    /**
     * This method is like `_.reduce` except that it iterates over elements of
     * `collection` from right to left.
     *
     * @static
     * @memberOf _
     * @alias foldr
     * @category Collection
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @param {*} [accumulator] The initial value.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {*} Returns the accumulated value.
     * @example
     *
     * var array = [[0, 1], [2, 3], [4, 5]];
     *
     * _.reduceRight(array, function(flattened, other) {
     *   return flattened.concat(other);
     * }, []);
     * // => [4, 5, 2, 3, 0, 1]
     */
    var reduceRight = createReduce(arrayReduceRight, baseEachRight);

    /**
     * The opposite of `_.filter`; this method returns the elements of `collection`
     * that `predicate` does **not** return truthy for.
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [predicate=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {Array} Returns the new filtered array.
     * @example
     *
     * _.reject([1, 2, 3, 4], function(n) {
     *   return n % 2 == 0;
     * });
     * // => [1, 3]
     *
     * var users = [
     *   { 'user': 'barney', 'age': 36, 'active': false },
     *   { 'user': 'fred',   'age': 40, 'active': true }
     * ];
     *
     * // using the `_.matches` callback shorthand
     * _.pluck(_.reject(users, { 'age': 40, 'active': true }), 'user');
     * // => ['barney']
     *
     * // using the `_.matchesProperty` callback shorthand
     * _.pluck(_.reject(users, 'active', false), 'user');
     * // => ['fred']
     *
     * // using the `_.property` callback shorthand
     * _.pluck(_.reject(users, 'active'), 'user');
     * // => ['barney']
     */
    function reject(collection, predicate, thisArg) {
      var func = isArray(collection) ? arrayFilter : baseFilter;
      predicate = getCallback(predicate, thisArg, 3);
      return func(collection, function(value, index, collection) {
        return !predicate(value, index, collection);
      });
    }

    /**
     * Gets a random element or `n` random elements from a collection.
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object|string} collection The collection to sample.
     * @param {number} [n] The number of elements to sample.
     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
     * @returns {*} Returns the random sample(s).
     * @example
     *
     * _.sample([1, 2, 3, 4]);
     * // => 2
     *
     * _.sample([1, 2, 3, 4], 2);
     * // => [3, 1]
     */
    function sample(collection, n, guard) {
      if (guard ? isIterateeCall(collection, n, guard) : n == null) {
        collection = toIterable(collection);
        var length = collection.length;
        return length > 0 ? collection[baseRandom(0, length - 1)] : undefined;
      }
      var index = -1,
          result = toArray(collection),
          length = result.length,
          lastIndex = length - 1;

      n = nativeMin(n < 0 ? 0 : (+n || 0), length);
      while (++index < n) {
        var rand = baseRandom(index, lastIndex),
            value = result[rand];

        result[rand] = result[index];
        result[index] = value;
      }
      result.length = n;
      return result;
    }

    /**
     * Creates an array of shuffled values, using a version of the
     * [Fisher-Yates shuffle](https://en.wikipedia.org/wiki/Fisher-Yates_shuffle).
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object|string} collection The collection to shuffle.
     * @returns {Array} Returns the new shuffled array.
     * @example
     *
     * _.shuffle([1, 2, 3, 4]);
     * // => [4, 1, 3, 2]
     */
    function shuffle(collection) {
      return sample(collection, POSITIVE_INFINITY);
    }

    /**
     * Gets the size of `collection` by returning its length for array-like
     * values or the number of own enumerable properties for objects.
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object|string} collection The collection to inspect.
     * @returns {number} Returns the size of `collection`.
     * @example
     *
     * _.size([1, 2, 3]);
     * // => 3
     *
     * _.size({ 'a': 1, 'b': 2 });
     * // => 2
     *
     * _.size('pebbles');
     * // => 7
     */
    function size(collection) {
      var length = collection ? getLength(collection) : 0;
      return isLength(length) ? length : keys(collection).length;
    }

    /**
     * Checks if `predicate` returns truthy for **any** element of `collection`.
     * The function returns as soon as it finds a passing value and does not iterate
     * over the entire collection. The predicate is bound to `thisArg` and invoked
     * with three arguments: (value, index|key, collection).
     *
     * If a property name is provided for `predicate` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `predicate` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @alias any
     * @category Collection
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [predicate=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {boolean} Returns `true` if any element passes the predicate check,
     *  else `false`.
     * @example
     *
     * _.some([null, 0, 'yes', false], Boolean);
     * // => true
     *
     * var users = [
     *   { 'user': 'barney', 'active': true },
     *   { 'user': 'fred',   'active': false }
     * ];
     *
     * // using the `_.matches` callback shorthand
     * _.some(users, { 'user': 'barney', 'active': false });
     * // => false
     *
     * // using the `_.matchesProperty` callback shorthand
     * _.some(users, 'active', false);
     * // => true
     *
     * // using the `_.property` callback shorthand
     * _.some(users, 'active');
     * // => true
     */
    function some(collection, predicate, thisArg) {
      var func = isArray(collection) ? arraySome : baseSome;
      if (thisArg && isIterateeCall(collection, predicate, thisArg)) {
        predicate = undefined;
      }
      if (typeof predicate != 'function' || thisArg !== undefined) {
        predicate = getCallback(predicate, thisArg, 3);
      }
      return func(collection, predicate);
    }

    /**
     * Creates an array of elements, sorted in ascending order by the results of
     * running each element in a collection through `iteratee`. This method performs
     * a stable sort, that is, it preserves the original sort order of equal elements.
     * The `iteratee` is bound to `thisArg` and invoked with three arguments:
     * (value, index|key, collection).
     *
     * If a property name is provided for `iteratee` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `iteratee` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [iteratee=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {Array} Returns the new sorted array.
     * @example
     *
     * _.sortBy([1, 2, 3], function(n) {
     *   return Math.sin(n);
     * });
     * // => [3, 1, 2]
     *
     * _.sortBy([1, 2, 3], function(n) {
     *   return this.sin(n);
     * }, Math);
     * // => [3, 1, 2]
     *
     * var users = [
     *   { 'user': 'fred' },
     *   { 'user': 'pebbles' },
     *   { 'user': 'barney' }
     * ];
     *
     * // using the `_.property` callback shorthand
     * _.pluck(_.sortBy(users, 'user'), 'user');
     * // => ['barney', 'fred', 'pebbles']
     */
    function sortBy(collection, iteratee, thisArg) {
      if (collection == null) {
        return [];
      }
      if (thisArg && isIterateeCall(collection, iteratee, thisArg)) {
        iteratee = undefined;
      }
      var index = -1;
      iteratee = getCallback(iteratee, thisArg, 3);

      var result = baseMap(collection, function(value, key, collection) {
        return { 'criteria': iteratee(value, key, collection), 'index': ++index, 'value': value };
      });
      return baseSortBy(result, compareAscending);
    }

    /**
     * This method is like `_.sortBy` except that it can sort by multiple iteratees
     * or property names.
     *
     * If a property name is provided for an iteratee the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If an object is provided for an iteratee the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {...(Function|Function[]|Object|Object[]|string|string[])} iteratees
     *  The iteratees to sort by, specified as individual values or arrays of values.
     * @returns {Array} Returns the new sorted array.
     * @example
     *
     * var users = [
     *   { 'user': 'fred',   'age': 48 },
     *   { 'user': 'barney', 'age': 36 },
     *   { 'user': 'fred',   'age': 42 },
     *   { 'user': 'barney', 'age': 34 }
     * ];
     *
     * _.map(_.sortByAll(users, ['user', 'age']), _.values);
     * // => [['barney', 34], ['barney', 36], ['fred', 42], ['fred', 48]]
     *
     * _.map(_.sortByAll(users, 'user', function(chr) {
     *   return Math.floor(chr.age / 10);
     * }), _.values);
     * // => [['barney', 36], ['barney', 34], ['fred', 48], ['fred', 42]]
     */
    var sortByAll = restParam(function(collection, iteratees) {
      if (collection == null) {
        return [];
      }
      var guard = iteratees[2];
      if (guard && isIterateeCall(iteratees[0], iteratees[1], guard)) {
        iteratees.length = 1;
      }
      return baseSortByOrder(collection, baseFlatten(iteratees), []);
    });

    /**
     * This method is like `_.sortByAll` except that it allows specifying the
     * sort orders of the iteratees to sort by. If `orders` is unspecified, all
     * values are sorted in ascending order. Otherwise, a value is sorted in
     * ascending order if its corresponding order is "asc", and descending if "desc".
     *
     * If a property name is provided for an iteratee the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If an object is provided for an iteratee the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function[]|Object[]|string[]} iteratees The iteratees to sort by.
     * @param {boolean[]} [orders] The sort orders of `iteratees`.
     * @param- {Object} [guard] Enables use as a callback for functions like `_.reduce`.
     * @returns {Array} Returns the new sorted array.
     * @example
     *
     * var users = [
     *   { 'user': 'fred',   'age': 48 },
     *   { 'user': 'barney', 'age': 34 },
     *   { 'user': 'fred',   'age': 42 },
     *   { 'user': 'barney', 'age': 36 }
     * ];
     *
     * // sort by `user` in ascending order and by `age` in descending order
     * _.map(_.sortByOrder(users, ['user', 'age'], ['asc', 'desc']), _.values);
     * // => [['barney', 36], ['barney', 34], ['fred', 48], ['fred', 42]]
     */
    function sortByOrder(collection, iteratees, orders, guard) {
      if (collection == null) {
        return [];
      }
      if (guard && isIterateeCall(iteratees, orders, guard)) {
        orders = undefined;
      }
      if (!isArray(iteratees)) {
        iteratees = iteratees == null ? [] : [iteratees];
      }
      if (!isArray(orders)) {
        orders = orders == null ? [] : [orders];
      }
      return baseSortByOrder(collection, iteratees, orders);
    }

    /**
     * Performs a deep comparison between each element in `collection` and the
     * source object, returning an array of all elements that have equivalent
     * property values.
     *
     * **Note:** This method supports comparing arrays, booleans, `Date` objects,
     * numbers, `Object` objects, regexes, and strings. Objects are compared by
     * their own, not inherited, enumerable properties. For comparing a single
     * own or inherited property value see `_.matchesProperty`.
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object|string} collection The collection to search.
     * @param {Object} source The object of property values to match.
     * @returns {Array} Returns the new filtered array.
     * @example
     *
     * var users = [
     *   { 'user': 'barney', 'age': 36, 'active': false, 'pets': ['hoppy'] },
     *   { 'user': 'fred',   'age': 40, 'active': true, 'pets': ['baby puss', 'dino'] }
     * ];
     *
     * _.pluck(_.where(users, { 'age': 36, 'active': false }), 'user');
     * // => ['barney']
     *
     * _.pluck(_.where(users, { 'pets': ['dino'] }), 'user');
     * // => ['fred']
     */
    function where(collection, source) {
      return filter(collection, baseMatches(source));
    }

    /*------------------------------------------------------------------------*/

    /**
     * Gets the number of milliseconds that have elapsed since the Unix epoch
     * (1 January 1970 00:00:00 UTC).
     *
     * @static
     * @memberOf _
     * @category Date
     * @example
     *
     * _.defer(function(stamp) {
     *   console.log(_.now() - stamp);
     * }, _.now());
     * // => logs the number of milliseconds it took for the deferred function to be invoked
     */
    var now = nativeNow || function() {
      return new Date().getTime();
    };

    /*------------------------------------------------------------------------*/

    /**
     * The opposite of `_.before`; this method creates a function that invokes
     * `func` once it is called `n` or more times.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {number} n The number of calls before `func` is invoked.
     * @param {Function} func The function to restrict.
     * @returns {Function} Returns the new restricted function.
     * @example
     *
     * var saves = ['profile', 'settings'];
     *
     * var done = _.after(saves.length, function() {
     *   console.log('done saving!');
     * });
     *
     * _.forEach(saves, function(type) {
     *   asyncSave({ 'type': type, 'complete': done });
     * });
     * // => logs 'done saving!' after the two async saves have completed
     */
    function after(n, func) {
      if (typeof func != 'function') {
        if (typeof n == 'function') {
          var temp = n;
          n = func;
          func = temp;
        } else {
          throw new TypeError(FUNC_ERROR_TEXT);
        }
      }
      n = nativeIsFinite(n = +n) ? n : 0;
      return function() {
        if (--n < 1) {
          return func.apply(this, arguments);
        }
      };
    }

    /**
     * Creates a function that accepts up to `n` arguments ignoring any
     * additional arguments.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func The function to cap arguments for.
     * @param {number} [n=func.length] The arity cap.
     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
     * @returns {Function} Returns the new function.
     * @example
     *
     * _.map(['6', '8', '10'], _.ary(parseInt, 1));
     * // => [6, 8, 10]
     */
    function ary(func, n, guard) {
      if (guard && isIterateeCall(func, n, guard)) {
        n = undefined;
      }
      n = (func && n == null) ? func.length : nativeMax(+n || 0, 0);
      return createWrapper(func, ARY_FLAG, undefined, undefined, undefined, undefined, n);
    }

    /**
     * Creates a function that invokes `func`, with the `this` binding and arguments
     * of the created function, while it is called less than `n` times. Subsequent
     * calls to the created function return the result of the last `func` invocation.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {number} n The number of calls at which `func` is no longer invoked.
     * @param {Function} func The function to restrict.
     * @returns {Function} Returns the new restricted function.
     * @example
     *
     * jQuery('#add').on('click', _.before(5, addContactToList));
     * // => allows adding up to 4 contacts to the list
     */
    function before(n, func) {
      var result;
      if (typeof func != 'function') {
        if (typeof n == 'function') {
          var temp = n;
          n = func;
          func = temp;
        } else {
          throw new TypeError(FUNC_ERROR_TEXT);
        }
      }
      return function() {
        if (--n > 0) {
          result = func.apply(this, arguments);
        }
        if (n <= 1) {
          func = undefined;
        }
        return result;
      };
    }

    /**
     * Creates a function that invokes `func` with the `this` binding of `thisArg`
     * and prepends any additional `_.bind` arguments to those provided to the
     * bound function.
     *
     * The `_.bind.placeholder` value, which defaults to `_` in monolithic builds,
     * may be used as a placeholder for partially applied arguments.
     *
     * **Note:** Unlike native `Function#bind` this method does not set the "length"
     * property of bound functions.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func The function to bind.
     * @param {*} thisArg The `this` binding of `func`.
     * @param {...*} [partials] The arguments to be partially applied.
     * @returns {Function} Returns the new bound function.
     * @example
     *
     * var greet = function(greeting, punctuation) {
     *   return greeting + ' ' + this.user + punctuation;
     * };
     *
     * var object = { 'user': 'fred' };
     *
     * var bound = _.bind(greet, object, 'hi');
     * bound('!');
     * // => 'hi fred!'
     *
     * // using placeholders
     * var bound = _.bind(greet, object, _, '!');
     * bound('hi');
     * // => 'hi fred!'
     */
    var bind = restParam(function(func, thisArg, partials) {
      var bitmask = BIND_FLAG;
      if (partials.length) {
        var holders = replaceHolders(partials, bind.placeholder);
        bitmask |= PARTIAL_FLAG;
      }
      return createWrapper(func, bitmask, thisArg, partials, holders);
    });

    /**
     * Binds methods of an object to the object itself, overwriting the existing
     * method. Method names may be specified as individual arguments or as arrays
     * of method names. If no method names are provided all enumerable function
     * properties, own and inherited, of `object` are bound.
     *
     * **Note:** This method does not set the "length" property of bound functions.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Object} object The object to bind and assign the bound methods to.
     * @param {...(string|string[])} [methodNames] The object method names to bind,
     *  specified as individual method names or arrays of method names.
     * @returns {Object} Returns `object`.
     * @example
     *
     * var view = {
     *   'label': 'docs',
     *   'onClick': function() {
     *     console.log('clicked ' + this.label);
     *   }
     * };
     *
     * _.bindAll(view);
     * jQuery('#docs').on('click', view.onClick);
     * // => logs 'clicked docs' when the element is clicked
     */
    var bindAll = restParam(function(object, methodNames) {
      methodNames = methodNames.length ? baseFlatten(methodNames) : functions(object);

      var index = -1,
          length = methodNames.length;

      while (++index < length) {
        var key = methodNames[index];
        object[key] = createWrapper(object[key], BIND_FLAG, object);
      }
      return object;
    });

    /**
     * Creates a function that invokes the method at `object[key]` and prepends
     * any additional `_.bindKey` arguments to those provided to the bound function.
     *
     * This method differs from `_.bind` by allowing bound functions to reference
     * methods that may be redefined or don't yet exist.
     * See [Peter Michaux's article](http://peter.michaux.ca/articles/lazy-function-definition-pattern)
     * for more details.
     *
     * The `_.bindKey.placeholder` value, which defaults to `_` in monolithic
     * builds, may be used as a placeholder for partially applied arguments.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Object} object The object the method belongs to.
     * @param {string} key The key of the method.
     * @param {...*} [partials] The arguments to be partially applied.
     * @returns {Function} Returns the new bound function.
     * @example
     *
     * var object = {
     *   'user': 'fred',
     *   'greet': function(greeting, punctuation) {
     *     return greeting + ' ' + this.user + punctuation;
     *   }
     * };
     *
     * var bound = _.bindKey(object, 'greet', 'hi');
     * bound('!');
     * // => 'hi fred!'
     *
     * object.greet = function(greeting, punctuation) {
     *   return greeting + 'ya ' + this.user + punctuation;
     * };
     *
     * bound('!');
     * // => 'hiya fred!'
     *
     * // using placeholders
     * var bound = _.bindKey(object, 'greet', _, '!');
     * bound('hi');
     * // => 'hiya fred!'
     */
    var bindKey = restParam(function(object, key, partials) {
      var bitmask = BIND_FLAG | BIND_KEY_FLAG;
      if (partials.length) {
        var holders = replaceHolders(partials, bindKey.placeholder);
        bitmask |= PARTIAL_FLAG;
      }
      return createWrapper(key, bitmask, object, partials, holders);
    });

    /**
     * Creates a function that accepts one or more arguments of `func` that when
     * called either invokes `func` returning its result, if all `func` arguments
     * have been provided, or returns a function that accepts one or more of the
     * remaining `func` arguments, and so on. The arity of `func` may be specified
     * if `func.length` is not sufficient.
     *
     * The `_.curry.placeholder` value, which defaults to `_` in monolithic builds,
     * may be used as a placeholder for provided arguments.
     *
     * **Note:** This method does not set the "length" property of curried functions.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func The function to curry.
     * @param {number} [arity=func.length] The arity of `func`.
     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
     * @returns {Function} Returns the new curried function.
     * @example
     *
     * var abc = function(a, b, c) {
     *   return [a, b, c];
     * };
     *
     * var curried = _.curry(abc);
     *
     * curried(1)(2)(3);
     * // => [1, 2, 3]
     *
     * curried(1, 2)(3);
     * // => [1, 2, 3]
     *
     * curried(1, 2, 3);
     * // => [1, 2, 3]
     *
     * // using placeholders
     * curried(1)(_, 3)(2);
     * // => [1, 2, 3]
     */
    var curry = createCurry(CURRY_FLAG);

    /**
     * This method is like `_.curry` except that arguments are applied to `func`
     * in the manner of `_.partialRight` instead of `_.partial`.
     *
     * The `_.curryRight.placeholder` value, which defaults to `_` in monolithic
     * builds, may be used as a placeholder for provided arguments.
     *
     * **Note:** This method does not set the "length" property of curried functions.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func The function to curry.
     * @param {number} [arity=func.length] The arity of `func`.
     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
     * @returns {Function} Returns the new curried function.
     * @example
     *
     * var abc = function(a, b, c) {
     *   return [a, b, c];
     * };
     *
     * var curried = _.curryRight(abc);
     *
     * curried(3)(2)(1);
     * // => [1, 2, 3]
     *
     * curried(2, 3)(1);
     * // => [1, 2, 3]
     *
     * curried(1, 2, 3);
     * // => [1, 2, 3]
     *
     * // using placeholders
     * curried(3)(1, _)(2);
     * // => [1, 2, 3]
     */
    var curryRight = createCurry(CURRY_RIGHT_FLAG);

    /**
     * Creates a debounced function that delays invoking `func` until after `wait`
     * milliseconds have elapsed since the last time the debounced function was
     * invoked. The debounced function comes with a `cancel` method to cancel
     * delayed invocations. Provide an options object to indicate that `func`
     * should be invoked on the leading and/or trailing edge of the `wait` timeout.
     * Subsequent calls to the debounced function return the result of the last
     * `func` invocation.
     *
     * **Note:** If `leading` and `trailing` options are `true`, `func` is invoked
     * on the trailing edge of the timeout only if the the debounced function is
     * invoked more than once during the `wait` timeout.
     *
     * See [David Corbacho's article](http://drupalmotion.com/article/debounce-and-throttle-visual-explanation)
     * for details over the differences between `_.debounce` and `_.throttle`.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func The function to debounce.
     * @param {number} [wait=0] The number of milliseconds to delay.
     * @param {Object} [options] The options object.
     * @param {boolean} [options.leading=false] Specify invoking on the leading
     *  edge of the timeout.
     * @param {number} [options.maxWait] The maximum time `func` is allowed to be
     *  delayed before it is invoked.
     * @param {boolean} [options.trailing=true] Specify invoking on the trailing
     *  edge of the timeout.
     * @returns {Function} Returns the new debounced function.
     * @example
     *
     * // avoid costly calculations while the window size is in flux
     * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
     *
     * // invoke `sendMail` when the click event is fired, debouncing subsequent calls
     * jQuery('#postbox').on('click', _.debounce(sendMail, 300, {
     *   'leading': true,
     *   'trailing': false
     * }));
     *
     * // ensure `batchLog` is invoked once after 1 second of debounced calls
     * var source = new EventSource('/stream');
     * jQuery(source).on('message', _.debounce(batchLog, 250, {
     *   'maxWait': 1000
     * }));
     *
     * // cancel a debounced call
     * var todoChanges = _.debounce(batchLog, 1000);
     * Object.observe(models.todo, todoChanges);
     *
     * Object.observe(models, function(changes) {
     *   if (_.find(changes, { 'user': 'todo', 'type': 'delete'})) {
     *     todoChanges.cancel();
     *   }
     * }, ['delete']);
     *
     * // ...at some point `models.todo` is changed
     * models.todo.completed = true;
     *
     * // ...before 1 second has passed `models.todo` is deleted
     * // which cancels the debounced `todoChanges` call
     * delete models.todo;
     */
    function debounce(func, wait, options) {
      var args,
          maxTimeoutId,
          result,
          stamp,
          thisArg,
          timeoutId,
          trailingCall,
          lastCalled = 0,
          maxWait = false,
          trailing = true;

      if (typeof func != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      wait = wait < 0 ? 0 : (+wait || 0);
      if (options === true) {
        var leading = true;
        trailing = false;
      } else if (isObject(options)) {
        leading = !!options.leading;
        maxWait = 'maxWait' in options && nativeMax(+options.maxWait || 0, wait);
        trailing = 'trailing' in options ? !!options.trailing : trailing;
      }

      function cancel() {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        if (maxTimeoutId) {
          clearTimeout(maxTimeoutId);
        }
        lastCalled = 0;
        maxTimeoutId = timeoutId = trailingCall = undefined;
      }

      function complete(isCalled, id) {
        if (id) {
          clearTimeout(id);
        }
        maxTimeoutId = timeoutId = trailingCall = undefined;
        if (isCalled) {
          lastCalled = now();
          result = func.apply(thisArg, args);
          if (!timeoutId && !maxTimeoutId) {
            args = thisArg = undefined;
          }
        }
      }

      function delayed() {
        var remaining = wait - (now() - stamp);
        if (remaining <= 0 || remaining > wait) {
          complete(trailingCall, maxTimeoutId);
        } else {
          timeoutId = setTimeout(delayed, remaining);
        }
      }

      function maxDelayed() {
        complete(trailing, timeoutId);
      }

      function debounced() {
        args = arguments;
        stamp = now();
        thisArg = this;
        trailingCall = trailing && (timeoutId || !leading);

        if (maxWait === false) {
          var leadingCall = leading && !timeoutId;
        } else {
          if (!maxTimeoutId && !leading) {
            lastCalled = stamp;
          }
          var remaining = maxWait - (stamp - lastCalled),
              isCalled = remaining <= 0 || remaining > maxWait;

          if (isCalled) {
            if (maxTimeoutId) {
              maxTimeoutId = clearTimeout(maxTimeoutId);
            }
            lastCalled = stamp;
            result = func.apply(thisArg, args);
          }
          else if (!maxTimeoutId) {
            maxTimeoutId = setTimeout(maxDelayed, remaining);
          }
        }
        if (isCalled && timeoutId) {
          timeoutId = clearTimeout(timeoutId);
        }
        else if (!timeoutId && wait !== maxWait) {
          timeoutId = setTimeout(delayed, wait);
        }
        if (leadingCall) {
          isCalled = true;
          result = func.apply(thisArg, args);
        }
        if (isCalled && !timeoutId && !maxTimeoutId) {
          args = thisArg = undefined;
        }
        return result;
      }
      debounced.cancel = cancel;
      return debounced;
    }

    /**
     * Defers invoking the `func` until the current call stack has cleared. Any
     * additional arguments are provided to `func` when it is invoked.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func The function to defer.
     * @param {...*} [args] The arguments to invoke the function with.
     * @returns {number} Returns the timer id.
     * @example
     *
     * _.defer(function(text) {
     *   console.log(text);
     * }, 'deferred');
     * // logs 'deferred' after one or more milliseconds
     */
    var defer = restParam(function(func, args) {
      return baseDelay(func, 1, args);
    });

    /**
     * Invokes `func` after `wait` milliseconds. Any additional arguments are
     * provided to `func` when it is invoked.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func The function to delay.
     * @param {number} wait The number of milliseconds to delay invocation.
     * @param {...*} [args] The arguments to invoke the function with.
     * @returns {number} Returns the timer id.
     * @example
     *
     * _.delay(function(text) {
     *   console.log(text);
     * }, 1000, 'later');
     * // => logs 'later' after one second
     */
    var delay = restParam(function(func, wait, args) {
      return baseDelay(func, wait, args);
    });

    /**
     * Creates a function that returns the result of invoking the provided
     * functions with the `this` binding of the created function, where each
     * successive invocation is supplied the return value of the previous.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {...Function} [funcs] Functions to invoke.
     * @returns {Function} Returns the new function.
     * @example
     *
     * function square(n) {
     *   return n * n;
     * }
     *
     * var addSquare = _.flow(_.add, square);
     * addSquare(1, 2);
     * // => 9
     */
    var flow = createFlow();

    /**
     * This method is like `_.flow` except that it creates a function that
     * invokes the provided functions from right to left.
     *
     * @static
     * @memberOf _
     * @alias backflow, compose
     * @category Function
     * @param {...Function} [funcs] Functions to invoke.
     * @returns {Function} Returns the new function.
     * @example
     *
     * function square(n) {
     *   return n * n;
     * }
     *
     * var addSquare = _.flowRight(square, _.add);
     * addSquare(1, 2);
     * // => 9
     */
    var flowRight = createFlow(true);

    /**
     * Creates a function that memoizes the result of `func`. If `resolver` is
     * provided it determines the cache key for storing the result based on the
     * arguments provided to the memoized function. By default, the first argument
     * provided to the memoized function is coerced to a string and used as the
     * cache key. The `func` is invoked with the `this` binding of the memoized
     * function.
     *
     * **Note:** The cache is exposed as the `cache` property on the memoized
     * function. Its creation may be customized by replacing the `_.memoize.Cache`
     * constructor with one whose instances implement the [`Map`](http://ecma-international.org/ecma-262/6.0/#sec-properties-of-the-map-prototype-object)
     * method interface of `get`, `has`, and `set`.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func The function to have its output memoized.
     * @param {Function} [resolver] The function to resolve the cache key.
     * @returns {Function} Returns the new memoizing function.
     * @example
     *
     * var upperCase = _.memoize(function(string) {
     *   return string.toUpperCase();
     * });
     *
     * upperCase('fred');
     * // => 'FRED'
     *
     * // modifying the result cache
     * upperCase.cache.set('fred', 'BARNEY');
     * upperCase('fred');
     * // => 'BARNEY'
     *
     * // replacing `_.memoize.Cache`
     * var object = { 'user': 'fred' };
     * var other = { 'user': 'barney' };
     * var identity = _.memoize(_.identity);
     *
     * identity(object);
     * // => { 'user': 'fred' }
     * identity(other);
     * // => { 'user': 'fred' }
     *
     * _.memoize.Cache = WeakMap;
     * var identity = _.memoize(_.identity);
     *
     * identity(object);
     * // => { 'user': 'fred' }
     * identity(other);
     * // => { 'user': 'barney' }
     */
    function memoize(func, resolver) {
      if (typeof func != 'function' || (resolver && typeof resolver != 'function')) {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      var memoized = function() {
        var args = arguments,
            key = resolver ? resolver.apply(this, args) : args[0],
            cache = memoized.cache;

        if (cache.has(key)) {
          return cache.get(key);
        }
        var result = func.apply(this, args);
        memoized.cache = cache.set(key, result);
        return result;
      };
      memoized.cache = new memoize.Cache;
      return memoized;
    }

    /**
     * Creates a function that runs each argument through a corresponding
     * transform function.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func The function to wrap.
     * @param {...(Function|Function[])} [transforms] The functions to transform
     * arguments, specified as individual functions or arrays of functions.
     * @returns {Function} Returns the new function.
     * @example
     *
     * function doubled(n) {
     *   return n * 2;
     * }
     *
     * function square(n) {
     *   return n * n;
     * }
     *
     * var modded = _.modArgs(function(x, y) {
     *   return [x, y];
     * }, square, doubled);
     *
     * modded(1, 2);
     * // => [1, 4]
     *
     * modded(5, 10);
     * // => [25, 20]
     */
    var modArgs = restParam(function(func, transforms) {
      transforms = baseFlatten(transforms);
      if (typeof func != 'function' || !arrayEvery(transforms, baseIsFunction)) {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      var length = transforms.length;
      return restParam(function(args) {
        var index = nativeMin(args.length, length);
        while (index--) {
          args[index] = transforms[index](args[index]);
        }
        return func.apply(this, args);
      });
    });

    /**
     * Creates a function that negates the result of the predicate `func`. The
     * `func` predicate is invoked with the `this` binding and arguments of the
     * created function.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} predicate The predicate to negate.
     * @returns {Function} Returns the new function.
     * @example
     *
     * function isEven(n) {
     *   return n % 2 == 0;
     * }
     *
     * _.filter([1, 2, 3, 4, 5, 6], _.negate(isEven));
     * // => [1, 3, 5]
     */
    function negate(predicate) {
      if (typeof predicate != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      return function() {
        return !predicate.apply(this, arguments);
      };
    }

    /**
     * Creates a function that is restricted to invoking `func` once. Repeat calls
     * to the function return the value of the first call. The `func` is invoked
     * with the `this` binding and arguments of the created function.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func The function to restrict.
     * @returns {Function} Returns the new restricted function.
     * @example
     *
     * var initialize = _.once(createApplication);
     * initialize();
     * initialize();
     * // `initialize` invokes `createApplication` once
     */
    function once(func) {
      return before(2, func);
    }

    /**
     * Creates a function that invokes `func` with `partial` arguments prepended
     * to those provided to the new function. This method is like `_.bind` except
     * it does **not** alter the `this` binding.
     *
     * The `_.partial.placeholder` value, which defaults to `_` in monolithic
     * builds, may be used as a placeholder for partially applied arguments.
     *
     * **Note:** This method does not set the "length" property of partially
     * applied functions.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func The function to partially apply arguments to.
     * @param {...*} [partials] The arguments to be partially applied.
     * @returns {Function} Returns the new partially applied function.
     * @example
     *
     * var greet = function(greeting, name) {
     *   return greeting + ' ' + name;
     * };
     *
     * var sayHelloTo = _.partial(greet, 'hello');
     * sayHelloTo('fred');
     * // => 'hello fred'
     *
     * // using placeholders
     * var greetFred = _.partial(greet, _, 'fred');
     * greetFred('hi');
     * // => 'hi fred'
     */
    var partial = createPartial(PARTIAL_FLAG);

    /**
     * This method is like `_.partial` except that partially applied arguments
     * are appended to those provided to the new function.
     *
     * The `_.partialRight.placeholder` value, which defaults to `_` in monolithic
     * builds, may be used as a placeholder for partially applied arguments.
     *
     * **Note:** This method does not set the "length" property of partially
     * applied functions.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func The function to partially apply arguments to.
     * @param {...*} [partials] The arguments to be partially applied.
     * @returns {Function} Returns the new partially applied function.
     * @example
     *
     * var greet = function(greeting, name) {
     *   return greeting + ' ' + name;
     * };
     *
     * var greetFred = _.partialRight(greet, 'fred');
     * greetFred('hi');
     * // => 'hi fred'
     *
     * // using placeholders
     * var sayHelloTo = _.partialRight(greet, 'hello', _);
     * sayHelloTo('fred');
     * // => 'hello fred'
     */
    var partialRight = createPartial(PARTIAL_RIGHT_FLAG);

    /**
     * Creates a function that invokes `func` with arguments arranged according
     * to the specified indexes where the argument value at the first index is
     * provided as the first argument, the argument value at the second index is
     * provided as the second argument, and so on.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func The function to rearrange arguments for.
     * @param {...(number|number[])} indexes The arranged argument indexes,
     *  specified as individual indexes or arrays of indexes.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var rearged = _.rearg(function(a, b, c) {
     *   return [a, b, c];
     * }, 2, 0, 1);
     *
     * rearged('b', 'c', 'a')
     * // => ['a', 'b', 'c']
     *
     * var map = _.rearg(_.map, [1, 0]);
     * map(function(n) {
     *   return n * 3;
     * }, [1, 2, 3]);
     * // => [3, 6, 9]
     */
    var rearg = restParam(function(func, indexes) {
      return createWrapper(func, REARG_FLAG, undefined, undefined, undefined, baseFlatten(indexes));
    });

    /**
     * Creates a function that invokes `func` with the `this` binding of the
     * created function and arguments from `start` and beyond provided as an array.
     *
     * **Note:** This method is based on the [rest parameter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/rest_parameters).
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func The function to apply a rest parameter to.
     * @param {number} [start=func.length-1] The start position of the rest parameter.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var say = _.restParam(function(what, names) {
     *   return what + ' ' + _.initial(names).join(', ') +
     *     (_.size(names) > 1 ? ', & ' : '') + _.last(names);
     * });
     *
     * say('hello', 'fred', 'barney', 'pebbles');
     * // => 'hello fred, barney, & pebbles'
     */
    function restParam(func, start) {
      if (typeof func != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      start = nativeMax(start === undefined ? (func.length - 1) : (+start || 0), 0);
      return function() {
        var args = arguments,
            index = -1,
            length = nativeMax(args.length - start, 0),
            rest = Array(length);

        while (++index < length) {
          rest[index] = args[start + index];
        }
        switch (start) {
          case 0: return func.call(this, rest);
          case 1: return func.call(this, args[0], rest);
          case 2: return func.call(this, args[0], args[1], rest);
        }
        var otherArgs = Array(start + 1);
        index = -1;
        while (++index < start) {
          otherArgs[index] = args[index];
        }
        otherArgs[start] = rest;
        return func.apply(this, otherArgs);
      };
    }

    /**
     * Creates a function that invokes `func` with the `this` binding of the created
     * function and an array of arguments much like [`Function#apply`](https://es5.github.io/#x15.3.4.3).
     *
     * **Note:** This method is based on the [spread operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_operator).
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func The function to spread arguments over.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var say = _.spread(function(who, what) {
     *   return who + ' says ' + what;
     * });
     *
     * say(['fred', 'hello']);
     * // => 'fred says hello'
     *
     * // with a Promise
     * var numbers = Promise.all([
     *   Promise.resolve(40),
     *   Promise.resolve(36)
     * ]);
     *
     * numbers.then(_.spread(function(x, y) {
     *   return x + y;
     * }));
     * // => a Promise of 76
     */
    function spread(func) {
      if (typeof func != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      return function(array) {
        return func.apply(this, array);
      };
    }

    /**
     * Creates a throttled function that only invokes `func` at most once per
     * every `wait` milliseconds. The throttled function comes with a `cancel`
     * method to cancel delayed invocations. Provide an options object to indicate
     * that `func` should be invoked on the leading and/or trailing edge of the
     * `wait` timeout. Subsequent calls to the throttled function return the
     * result of the last `func` call.
     *
     * **Note:** If `leading` and `trailing` options are `true`, `func` is invoked
     * on the trailing edge of the timeout only if the the throttled function is
     * invoked more than once during the `wait` timeout.
     *
     * See [David Corbacho's article](http://drupalmotion.com/article/debounce-and-throttle-visual-explanation)
     * for details over the differences between `_.throttle` and `_.debounce`.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func The function to throttle.
     * @param {number} [wait=0] The number of milliseconds to throttle invocations to.
     * @param {Object} [options] The options object.
     * @param {boolean} [options.leading=true] Specify invoking on the leading
     *  edge of the timeout.
     * @param {boolean} [options.trailing=true] Specify invoking on the trailing
     *  edge of the timeout.
     * @returns {Function} Returns the new throttled function.
     * @example
     *
     * // avoid excessively updating the position while scrolling
     * jQuery(window).on('scroll', _.throttle(updatePosition, 100));
     *
     * // invoke `renewToken` when the click event is fired, but not more than once every 5 minutes
     * jQuery('.interactive').on('click', _.throttle(renewToken, 300000, {
     *   'trailing': false
     * }));
     *
     * // cancel a trailing throttled call
     * jQuery(window).on('popstate', throttled.cancel);
     */
    function throttle(func, wait, options) {
      var leading = true,
          trailing = true;

      if (typeof func != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      if (options === false) {
        leading = false;
      } else if (isObject(options)) {
        leading = 'leading' in options ? !!options.leading : leading;
        trailing = 'trailing' in options ? !!options.trailing : trailing;
      }
      return debounce(func, wait, { 'leading': leading, 'maxWait': +wait, 'trailing': trailing });
    }

    /**
     * Creates a function that provides `value` to the wrapper function as its
     * first argument. Any additional arguments provided to the function are
     * appended to those provided to the wrapper function. The wrapper is invoked
     * with the `this` binding of the created function.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {*} value The value to wrap.
     * @param {Function} wrapper The wrapper function.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var p = _.wrap(_.escape, function(func, text) {
     *   return '<p>' + func(text) + '</p>';
     * });
     *
     * p('fred, barney, & pebbles');
     * // => '<p>fred, barney, &amp; pebbles</p>'
     */
    function wrap(value, wrapper) {
      wrapper = wrapper == null ? identity : wrapper;
      return createWrapper(wrapper, PARTIAL_FLAG, undefined, [value], []);
    }

    /*------------------------------------------------------------------------*/

    /**
     * Creates a clone of `value`. If `isDeep` is `true` nested objects are cloned,
     * otherwise they are assigned by reference. If `customizer` is provided it is
     * invoked to produce the cloned values. If `customizer` returns `undefined`
     * cloning is handled by the method instead. The `customizer` is bound to
     * `thisArg` and invoked with two argument; (value [, index|key, object]).
     *
     * **Note:** This method is loosely based on the
     * [structured clone algorithm](http://www.w3.org/TR/html5/infrastructure.html#internal-structured-cloning-algorithm).
     * The enumerable properties of `arguments` objects and objects created by
     * constructors other than `Object` are cloned to plain `Object` objects. An
     * empty object is returned for uncloneable values such as functions, DOM nodes,
     * Maps, Sets, and WeakMaps.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to clone.
     * @param {boolean} [isDeep] Specify a deep clone.
     * @param {Function} [customizer] The function to customize cloning values.
     * @param {*} [thisArg] The `this` binding of `customizer`.
     * @returns {*} Returns the cloned value.
     * @example
     *
     * var users = [
     *   { 'user': 'barney' },
     *   { 'user': 'fred' }
     * ];
     *
     * var shallow = _.clone(users);
     * shallow[0] === users[0];
     * // => true
     *
     * var deep = _.clone(users, true);
     * deep[0] === users[0];
     * // => false
     *
     * // using a customizer callback
     * var el = _.clone(document.body, function(value) {
     *   if (_.isElement(value)) {
     *     return value.cloneNode(false);
     *   }
     * });
     *
     * el === document.body
     * // => false
     * el.nodeName
     * // => BODY
     * el.childNodes.length;
     * // => 0
     */
    function clone(value, isDeep, customizer, thisArg) {
      if (isDeep && typeof isDeep != 'boolean' && isIterateeCall(value, isDeep, customizer)) {
        isDeep = false;
      }
      else if (typeof isDeep == 'function') {
        thisArg = customizer;
        customizer = isDeep;
        isDeep = false;
      }
      return typeof customizer == 'function'
        ? baseClone(value, isDeep, bindCallback(customizer, thisArg, 1))
        : baseClone(value, isDeep);
    }

    /**
     * Creates a deep clone of `value`. If `customizer` is provided it is invoked
     * to produce the cloned values. If `customizer` returns `undefined` cloning
     * is handled by the method instead. The `customizer` is bound to `thisArg`
     * and invoked with two argument; (value [, index|key, object]).
     *
     * **Note:** This method is loosely based on the
     * [structured clone algorithm](http://www.w3.org/TR/html5/infrastructure.html#internal-structured-cloning-algorithm).
     * The enumerable properties of `arguments` objects and objects created by
     * constructors other than `Object` are cloned to plain `Object` objects. An
     * empty object is returned for uncloneable values such as functions, DOM nodes,
     * Maps, Sets, and WeakMaps.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to deep clone.
     * @param {Function} [customizer] The function to customize cloning values.
     * @param {*} [thisArg] The `this` binding of `customizer`.
     * @returns {*} Returns the deep cloned value.
     * @example
     *
     * var users = [
     *   { 'user': 'barney' },
     *   { 'user': 'fred' }
     * ];
     *
     * var deep = _.cloneDeep(users);
     * deep[0] === users[0];
     * // => false
     *
     * // using a customizer callback
     * var el = _.cloneDeep(document.body, function(value) {
     *   if (_.isElement(value)) {
     *     return value.cloneNode(true);
     *   }
     * });
     *
     * el === document.body
     * // => false
     * el.nodeName
     * // => BODY
     * el.childNodes.length;
     * // => 20
     */
    function cloneDeep(value, customizer, thisArg) {
      return typeof customizer == 'function'
        ? baseClone(value, true, bindCallback(customizer, thisArg, 1))
        : baseClone(value, true);
    }

    /**
     * Checks if `value` is greater than `other`.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @returns {boolean} Returns `true` if `value` is greater than `other`, else `false`.
     * @example
     *
     * _.gt(3, 1);
     * // => true
     *
     * _.gt(3, 3);
     * // => false
     *
     * _.gt(1, 3);
     * // => false
     */
    function gt(value, other) {
      return value > other;
    }

    /**
     * Checks if `value` is greater than or equal to `other`.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @returns {boolean} Returns `true` if `value` is greater than or equal to `other`, else `false`.
     * @example
     *
     * _.gte(3, 1);
     * // => true
     *
     * _.gte(3, 3);
     * // => true
     *
     * _.gte(1, 3);
     * // => false
     */
    function gte(value, other) {
      return value >= other;
    }

    /**
     * Checks if `value` is classified as an `arguments` object.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
     * @example
     *
     * _.isArguments(function() { return arguments; }());
     * // => true
     *
     * _.isArguments([1, 2, 3]);
     * // => false
     */
    function isArguments(value) {
      return isObjectLike(value) && isArrayLike(value) &&
        hasOwnProperty.call(value, 'callee') && !propertyIsEnumerable.call(value, 'callee');
    }

    /**
     * Checks if `value` is classified as an `Array` object.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
     * @example
     *
     * _.isArray([1, 2, 3]);
     * // => true
     *
     * _.isArray(function() { return arguments; }());
     * // => false
     */
    var isArray = nativeIsArray || function(value) {
      return isObjectLike(value) && isLength(value.length) && objToString.call(value) == arrayTag;
    };

    /**
     * Checks if `value` is classified as a boolean primitive or object.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
     * @example
     *
     * _.isBoolean(false);
     * // => true
     *
     * _.isBoolean(null);
     * // => false
     */
    function isBoolean(value) {
      return value === true || value === false || (isObjectLike(value) && objToString.call(value) == boolTag);
    }

    /**
     * Checks if `value` is classified as a `Date` object.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
     * @example
     *
     * _.isDate(new Date);
     * // => true
     *
     * _.isDate('Mon April 23 2012');
     * // => false
     */
    function isDate(value) {
      return isObjectLike(value) && objToString.call(value) == dateTag;
    }

    /**
     * Checks if `value` is a DOM element.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a DOM element, else `false`.
     * @example
     *
     * _.isElement(document.body);
     * // => true
     *
     * _.isElement('<body>');
     * // => false
     */
    function isElement(value) {
      return !!value && value.nodeType === 1 && isObjectLike(value) && !isPlainObject(value);
    }

    /**
     * Checks if `value` is empty. A value is considered empty unless it is an
     * `arguments` object, array, string, or jQuery-like collection with a length
     * greater than `0` or an object with own enumerable properties.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {Array|Object|string} value The value to inspect.
     * @returns {boolean} Returns `true` if `value` is empty, else `false`.
     * @example
     *
     * _.isEmpty(null);
     * // => true
     *
     * _.isEmpty(true);
     * // => true
     *
     * _.isEmpty(1);
     * // => true
     *
     * _.isEmpty([1, 2, 3]);
     * // => false
     *
     * _.isEmpty({ 'a': 1 });
     * // => false
     */
    function isEmpty(value) {
      if (value == null) {
        return true;
      }
      if (isArrayLike(value) && (isArray(value) || isString(value) || isArguments(value) ||
          (isObjectLike(value) && isFunction(value.splice)))) {
        return !value.length;
      }
      return !keys(value).length;
    }

    /**
     * Performs a deep comparison between two values to determine if they are
     * equivalent. If `customizer` is provided it is invoked to compare values.
     * If `customizer` returns `undefined` comparisons are handled by the method
     * instead. The `customizer` is bound to `thisArg` and invoked with three
     * arguments: (value, other [, index|key]).
     *
     * **Note:** This method supports comparing arrays, booleans, `Date` objects,
     * numbers, `Object` objects, regexes, and strings. Objects are compared by
     * their own, not inherited, enumerable properties. Functions and DOM nodes
     * are **not** supported. Provide a customizer function to extend support
     * for comparing other values.
     *
     * @static
     * @memberOf _
     * @alias eq
     * @category Lang
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @param {Function} [customizer] The function to customize value comparisons.
     * @param {*} [thisArg] The `this` binding of `customizer`.
     * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
     * @example
     *
     * var object = { 'user': 'fred' };
     * var other = { 'user': 'fred' };
     *
     * object == other;
     * // => false
     *
     * _.isEqual(object, other);
     * // => true
     *
     * // using a customizer callback
     * var array = ['hello', 'goodbye'];
     * var other = ['hi', 'goodbye'];
     *
     * _.isEqual(array, other, function(value, other) {
     *   if (_.every([value, other], RegExp.prototype.test, /^h(?:i|ello)$/)) {
     *     return true;
     *   }
     * });
     * // => true
     */
    function isEqual(value, other, customizer, thisArg) {
      customizer = typeof customizer == 'function' ? bindCallback(customizer, thisArg, 3) : undefined;
      var result = customizer ? customizer(value, other) : undefined;
      return  result === undefined ? baseIsEqual(value, other, customizer) : !!result;
    }

    /**
     * Checks if `value` is an `Error`, `EvalError`, `RangeError`, `ReferenceError`,
     * `SyntaxError`, `TypeError`, or `URIError` object.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an error object, else `false`.
     * @example
     *
     * _.isError(new Error);
     * // => true
     *
     * _.isError(Error);
     * // => false
     */
    function isError(value) {
      return isObjectLike(value) && typeof value.message == 'string' && objToString.call(value) == errorTag;
    }

    /**
     * Checks if `value` is a finite primitive number.
     *
     * **Note:** This method is based on [`Number.isFinite`](http://ecma-international.org/ecma-262/6.0/#sec-number.isfinite).
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a finite number, else `false`.
     * @example
     *
     * _.isFinite(10);
     * // => true
     *
     * _.isFinite('10');
     * // => false
     *
     * _.isFinite(true);
     * // => false
     *
     * _.isFinite(Object(10));
     * // => false
     *
     * _.isFinite(Infinity);
     * // => false
     */
    function isFinite(value) {
      return typeof value == 'number' && nativeIsFinite(value);
    }

    /**
     * Checks if `value` is classified as a `Function` object.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
     * @example
     *
     * _.isFunction(_);
     * // => true
     *
     * _.isFunction(/abc/);
     * // => false
     */
    function isFunction(value) {
      // The use of `Object#toString` avoids issues with the `typeof` operator
      // in older versions of Chrome and Safari which return 'function' for regexes
      // and Safari 8 equivalents which return 'object' for typed array constructors.
      return isObject(value) && objToString.call(value) == funcTag;
    }

    /**
     * Checks if `value` is the [language type](https://es5.github.io/#x8) of `Object`.
     * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an object, else `false`.
     * @example
     *
     * _.isObject({});
     * // => true
     *
     * _.isObject([1, 2, 3]);
     * // => true
     *
     * _.isObject(1);
     * // => false
     */
    function isObject(value) {
      // Avoid a V8 JIT bug in Chrome 19-20.
      // See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
      var type = typeof value;
      return !!value && (type == 'object' || type == 'function');
    }

    /**
     * Performs a deep comparison between `object` and `source` to determine if
     * `object` contains equivalent property values. If `customizer` is provided
     * it is invoked to compare values. If `customizer` returns `undefined`
     * comparisons are handled by the method instead. The `customizer` is bound
     * to `thisArg` and invoked with three arguments: (value, other, index|key).
     *
     * **Note:** This method supports comparing properties of arrays, booleans,
     * `Date` objects, numbers, `Object` objects, regexes, and strings. Functions
     * and DOM nodes are **not** supported. Provide a customizer function to extend
     * support for comparing other values.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {Object} object The object to inspect.
     * @param {Object} source The object of property values to match.
     * @param {Function} [customizer] The function to customize value comparisons.
     * @param {*} [thisArg] The `this` binding of `customizer`.
     * @returns {boolean} Returns `true` if `object` is a match, else `false`.
     * @example
     *
     * var object = { 'user': 'fred', 'age': 40 };
     *
     * _.isMatch(object, { 'age': 40 });
     * // => true
     *
     * _.isMatch(object, { 'age': 36 });
     * // => false
     *
     * // using a customizer callback
     * var object = { 'greeting': 'hello' };
     * var source = { 'greeting': 'hi' };
     *
     * _.isMatch(object, source, function(value, other) {
     *   return _.every([value, other], RegExp.prototype.test, /^h(?:i|ello)$/) || undefined;
     * });
     * // => true
     */
    function isMatch(object, source, customizer, thisArg) {
      customizer = typeof customizer == 'function' ? bindCallback(customizer, thisArg, 3) : undefined;
      return baseIsMatch(object, getMatchData(source), customizer);
    }

    /**
     * Checks if `value` is `NaN`.
     *
     * **Note:** This method is not the same as [`isNaN`](https://es5.github.io/#x15.1.2.4)
     * which returns `true` for `undefined` and other non-numeric values.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is `NaN`, else `false`.
     * @example
     *
     * _.isNaN(NaN);
     * // => true
     *
     * _.isNaN(new Number(NaN));
     * // => true
     *
     * isNaN(undefined);
     * // => true
     *
     * _.isNaN(undefined);
     * // => false
     */
    function isNaN(value) {
      // An `NaN` primitive is the only value that is not equal to itself.
      // Perform the `toStringTag` check first to avoid errors with some host objects in IE.
      return isNumber(value) && value != +value;
    }

    /**
     * Checks if `value` is a native function.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a native function, else `false`.
     * @example
     *
     * _.isNative(Array.prototype.push);
     * // => true
     *
     * _.isNative(_);
     * // => false
     */
    function isNative(value) {
      if (value == null) {
        return false;
      }
      if (isFunction(value)) {
        return reIsNative.test(fnToString.call(value));
      }
      return isObjectLike(value) && reIsHostCtor.test(value);
    }

    /**
     * Checks if `value` is `null`.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is `null`, else `false`.
     * @example
     *
     * _.isNull(null);
     * // => true
     *
     * _.isNull(void 0);
     * // => false
     */
    function isNull(value) {
      return value === null;
    }

    /**
     * Checks if `value` is classified as a `Number` primitive or object.
     *
     * **Note:** To exclude `Infinity`, `-Infinity`, and `NaN`, which are classified
     * as numbers, use the `_.isFinite` method.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
     * @example
     *
     * _.isNumber(8.4);
     * // => true
     *
     * _.isNumber(NaN);
     * // => true
     *
     * _.isNumber('8.4');
     * // => false
     */
    function isNumber(value) {
      return typeof value == 'number' || (isObjectLike(value) && objToString.call(value) == numberTag);
    }

    /**
     * Checks if `value` is a plain object, that is, an object created by the
     * `Object` constructor or one with a `[[Prototype]]` of `null`.
     *
     * **Note:** This method assumes objects created by the `Object` constructor
     * have no inherited enumerable properties.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     * }
     *
     * _.isPlainObject(new Foo);
     * // => false
     *
     * _.isPlainObject([1, 2, 3]);
     * // => false
     *
     * _.isPlainObject({ 'x': 0, 'y': 0 });
     * // => true
     *
     * _.isPlainObject(Object.create(null));
     * // => true
     */
    function isPlainObject(value) {
      var Ctor;

      // Exit early for non `Object` objects.
      if (!(isObjectLike(value) && objToString.call(value) == objectTag && !isArguments(value)) ||
          (!hasOwnProperty.call(value, 'constructor') && (Ctor = value.constructor, typeof Ctor == 'function' && !(Ctor instanceof Ctor)))) {
        return false;
      }
      // IE < 9 iterates inherited properties before own properties. If the first
      // iterated property is an object's own property then there are no inherited
      // enumerable properties.
      var result;
      // In most environments an object's own properties are iterated before
      // its inherited properties. If the last iterated property is an object's
      // own property then there are no inherited enumerable properties.
      baseForIn(value, function(subValue, key) {
        result = key;
      });
      return result === undefined || hasOwnProperty.call(value, result);
    }

    /**
     * Checks if `value` is classified as a `RegExp` object.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
     * @example
     *
     * _.isRegExp(/abc/);
     * // => true
     *
     * _.isRegExp('/abc/');
     * // => false
     */
    function isRegExp(value) {
      return isObject(value) && objToString.call(value) == regexpTag;
    }

    /**
     * Checks if `value` is classified as a `String` primitive or object.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
     * @example
     *
     * _.isString('abc');
     * // => true
     *
     * _.isString(1);
     * // => false
     */
    function isString(value) {
      return typeof value == 'string' || (isObjectLike(value) && objToString.call(value) == stringTag);
    }

    /**
     * Checks if `value` is classified as a typed array.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
     * @example
     *
     * _.isTypedArray(new Uint8Array);
     * // => true
     *
     * _.isTypedArray([]);
     * // => false
     */
    function isTypedArray(value) {
      return isObjectLike(value) && isLength(value.length) && !!typedArrayTags[objToString.call(value)];
    }

    /**
     * Checks if `value` is `undefined`.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is `undefined`, else `false`.
     * @example
     *
     * _.isUndefined(void 0);
     * // => true
     *
     * _.isUndefined(null);
     * // => false
     */
    function isUndefined(value) {
      return value === undefined;
    }

    /**
     * Checks if `value` is less than `other`.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @returns {boolean} Returns `true` if `value` is less than `other`, else `false`.
     * @example
     *
     * _.lt(1, 3);
     * // => true
     *
     * _.lt(3, 3);
     * // => false
     *
     * _.lt(3, 1);
     * // => false
     */
    function lt(value, other) {
      return value < other;
    }

    /**
     * Checks if `value` is less than or equal to `other`.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @returns {boolean} Returns `true` if `value` is less than or equal to `other`, else `false`.
     * @example
     *
     * _.lte(1, 3);
     * // => true
     *
     * _.lte(3, 3);
     * // => true
     *
     * _.lte(3, 1);
     * // => false
     */
    function lte(value, other) {
      return value <= other;
    }

    /**
     * Converts `value` to an array.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to convert.
     * @returns {Array} Returns the converted array.
     * @example
     *
     * (function() {
     *   return _.toArray(arguments).slice(1);
     * }(1, 2, 3));
     * // => [2, 3]
     */
    function toArray(value) {
      var length = value ? getLength(value) : 0;
      if (!isLength(length)) {
        return values(value);
      }
      if (!length) {
        return [];
      }
      return arrayCopy(value);
    }

    /**
     * Converts `value` to a plain object flattening inherited enumerable
     * properties of `value` to own properties of the plain object.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to convert.
     * @returns {Object} Returns the converted plain object.
     * @example
     *
     * function Foo() {
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.assign({ 'a': 1 }, new Foo);
     * // => { 'a': 1, 'b': 2 }
     *
     * _.assign({ 'a': 1 }, _.toPlainObject(new Foo));
     * // => { 'a': 1, 'b': 2, 'c': 3 }
     */
    function toPlainObject(value) {
      return baseCopy(value, keysIn(value));
    }

    /*------------------------------------------------------------------------*/

    /**
     * Recursively merges own enumerable properties of the source object(s), that
     * don't resolve to `undefined` into the destination object. Subsequent sources
     * overwrite property assignments of previous sources. If `customizer` is
     * provided it is invoked to produce the merged values of the destination and
     * source properties. If `customizer` returns `undefined` merging is handled
     * by the method instead. The `customizer` is bound to `thisArg` and invoked
     * with five arguments: (objectValue, sourceValue, key, object, source).
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The destination object.
     * @param {...Object} [sources] The source objects.
     * @param {Function} [customizer] The function to customize assigned values.
     * @param {*} [thisArg] The `this` binding of `customizer`.
     * @returns {Object} Returns `object`.
     * @example
     *
     * var users = {
     *   'data': [{ 'user': 'barney' }, { 'user': 'fred' }]
     * };
     *
     * var ages = {
     *   'data': [{ 'age': 36 }, { 'age': 40 }]
     * };
     *
     * _.merge(users, ages);
     * // => { 'data': [{ 'user': 'barney', 'age': 36 }, { 'user': 'fred', 'age': 40 }] }
     *
     * // using a customizer callback
     * var object = {
     *   'fruits': ['apple'],
     *   'vegetables': ['beet']
     * };
     *
     * var other = {
     *   'fruits': ['banana'],
     *   'vegetables': ['carrot']
     * };
     *
     * _.merge(object, other, function(a, b) {
     *   if (_.isArray(a)) {
     *     return a.concat(b);
     *   }
     * });
     * // => { 'fruits': ['apple', 'banana'], 'vegetables': ['beet', 'carrot'] }
     */
    var merge = createAssigner(baseMerge);

    /**
     * Assigns own enumerable properties of source object(s) to the destination
     * object. Subsequent sources overwrite property assignments of previous sources.
     * If `customizer` is provided it is invoked to produce the assigned values.
     * The `customizer` is bound to `thisArg` and invoked with five arguments:
     * (objectValue, sourceValue, key, object, source).
     *
     * **Note:** This method mutates `object` and is based on
     * [`Object.assign`](http://ecma-international.org/ecma-262/6.0/#sec-object.assign).
     *
     * @static
     * @memberOf _
     * @alias extend
     * @category Object
     * @param {Object} object The destination object.
     * @param {...Object} [sources] The source objects.
     * @param {Function} [customizer] The function to customize assigned values.
     * @param {*} [thisArg] The `this` binding of `customizer`.
     * @returns {Object} Returns `object`.
     * @example
     *
     * _.assign({ 'user': 'barney' }, { 'age': 40 }, { 'user': 'fred' });
     * // => { 'user': 'fred', 'age': 40 }
     *
     * // using a customizer callback
     * var defaults = _.partialRight(_.assign, function(value, other) {
     *   return _.isUndefined(value) ? other : value;
     * });
     *
     * defaults({ 'user': 'barney' }, { 'age': 36 }, { 'user': 'fred' });
     * // => { 'user': 'barney', 'age': 36 }
     */
    var assign = createAssigner(function(object, source, customizer) {
      return customizer
        ? assignWith(object, source, customizer)
        : baseAssign(object, source);
    });

    /**
     * Creates an object that inherits from the given `prototype` object. If a
     * `properties` object is provided its own enumerable properties are assigned
     * to the created object.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} prototype The object to inherit from.
     * @param {Object} [properties] The properties to assign to the object.
     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
     * @returns {Object} Returns the new object.
     * @example
     *
     * function Shape() {
     *   this.x = 0;
     *   this.y = 0;
     * }
     *
     * function Circle() {
     *   Shape.call(this);
     * }
     *
     * Circle.prototype = _.create(Shape.prototype, {
     *   'constructor': Circle
     * });
     *
     * var circle = new Circle;
     * circle instanceof Circle;
     * // => true
     *
     * circle instanceof Shape;
     * // => true
     */
    function create(prototype, properties, guard) {
      var result = baseCreate(prototype);
      if (guard && isIterateeCall(prototype, properties, guard)) {
        properties = undefined;
      }
      return properties ? baseAssign(result, properties) : result;
    }

    /**
     * Assigns own enumerable properties of source object(s) to the destination
     * object for all destination properties that resolve to `undefined`. Once a
     * property is set, additional values of the same property are ignored.
     *
     * **Note:** This method mutates `object`.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The destination object.
     * @param {...Object} [sources] The source objects.
     * @returns {Object} Returns `object`.
     * @example
     *
     * _.defaults({ 'user': 'barney' }, { 'age': 36 }, { 'user': 'fred' });
     * // => { 'user': 'barney', 'age': 36 }
     */
    var defaults = createDefaults(assign, assignDefaults);

    /**
     * This method is like `_.defaults` except that it recursively assigns
     * default properties.
     *
     * **Note:** This method mutates `object`.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The destination object.
     * @param {...Object} [sources] The source objects.
     * @returns {Object} Returns `object`.
     * @example
     *
     * _.defaultsDeep({ 'user': { 'name': 'barney' } }, { 'user': { 'name': 'fred', 'age': 36 } });
     * // => { 'user': { 'name': 'barney', 'age': 36 } }
     *
     */
    var defaultsDeep = createDefaults(merge, mergeDefaults);

    /**
     * This method is like `_.find` except that it returns the key of the first
     * element `predicate` returns truthy for instead of the element itself.
     *
     * If a property name is provided for `predicate` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `predicate` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to search.
     * @param {Function|Object|string} [predicate=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {string|undefined} Returns the key of the matched element, else `undefined`.
     * @example
     *
     * var users = {
     *   'barney':  { 'age': 36, 'active': true },
     *   'fred':    { 'age': 40, 'active': false },
     *   'pebbles': { 'age': 1,  'active': true }
     * };
     *
     * _.findKey(users, function(chr) {
     *   return chr.age < 40;
     * });
     * // => 'barney' (iteration order is not guaranteed)
     *
     * // using the `_.matches` callback shorthand
     * _.findKey(users, { 'age': 1, 'active': true });
     * // => 'pebbles'
     *
     * // using the `_.matchesProperty` callback shorthand
     * _.findKey(users, 'active', false);
     * // => 'fred'
     *
     * // using the `_.property` callback shorthand
     * _.findKey(users, 'active');
     * // => 'barney'
     */
    var findKey = createFindKey(baseForOwn);

    /**
     * This method is like `_.findKey` except that it iterates over elements of
     * a collection in the opposite order.
     *
     * If a property name is provided for `predicate` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `predicate` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to search.
     * @param {Function|Object|string} [predicate=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {string|undefined} Returns the key of the matched element, else `undefined`.
     * @example
     *
     * var users = {
     *   'barney':  { 'age': 36, 'active': true },
     *   'fred':    { 'age': 40, 'active': false },
     *   'pebbles': { 'age': 1,  'active': true }
     * };
     *
     * _.findLastKey(users, function(chr) {
     *   return chr.age < 40;
     * });
     * // => returns `pebbles` assuming `_.findKey` returns `barney`
     *
     * // using the `_.matches` callback shorthand
     * _.findLastKey(users, { 'age': 36, 'active': true });
     * // => 'barney'
     *
     * // using the `_.matchesProperty` callback shorthand
     * _.findLastKey(users, 'active', false);
     * // => 'fred'
     *
     * // using the `_.property` callback shorthand
     * _.findLastKey(users, 'active');
     * // => 'pebbles'
     */
    var findLastKey = createFindKey(baseForOwnRight);

    /**
     * Iterates over own and inherited enumerable properties of an object invoking
     * `iteratee` for each property. The `iteratee` is bound to `thisArg` and invoked
     * with three arguments: (value, key, object). Iteratee functions may exit
     * iteration early by explicitly returning `false`.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {Object} Returns `object`.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.forIn(new Foo, function(value, key) {
     *   console.log(key);
     * });
     * // => logs 'a', 'b', and 'c' (iteration order is not guaranteed)
     */
    var forIn = createForIn(baseFor);

    /**
     * This method is like `_.forIn` except that it iterates over properties of
     * `object` in the opposite order.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {Object} Returns `object`.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.forInRight(new Foo, function(value, key) {
     *   console.log(key);
     * });
     * // => logs 'c', 'b', and 'a' assuming `_.forIn ` logs 'a', 'b', and 'c'
     */
    var forInRight = createForIn(baseForRight);

    /**
     * Iterates over own enumerable properties of an object invoking `iteratee`
     * for each property. The `iteratee` is bound to `thisArg` and invoked with
     * three arguments: (value, key, object). Iteratee functions may exit iteration
     * early by explicitly returning `false`.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {Object} Returns `object`.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.forOwn(new Foo, function(value, key) {
     *   console.log(key);
     * });
     * // => logs 'a' and 'b' (iteration order is not guaranteed)
     */
    var forOwn = createForOwn(baseForOwn);

    /**
     * This method is like `_.forOwn` except that it iterates over properties of
     * `object` in the opposite order.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {Object} Returns `object`.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.forOwnRight(new Foo, function(value, key) {
     *   console.log(key);
     * });
     * // => logs 'b' and 'a' assuming `_.forOwn` logs 'a' and 'b'
     */
    var forOwnRight = createForOwn(baseForOwnRight);

    /**
     * Creates an array of function property names from all enumerable properties,
     * own and inherited, of `object`.
     *
     * @static
     * @memberOf _
     * @alias methods
     * @category Object
     * @param {Object} object The object to inspect.
     * @returns {Array} Returns the new array of property names.
     * @example
     *
     * _.functions(_);
     * // => ['after', 'ary', 'assign', ...]
     */
    function functions(object) {
      return baseFunctions(object, keysIn(object));
    }

    /**
     * Gets the property value at `path` of `object`. If the resolved value is
     * `undefined` the `defaultValue` is used in its place.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to query.
     * @param {Array|string} path The path of the property to get.
     * @param {*} [defaultValue] The value returned if the resolved value is `undefined`.
     * @returns {*} Returns the resolved value.
     * @example
     *
     * var object = { 'a': [{ 'b': { 'c': 3 } }] };
     *
     * _.get(object, 'a[0].b.c');
     * // => 3
     *
     * _.get(object, ['a', '0', 'b', 'c']);
     * // => 3
     *
     * _.get(object, 'a.b.c', 'default');
     * // => 'default'
     */
    function get(object, path, defaultValue) {
      var result = object == null ? undefined : baseGet(object, toPath(path), path + '');
      return result === undefined ? defaultValue : result;
    }

    /**
     * Checks if `path` is a direct property.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to query.
     * @param {Array|string} path The path to check.
     * @returns {boolean} Returns `true` if `path` is a direct property, else `false`.
     * @example
     *
     * var object = { 'a': { 'b': { 'c': 3 } } };
     *
     * _.has(object, 'a');
     * // => true
     *
     * _.has(object, 'a.b.c');
     * // => true
     *
     * _.has(object, ['a', 'b', 'c']);
     * // => true
     */
    function has(object, path) {
      if (object == null) {
        return false;
      }
      var result = hasOwnProperty.call(object, path);
      if (!result && !isKey(path)) {
        path = toPath(path);
        object = path.length == 1 ? object : baseGet(object, baseSlice(path, 0, -1));
        if (object == null) {
          return false;
        }
        path = last(path);
        result = hasOwnProperty.call(object, path);
      }
      return result || (isLength(object.length) && isIndex(path, object.length) &&
        (isArray(object) || isArguments(object)));
    }

    /**
     * Creates an object composed of the inverted keys and values of `object`.
     * If `object` contains duplicate values, subsequent values overwrite property
     * assignments of previous values unless `multiValue` is `true`.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to invert.
     * @param {boolean} [multiValue] Allow multiple values per key.
     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
     * @returns {Object} Returns the new inverted object.
     * @example
     *
     * var object = { 'a': 1, 'b': 2, 'c': 1 };
     *
     * _.invert(object);
     * // => { '1': 'c', '2': 'b' }
     *
     * // with `multiValue`
     * _.invert(object, true);
     * // => { '1': ['a', 'c'], '2': ['b'] }
     */
    function invert(object, multiValue, guard) {
      if (guard && isIterateeCall(object, multiValue, guard)) {
        multiValue = undefined;
      }
      var index = -1,
          props = keys(object),
          length = props.length,
          result = {};

      while (++index < length) {
        var key = props[index],
            value = object[key];

        if (multiValue) {
          if (hasOwnProperty.call(result, value)) {
            result[value].push(key);
          } else {
            result[value] = [key];
          }
        }
        else {
          result[value] = key;
        }
      }
      return result;
    }

    /**
     * Creates an array of the own enumerable property names of `object`.
     *
     * **Note:** Non-object values are coerced to objects. See the
     * [ES spec](http://ecma-international.org/ecma-262/6.0/#sec-object.keys)
     * for more details.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property names.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.keys(new Foo);
     * // => ['a', 'b'] (iteration order is not guaranteed)
     *
     * _.keys('hi');
     * // => ['0', '1']
     */
    var keys = !nativeKeys ? shimKeys : function(object) {
      var Ctor = object == null ? undefined : object.constructor;
      if ((typeof Ctor == 'function' && Ctor.prototype === object) ||
          (typeof object != 'function' && isArrayLike(object))) {
        return shimKeys(object);
      }
      return isObject(object) ? nativeKeys(object) : [];
    };

    /**
     * Creates an array of the own and inherited enumerable property names of `object`.
     *
     * **Note:** Non-object values are coerced to objects.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property names.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.keysIn(new Foo);
     * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
     */
    function keysIn(object) {
      if (object == null) {
        return [];
      }
      if (!isObject(object)) {
        object = Object(object);
      }
      var length = object.length;
      length = (length && isLength(length) &&
        (isArray(object) || isArguments(object)) && length) || 0;

      var Ctor = object.constructor,
          index = -1,
          isProto = typeof Ctor == 'function' && Ctor.prototype === object,
          result = Array(length),
          skipIndexes = length > 0;

      while (++index < length) {
        result[index] = (index + '');
      }
      for (var key in object) {
        if (!(skipIndexes && isIndex(key, length)) &&
            !(key == 'constructor' && (isProto || !hasOwnProperty.call(object, key)))) {
          result.push(key);
        }
      }
      return result;
    }

    /**
     * The opposite of `_.mapValues`; this method creates an object with the
     * same values as `object` and keys generated by running each own enumerable
     * property of `object` through `iteratee`.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to iterate over.
     * @param {Function|Object|string} [iteratee=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {Object} Returns the new mapped object.
     * @example
     *
     * _.mapKeys({ 'a': 1, 'b': 2 }, function(value, key) {
     *   return key + value;
     * });
     * // => { 'a1': 1, 'b2': 2 }
     */
    var mapKeys = createObjectMapper(true);

    /**
     * Creates an object with the same keys as `object` and values generated by
     * running each own enumerable property of `object` through `iteratee`. The
     * iteratee function is bound to `thisArg` and invoked with three arguments:
     * (value, key, object).
     *
     * If a property name is provided for `iteratee` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `iteratee` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to iterate over.
     * @param {Function|Object|string} [iteratee=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {Object} Returns the new mapped object.
     * @example
     *
     * _.mapValues({ 'a': 1, 'b': 2 }, function(n) {
     *   return n * 3;
     * });
     * // => { 'a': 3, 'b': 6 }
     *
     * var users = {
     *   'fred':    { 'user': 'fred',    'age': 40 },
     *   'pebbles': { 'user': 'pebbles', 'age': 1 }
     * };
     *
     * // using the `_.property` callback shorthand
     * _.mapValues(users, 'age');
     * // => { 'fred': 40, 'pebbles': 1 } (iteration order is not guaranteed)
     */
    var mapValues = createObjectMapper();

    /**
     * The opposite of `_.pick`; this method creates an object composed of the
     * own and inherited enumerable properties of `object` that are not omitted.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The source object.
     * @param {Function|...(string|string[])} [predicate] The function invoked per
     *  iteration or property names to omit, specified as individual property
     *  names or arrays of property names.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {Object} Returns the new object.
     * @example
     *
     * var object = { 'user': 'fred', 'age': 40 };
     *
     * _.omit(object, 'age');
     * // => { 'user': 'fred' }
     *
     * _.omit(object, _.isNumber);
     * // => { 'user': 'fred' }
     */
    var omit = restParam(function(object, props) {
      if (object == null) {
        return {};
      }
      if (typeof props[0] != 'function') {
        var props = arrayMap(baseFlatten(props), String);
        return pickByArray(object, baseDifference(keysIn(object), props));
      }
      var predicate = bindCallback(props[0], props[1], 3);
      return pickByCallback(object, function(value, key, object) {
        return !predicate(value, key, object);
      });
    });

    /**
     * Creates a two dimensional array of the key-value pairs for `object`,
     * e.g. `[[key1, value1], [key2, value2]]`.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to query.
     * @returns {Array} Returns the new array of key-value pairs.
     * @example
     *
     * _.pairs({ 'barney': 36, 'fred': 40 });
     * // => [['barney', 36], ['fred', 40]] (iteration order is not guaranteed)
     */
    function pairs(object) {
      object = toObject(object);

      var index = -1,
          props = keys(object),
          length = props.length,
          result = Array(length);

      while (++index < length) {
        var key = props[index];
        result[index] = [key, object[key]];
      }
      return result;
    }

    /**
     * Creates an object composed of the picked `object` properties. Property
     * names may be specified as individual arguments or as arrays of property
     * names. If `predicate` is provided it is invoked for each property of `object`
     * picking the properties `predicate` returns truthy for. The predicate is
     * bound to `thisArg` and invoked with three arguments: (value, key, object).
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The source object.
     * @param {Function|...(string|string[])} [predicate] The function invoked per
     *  iteration or property names to pick, specified as individual property
     *  names or arrays of property names.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {Object} Returns the new object.
     * @example
     *
     * var object = { 'user': 'fred', 'age': 40 };
     *
     * _.pick(object, 'user');
     * // => { 'user': 'fred' }
     *
     * _.pick(object, _.isString);
     * // => { 'user': 'fred' }
     */
    var pick = restParam(function(object, props) {
      if (object == null) {
        return {};
      }
      return typeof props[0] == 'function'
        ? pickByCallback(object, bindCallback(props[0], props[1], 3))
        : pickByArray(object, baseFlatten(props));
    });

    /**
     * This method is like `_.get` except that if the resolved value is a function
     * it is invoked with the `this` binding of its parent object and its result
     * is returned.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to query.
     * @param {Array|string} path The path of the property to resolve.
     * @param {*} [defaultValue] The value returned if the resolved value is `undefined`.
     * @returns {*} Returns the resolved value.
     * @example
     *
     * var object = { 'a': [{ 'b': { 'c1': 3, 'c2': _.constant(4) } }] };
     *
     * _.result(object, 'a[0].b.c1');
     * // => 3
     *
     * _.result(object, 'a[0].b.c2');
     * // => 4
     *
     * _.result(object, 'a.b.c', 'default');
     * // => 'default'
     *
     * _.result(object, 'a.b.c', _.constant('default'));
     * // => 'default'
     */
    function result(object, path, defaultValue) {
      var result = object == null ? undefined : object[path];
      if (result === undefined) {
        if (object != null && !isKey(path, object)) {
          path = toPath(path);
          object = path.length == 1 ? object : baseGet(object, baseSlice(path, 0, -1));
          result = object == null ? undefined : object[last(path)];
        }
        result = result === undefined ? defaultValue : result;
      }
      return isFunction(result) ? result.call(object) : result;
    }

    /**
     * Sets the property value of `path` on `object`. If a portion of `path`
     * does not exist it is created.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to augment.
     * @param {Array|string} path The path of the property to set.
     * @param {*} value The value to set.
     * @returns {Object} Returns `object`.
     * @example
     *
     * var object = { 'a': [{ 'b': { 'c': 3 } }] };
     *
     * _.set(object, 'a[0].b.c', 4);
     * console.log(object.a[0].b.c);
     * // => 4
     *
     * _.set(object, 'x[0].y.z', 5);
     * console.log(object.x[0].y.z);
     * // => 5
     */
    function set(object, path, value) {
      if (object == null) {
        return object;
      }
      var pathKey = (path + '');
      path = (object[pathKey] != null || isKey(path, object)) ? [pathKey] : toPath(path);

      var index = -1,
          length = path.length,
          lastIndex = length - 1,
          nested = object;

      while (nested != null && ++index < length) {
        var key = path[index];
        if (isObject(nested)) {
          if (index == lastIndex) {
            nested[key] = value;
          } else if (nested[key] == null) {
            nested[key] = isIndex(path[index + 1]) ? [] : {};
          }
        }
        nested = nested[key];
      }
      return object;
    }

    /**
     * An alternative to `_.reduce`; this method transforms `object` to a new
     * `accumulator` object which is the result of running each of its own enumerable
     * properties through `iteratee`, with each invocation potentially mutating
     * the `accumulator` object. The `iteratee` is bound to `thisArg` and invoked
     * with four arguments: (accumulator, value, key, object). Iteratee functions
     * may exit iteration early by explicitly returning `false`.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Array|Object} object The object to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @param {*} [accumulator] The custom accumulator value.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {*} Returns the accumulated value.
     * @example
     *
     * _.transform([2, 3, 4], function(result, n) {
     *   result.push(n *= n);
     *   return n % 2 == 0;
     * });
     * // => [4, 9]
     *
     * _.transform({ 'a': 1, 'b': 2 }, function(result, n, key) {
     *   result[key] = n * 3;
     * });
     * // => { 'a': 3, 'b': 6 }
     */
    function transform(object, iteratee, accumulator, thisArg) {
      var isArr = isArray(object) || isTypedArray(object);
      iteratee = getCallback(iteratee, thisArg, 4);

      if (accumulator == null) {
        if (isArr || isObject(object)) {
          var Ctor = object.constructor;
          if (isArr) {
            accumulator = isArray(object) ? new Ctor : [];
          } else {
            accumulator = baseCreate(isFunction(Ctor) ? Ctor.prototype : undefined);
          }
        } else {
          accumulator = {};
        }
      }
      (isArr ? arrayEach : baseForOwn)(object, function(value, index, object) {
        return iteratee(accumulator, value, index, object);
      });
      return accumulator;
    }

    /**
     * Creates an array of the own enumerable property values of `object`.
     *
     * **Note:** Non-object values are coerced to objects.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property values.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.values(new Foo);
     * // => [1, 2] (iteration order is not guaranteed)
     *
     * _.values('hi');
     * // => ['h', 'i']
     */
    function values(object) {
      return baseValues(object, keys(object));
    }

    /**
     * Creates an array of the own and inherited enumerable property values
     * of `object`.
     *
     * **Note:** Non-object values are coerced to objects.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property values.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.valuesIn(new Foo);
     * // => [1, 2, 3] (iteration order is not guaranteed)
     */
    function valuesIn(object) {
      return baseValues(object, keysIn(object));
    }

    /*------------------------------------------------------------------------*/

    /**
     * Checks if `n` is between `start` and up to but not including, `end`. If
     * `end` is not specified it is set to `start` with `start` then set to `0`.
     *
     * @static
     * @memberOf _
     * @category Number
     * @param {number} n The number to check.
     * @param {number} [start=0] The start of the range.
     * @param {number} end The end of the range.
     * @returns {boolean} Returns `true` if `n` is in the range, else `false`.
     * @example
     *
     * _.inRange(3, 2, 4);
     * // => true
     *
     * _.inRange(4, 8);
     * // => true
     *
     * _.inRange(4, 2);
     * // => false
     *
     * _.inRange(2, 2);
     * // => false
     *
     * _.inRange(1.2, 2);
     * // => true
     *
     * _.inRange(5.2, 4);
     * // => false
     */
    function inRange(value, start, end) {
      start = +start || 0;
      if (end === undefined) {
        end = start;
        start = 0;
      } else {
        end = +end || 0;
      }
      return value >= nativeMin(start, end) && value < nativeMax(start, end);
    }

    /**
     * Produces a random number between `min` and `max` (inclusive). If only one
     * argument is provided a number between `0` and the given number is returned.
     * If `floating` is `true`, or either `min` or `max` are floats, a floating-point
     * number is returned instead of an integer.
     *
     * @static
     * @memberOf _
     * @category Number
     * @param {number} [min=0] The minimum possible value.
     * @param {number} [max=1] The maximum possible value.
     * @param {boolean} [floating] Specify returning a floating-point number.
     * @returns {number} Returns the random number.
     * @example
     *
     * _.random(0, 5);
     * // => an integer between 0 and 5
     *
     * _.random(5);
     * // => also an integer between 0 and 5
     *
     * _.random(5, true);
     * // => a floating-point number between 0 and 5
     *
     * _.random(1.2, 5.2);
     * // => a floating-point number between 1.2 and 5.2
     */
    function random(min, max, floating) {
      if (floating && isIterateeCall(min, max, floating)) {
        max = floating = undefined;
      }
      var noMin = min == null,
          noMax = max == null;

      if (floating == null) {
        if (noMax && typeof min == 'boolean') {
          floating = min;
          min = 1;
        }
        else if (typeof max == 'boolean') {
          floating = max;
          noMax = true;
        }
      }
      if (noMin && noMax) {
        max = 1;
        noMax = false;
      }
      min = +min || 0;
      if (noMax) {
        max = min;
        min = 0;
      } else {
        max = +max || 0;
      }
      if (floating || min % 1 || max % 1) {
        var rand = nativeRandom();
        return nativeMin(min + (rand * (max - min + parseFloat('1e-' + ((rand + '').length - 1)))), max);
      }
      return baseRandom(min, max);
    }

    /*------------------------------------------------------------------------*/

    /**
     * Converts `string` to [camel case](https://en.wikipedia.org/wiki/CamelCase).
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to convert.
     * @returns {string} Returns the camel cased string.
     * @example
     *
     * _.camelCase('Foo Bar');
     * // => 'fooBar'
     *
     * _.camelCase('--foo-bar');
     * // => 'fooBar'
     *
     * _.camelCase('__foo_bar__');
     * // => 'fooBar'
     */
    var camelCase = createCompounder(function(result, word, index) {
      word = word.toLowerCase();
      return result + (index ? (word.charAt(0).toUpperCase() + word.slice(1)) : word);
    });

    /**
     * Capitalizes the first character of `string`.
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to capitalize.
     * @returns {string} Returns the capitalized string.
     * @example
     *
     * _.capitalize('fred');
     * // => 'Fred'
     */
    function capitalize(string) {
      string = baseToString(string);
      return string && (string.charAt(0).toUpperCase() + string.slice(1));
    }

    /**
     * Deburrs `string` by converting [latin-1 supplementary letters](https://en.wikipedia.org/wiki/Latin-1_Supplement_(Unicode_block)#Character_table)
     * to basic latin letters and removing [combining diacritical marks](https://en.wikipedia.org/wiki/Combining_Diacritical_Marks).
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to deburr.
     * @returns {string} Returns the deburred string.
     * @example
     *
     * _.deburr('déjà vu');
     * // => 'deja vu'
     */
    function deburr(string) {
      string = baseToString(string);
      return string && string.replace(reLatin1, deburrLetter).replace(reComboMark, '');
    }

    /**
     * Checks if `string` ends with the given target string.
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to search.
     * @param {string} [target] The string to search for.
     * @param {number} [position=string.length] The position to search from.
     * @returns {boolean} Returns `true` if `string` ends with `target`, else `false`.
     * @example
     *
     * _.endsWith('abc', 'c');
     * // => true
     *
     * _.endsWith('abc', 'b');
     * // => false
     *
     * _.endsWith('abc', 'b', 2);
     * // => true
     */
    function endsWith(string, target, position) {
      string = baseToString(string);
      target = (target + '');

      var length = string.length;
      position = position === undefined
        ? length
        : nativeMin(position < 0 ? 0 : (+position || 0), length);

      position -= target.length;
      return position >= 0 && string.indexOf(target, position) == position;
    }

    /**
     * Converts the characters "&", "<", ">", '"', "'", and "\`", in `string` to
     * their corresponding HTML entities.
     *
     * **Note:** No other characters are escaped. To escape additional characters
     * use a third-party library like [_he_](https://mths.be/he).
     *
     * Though the ">" character is escaped for symmetry, characters like
     * ">" and "/" don't need escaping in HTML and have no special meaning
     * unless they're part of a tag or unquoted attribute value.
     * See [Mathias Bynens's article](https://mathiasbynens.be/notes/ambiguous-ampersands)
     * (under "semi-related fun fact") for more details.
     *
     * Backticks are escaped because in Internet Explorer < 9, they can break out
     * of attribute values or HTML comments. See [#59](https://html5sec.org/#59),
     * [#102](https://html5sec.org/#102), [#108](https://html5sec.org/#108), and
     * [#133](https://html5sec.org/#133) of the [HTML5 Security Cheatsheet](https://html5sec.org/)
     * for more details.
     *
     * When working with HTML you should always [quote attribute values](http://wonko.com/post/html-escaping)
     * to reduce XSS vectors.
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to escape.
     * @returns {string} Returns the escaped string.
     * @example
     *
     * _.escape('fred, barney, & pebbles');
     * // => 'fred, barney, &amp; pebbles'
     */
    function escape(string) {
      // Reset `lastIndex` because in IE < 9 `String#replace` does not.
      string = baseToString(string);
      return (string && reHasUnescapedHtml.test(string))
        ? string.replace(reUnescapedHtml, escapeHtmlChar)
        : string;
    }

    /**
     * Escapes the `RegExp` special characters "\", "/", "^", "$", ".", "|", "?",
     * "*", "+", "(", ")", "[", "]", "{" and "}" in `string`.
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to escape.
     * @returns {string} Returns the escaped string.
     * @example
     *
     * _.escapeRegExp('[lodash](https://lodash.com/)');
     * // => '\[lodash\]\(https:\/\/lodash\.com\/\)'
     */
    function escapeRegExp(string) {
      string = baseToString(string);
      return (string && reHasRegExpChars.test(string))
        ? string.replace(reRegExpChars, escapeRegExpChar)
        : (string || '(?:)');
    }

    /**
     * Converts `string` to [kebab case](https://en.wikipedia.org/wiki/Letter_case#Special_case_styles).
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to convert.
     * @returns {string} Returns the kebab cased string.
     * @example
     *
     * _.kebabCase('Foo Bar');
     * // => 'foo-bar'
     *
     * _.kebabCase('fooBar');
     * // => 'foo-bar'
     *
     * _.kebabCase('__foo_bar__');
     * // => 'foo-bar'
     */
    var kebabCase = createCompounder(function(result, word, index) {
      return result + (index ? '-' : '') + word.toLowerCase();
    });

    /**
     * Pads `string` on the left and right sides if it's shorter than `length`.
     * Padding characters are truncated if they can't be evenly divided by `length`.
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to pad.
     * @param {number} [length=0] The padding length.
     * @param {string} [chars=' '] The string used as padding.
     * @returns {string} Returns the padded string.
     * @example
     *
     * _.pad('abc', 8);
     * // => '  abc   '
     *
     * _.pad('abc', 8, '_-');
     * // => '_-abc_-_'
     *
     * _.pad('abc', 3);
     * // => 'abc'
     */
    function pad(string, length, chars) {
      string = baseToString(string);
      length = +length;

      var strLength = string.length;
      if (strLength >= length || !nativeIsFinite(length)) {
        return string;
      }
      var mid = (length - strLength) / 2,
          leftLength = nativeFloor(mid),
          rightLength = nativeCeil(mid);

      chars = createPadding('', rightLength, chars);
      return chars.slice(0, leftLength) + string + chars;
    }

    /**
     * Pads `string` on the left side if it's shorter than `length`. Padding
     * characters are truncated if they exceed `length`.
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to pad.
     * @param {number} [length=0] The padding length.
     * @param {string} [chars=' '] The string used as padding.
     * @returns {string} Returns the padded string.
     * @example
     *
     * _.padLeft('abc', 6);
     * // => '   abc'
     *
     * _.padLeft('abc', 6, '_-');
     * // => '_-_abc'
     *
     * _.padLeft('abc', 3);
     * // => 'abc'
     */
    var padLeft = createPadDir();

    /**
     * Pads `string` on the right side if it's shorter than `length`. Padding
     * characters are truncated if they exceed `length`.
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to pad.
     * @param {number} [length=0] The padding length.
     * @param {string} [chars=' '] The string used as padding.
     * @returns {string} Returns the padded string.
     * @example
     *
     * _.padRight('abc', 6);
     * // => 'abc   '
     *
     * _.padRight('abc', 6, '_-');
     * // => 'abc_-_'
     *
     * _.padRight('abc', 3);
     * // => 'abc'
     */
    var padRight = createPadDir(true);

    /**
     * Converts `string` to an integer of the specified radix. If `radix` is
     * `undefined` or `0`, a `radix` of `10` is used unless `value` is a hexadecimal,
     * in which case a `radix` of `16` is used.
     *
     * **Note:** This method aligns with the [ES5 implementation](https://es5.github.io/#E)
     * of `parseInt`.
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} string The string to convert.
     * @param {number} [radix] The radix to interpret `value` by.
     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
     * @returns {number} Returns the converted integer.
     * @example
     *
     * _.parseInt('08');
     * // => 8
     *
     * _.map(['6', '08', '10'], _.parseInt);
     * // => [6, 8, 10]
     */
    function parseInt(string, radix, guard) {
      // Firefox < 21 and Opera < 15 follow ES3 for `parseInt`.
      // Chrome fails to trim leading <BOM> whitespace characters.
      // See https://code.google.com/p/v8/issues/detail?id=3109 for more details.
      if (guard ? isIterateeCall(string, radix, guard) : radix == null) {
        radix = 0;
      } else if (radix) {
        radix = +radix;
      }
      string = trim(string);
      return nativeParseInt(string, radix || (reHasHexPrefix.test(string) ? 16 : 10));
    }

    /**
     * Repeats the given string `n` times.
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to repeat.
     * @param {number} [n=0] The number of times to repeat the string.
     * @returns {string} Returns the repeated string.
     * @example
     *
     * _.repeat('*', 3);
     * // => '***'
     *
     * _.repeat('abc', 2);
     * // => 'abcabc'
     *
     * _.repeat('abc', 0);
     * // => ''
     */
    function repeat(string, n) {
      var result = '';
      string = baseToString(string);
      n = +n;
      if (n < 1 || !string || !nativeIsFinite(n)) {
        return result;
      }
      // Leverage the exponentiation by squaring algorithm for a faster repeat.
      // See https://en.wikipedia.org/wiki/Exponentiation_by_squaring for more details.
      do {
        if (n % 2) {
          result += string;
        }
        n = nativeFloor(n / 2);
        string += string;
      } while (n);

      return result;
    }

    /**
     * Converts `string` to [snake case](https://en.wikipedia.org/wiki/Snake_case).
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to convert.
     * @returns {string} Returns the snake cased string.
     * @example
     *
     * _.snakeCase('Foo Bar');
     * // => 'foo_bar'
     *
     * _.snakeCase('fooBar');
     * // => 'foo_bar'
     *
     * _.snakeCase('--foo-bar');
     * // => 'foo_bar'
     */
    var snakeCase = createCompounder(function(result, word, index) {
      return result + (index ? '_' : '') + word.toLowerCase();
    });

    /**
     * Converts `string` to [start case](https://en.wikipedia.org/wiki/Letter_case#Stylistic_or_specialised_usage).
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to convert.
     * @returns {string} Returns the start cased string.
     * @example
     *
     * _.startCase('--foo-bar');
     * // => 'Foo Bar'
     *
     * _.startCase('fooBar');
     * // => 'Foo Bar'
     *
     * _.startCase('__foo_bar__');
     * // => 'Foo Bar'
     */
    var startCase = createCompounder(function(result, word, index) {
      return result + (index ? ' ' : '') + (word.charAt(0).toUpperCase() + word.slice(1));
    });

    /**
     * Checks if `string` starts with the given target string.
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to search.
     * @param {string} [target] The string to search for.
     * @param {number} [position=0] The position to search from.
     * @returns {boolean} Returns `true` if `string` starts with `target`, else `false`.
     * @example
     *
     * _.startsWith('abc', 'a');
     * // => true
     *
     * _.startsWith('abc', 'b');
     * // => false
     *
     * _.startsWith('abc', 'b', 1);
     * // => true
     */
    function startsWith(string, target, position) {
      string = baseToString(string);
      position = position == null
        ? 0
        : nativeMin(position < 0 ? 0 : (+position || 0), string.length);

      return string.lastIndexOf(target, position) == position;
    }

    /**
     * Creates a compiled template function that can interpolate data properties
     * in "interpolate" delimiters, HTML-escape interpolated data properties in
     * "escape" delimiters, and execute JavaScript in "evaluate" delimiters. Data
     * properties may be accessed as free variables in the template. If a setting
     * object is provided it takes precedence over `_.templateSettings` values.
     *
     * **Note:** In the development build `_.template` utilizes
     * [sourceURLs](http://www.html5rocks.com/en/tutorials/developertools/sourcemaps/#toc-sourceurl)
     * for easier debugging.
     *
     * For more information on precompiling templates see
     * [lodash's custom builds documentation](https://lodash.com/custom-builds).
     *
     * For more information on Chrome extension sandboxes see
     * [Chrome's extensions documentation](https://developer.chrome.com/extensions/sandboxingEval).
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The template string.
     * @param {Object} [options] The options object.
     * @param {RegExp} [options.escape] The HTML "escape" delimiter.
     * @param {RegExp} [options.evaluate] The "evaluate" delimiter.
     * @param {Object} [options.imports] An object to import into the template as free variables.
     * @param {RegExp} [options.interpolate] The "interpolate" delimiter.
     * @param {string} [options.sourceURL] The sourceURL of the template's compiled source.
     * @param {string} [options.variable] The data object variable name.
     * @param- {Object} [otherOptions] Enables the legacy `options` param signature.
     * @returns {Function} Returns the compiled template function.
     * @example
     *
     * // using the "interpolate" delimiter to create a compiled template
     * var compiled = _.template('hello <%= user %>!');
     * compiled({ 'user': 'fred' });
     * // => 'hello fred!'
     *
     * // using the HTML "escape" delimiter to escape data property values
     * var compiled = _.template('<b><%- value %></b>');
     * compiled({ 'value': '<script>' });
     * // => '<b>&lt;script&gt;</b>'
     *
     * // using the "evaluate" delimiter to execute JavaScript and generate HTML
     * var compiled = _.template('<% _.forEach(users, function(user) { %><li><%- user %></li><% }); %>');
     * compiled({ 'users': ['fred', 'barney'] });
     * // => '<li>fred</li><li>barney</li>'
     *
     * // using the internal `print` function in "evaluate" delimiters
     * var compiled = _.template('<% print("hello " + user); %>!');
     * compiled({ 'user': 'barney' });
     * // => 'hello barney!'
     *
     * // using the ES delimiter as an alternative to the default "interpolate" delimiter
     * var compiled = _.template('hello ${ user }!');
     * compiled({ 'user': 'pebbles' });
     * // => 'hello pebbles!'
     *
     * // using custom template delimiters
     * _.templateSettings.interpolate = /{{([\s\S]+?)}}/g;
     * var compiled = _.template('hello {{ user }}!');
     * compiled({ 'user': 'mustache' });
     * // => 'hello mustache!'
     *
     * // using backslashes to treat delimiters as plain text
     * var compiled = _.template('<%= "\\<%- value %\\>" %>');
     * compiled({ 'value': 'ignored' });
     * // => '<%- value %>'
     *
     * // using the `imports` option to import `jQuery` as `jq`
     * var text = '<% jq.each(users, function(user) { %><li><%- user %></li><% }); %>';
     * var compiled = _.template(text, { 'imports': { 'jq': jQuery } });
     * compiled({ 'users': ['fred', 'barney'] });
     * // => '<li>fred</li><li>barney</li>'
     *
     * // using the `sourceURL` option to specify a custom sourceURL for the template
     * var compiled = _.template('hello <%= user %>!', { 'sourceURL': '/basic/greeting.jst' });
     * compiled(data);
     * // => find the source of "greeting.jst" under the Sources tab or Resources panel of the web inspector
     *
     * // using the `variable` option to ensure a with-statement isn't used in the compiled template
     * var compiled = _.template('hi <%= data.user %>!', { 'variable': 'data' });
     * compiled.source;
     * // => function(data) {
     * //   var __t, __p = '';
     * //   __p += 'hi ' + ((__t = ( data.user )) == null ? '' : __t) + '!';
     * //   return __p;
     * // }
     *
     * // using the `source` property to inline compiled templates for meaningful
     * // line numbers in error messages and a stack trace
     * fs.writeFileSync(path.join(cwd, 'jst.js'), '\
     *   var JST = {\
     *     "main": ' + _.template(mainText).source + '\
     *   };\
     * ');
     */
    function template(string, options, otherOptions) {
      // Based on John Resig's `tmpl` implementation (http://ejohn.org/blog/javascript-micro-templating/)
      // and Laura Doktorova's doT.js (https://github.com/olado/doT).
      var settings = lodash.templateSettings;

      if (otherOptions && isIterateeCall(string, options, otherOptions)) {
        options = otherOptions = undefined;
      }
      string = baseToString(string);
      options = assignWith(baseAssign({}, otherOptions || options), settings, assignOwnDefaults);

      var imports = assignWith(baseAssign({}, options.imports), settings.imports, assignOwnDefaults),
          importsKeys = keys(imports),
          importsValues = baseValues(imports, importsKeys);

      var isEscaping,
          isEvaluating,
          index = 0,
          interpolate = options.interpolate || reNoMatch,
          source = "__p += '";

      // Compile the regexp to match each delimiter.
      var reDelimiters = RegExp(
        (options.escape || reNoMatch).source + '|' +
        interpolate.source + '|' +
        (interpolate === reInterpolate ? reEsTemplate : reNoMatch).source + '|' +
        (options.evaluate || reNoMatch).source + '|$'
      , 'g');

      // Use a sourceURL for easier debugging.
      var sourceURL = '//# sourceURL=' +
        ('sourceURL' in options
          ? options.sourceURL
          : ('lodash.templateSources[' + (++templateCounter) + ']')
        ) + '\n';

      string.replace(reDelimiters, function(match, escapeValue, interpolateValue, esTemplateValue, evaluateValue, offset) {
        interpolateValue || (interpolateValue = esTemplateValue);

        // Escape characters that can't be included in string literals.
        source += string.slice(index, offset).replace(reUnescapedString, escapeStringChar);

        // Replace delimiters with snippets.
        if (escapeValue) {
          isEscaping = true;
          source += "' +\n__e(" + escapeValue + ") +\n'";
        }
        if (evaluateValue) {
          isEvaluating = true;
          source += "';\n" + evaluateValue + ";\n__p += '";
        }
        if (interpolateValue) {
          source += "' +\n((__t = (" + interpolateValue + ")) == null ? '' : __t) +\n'";
        }
        index = offset + match.length;

        // The JS engine embedded in Adobe products requires returning the `match`
        // string in order to produce the correct `offset` value.
        return match;
      });

      source += "';\n";

      // If `variable` is not specified wrap a with-statement around the generated
      // code to add the data object to the top of the scope chain.
      var variable = options.variable;
      if (!variable) {
        source = 'with (obj) {\n' + source + '\n}\n';
      }
      // Cleanup code by stripping empty strings.
      source = (isEvaluating ? source.replace(reEmptyStringLeading, '') : source)
        .replace(reEmptyStringMiddle, '$1')
        .replace(reEmptyStringTrailing, '$1;');

      // Frame code as the function body.
      source = 'function(' + (variable || 'obj') + ') {\n' +
        (variable
          ? ''
          : 'obj || (obj = {});\n'
        ) +
        "var __t, __p = ''" +
        (isEscaping
           ? ', __e = _.escape'
           : ''
        ) +
        (isEvaluating
          ? ', __j = Array.prototype.join;\n' +
            "function print() { __p += __j.call(arguments, '') }\n"
          : ';\n'
        ) +
        source +
        'return __p\n}';

      var result = attempt(function() {
        return Function(importsKeys, sourceURL + 'return ' + source).apply(undefined, importsValues);
      });

      // Provide the compiled function's source by its `toString` method or
      // the `source` property as a convenience for inlining compiled templates.
      result.source = source;
      if (isError(result)) {
        throw result;
      }
      return result;
    }

    /**
     * Removes leading and trailing whitespace or specified characters from `string`.
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to trim.
     * @param {string} [chars=whitespace] The characters to trim.
     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
     * @returns {string} Returns the trimmed string.
     * @example
     *
     * _.trim('  abc  ');
     * // => 'abc'
     *
     * _.trim('-_-abc-_-', '_-');
     * // => 'abc'
     *
     * _.map(['  foo  ', '  bar  '], _.trim);
     * // => ['foo', 'bar']
     */
    function trim(string, chars, guard) {
      var value = string;
      string = baseToString(string);
      if (!string) {
        return string;
      }
      if (guard ? isIterateeCall(value, chars, guard) : chars == null) {
        return string.slice(trimmedLeftIndex(string), trimmedRightIndex(string) + 1);
      }
      chars = (chars + '');
      return string.slice(charsLeftIndex(string, chars), charsRightIndex(string, chars) + 1);
    }

    /**
     * Removes leading whitespace or specified characters from `string`.
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to trim.
     * @param {string} [chars=whitespace] The characters to trim.
     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
     * @returns {string} Returns the trimmed string.
     * @example
     *
     * _.trimLeft('  abc  ');
     * // => 'abc  '
     *
     * _.trimLeft('-_-abc-_-', '_-');
     * // => 'abc-_-'
     */
    function trimLeft(string, chars, guard) {
      var value = string;
      string = baseToString(string);
      if (!string) {
        return string;
      }
      if (guard ? isIterateeCall(value, chars, guard) : chars == null) {
        return string.slice(trimmedLeftIndex(string));
      }
      return string.slice(charsLeftIndex(string, (chars + '')));
    }

    /**
     * Removes trailing whitespace or specified characters from `string`.
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to trim.
     * @param {string} [chars=whitespace] The characters to trim.
     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
     * @returns {string} Returns the trimmed string.
     * @example
     *
     * _.trimRight('  abc  ');
     * // => '  abc'
     *
     * _.trimRight('-_-abc-_-', '_-');
     * // => '-_-abc'
     */
    function trimRight(string, chars, guard) {
      var value = string;
      string = baseToString(string);
      if (!string) {
        return string;
      }
      if (guard ? isIterateeCall(value, chars, guard) : chars == null) {
        return string.slice(0, trimmedRightIndex(string) + 1);
      }
      return string.slice(0, charsRightIndex(string, (chars + '')) + 1);
    }

    /**
     * Truncates `string` if it's longer than the given maximum string length.
     * The last characters of the truncated string are replaced with the omission
     * string which defaults to "...".
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to truncate.
     * @param {Object|number} [options] The options object or maximum string length.
     * @param {number} [options.length=30] The maximum string length.
     * @param {string} [options.omission='...'] The string to indicate text is omitted.
     * @param {RegExp|string} [options.separator] The separator pattern to truncate to.
     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
     * @returns {string} Returns the truncated string.
     * @example
     *
     * _.trunc('hi-diddly-ho there, neighborino');
     * // => 'hi-diddly-ho there, neighbo...'
     *
     * _.trunc('hi-diddly-ho there, neighborino', 24);
     * // => 'hi-diddly-ho there, n...'
     *
     * _.trunc('hi-diddly-ho there, neighborino', {
     *   'length': 24,
     *   'separator': ' '
     * });
     * // => 'hi-diddly-ho there,...'
     *
     * _.trunc('hi-diddly-ho there, neighborino', {
     *   'length': 24,
     *   'separator': /,? +/
     * });
     * // => 'hi-diddly-ho there...'
     *
     * _.trunc('hi-diddly-ho there, neighborino', {
     *   'omission': ' [...]'
     * });
     * // => 'hi-diddly-ho there, neig [...]'
     */
    function trunc(string, options, guard) {
      if (guard && isIterateeCall(string, options, guard)) {
        options = undefined;
      }
      var length = DEFAULT_TRUNC_LENGTH,
          omission = DEFAULT_TRUNC_OMISSION;

      if (options != null) {
        if (isObject(options)) {
          var separator = 'separator' in options ? options.separator : separator;
          length = 'length' in options ? (+options.length || 0) : length;
          omission = 'omission' in options ? baseToString(options.omission) : omission;
        } else {
          length = +options || 0;
        }
      }
      string = baseToString(string);
      if (length >= string.length) {
        return string;
      }
      var end = length - omission.length;
      if (end < 1) {
        return omission;
      }
      var result = string.slice(0, end);
      if (separator == null) {
        return result + omission;
      }
      if (isRegExp(separator)) {
        if (string.slice(end).search(separator)) {
          var match,
              newEnd,
              substring = string.slice(0, end);

          if (!separator.global) {
            separator = RegExp(separator.source, (reFlags.exec(separator) || '') + 'g');
          }
          separator.lastIndex = 0;
          while ((match = separator.exec(substring))) {
            newEnd = match.index;
          }
          result = result.slice(0, newEnd == null ? end : newEnd);
        }
      } else if (string.indexOf(separator, end) != end) {
        var index = result.lastIndexOf(separator);
        if (index > -1) {
          result = result.slice(0, index);
        }
      }
      return result + omission;
    }

    /**
     * The inverse of `_.escape`; this method converts the HTML entities
     * `&amp;`, `&lt;`, `&gt;`, `&quot;`, `&#39;`, and `&#96;` in `string` to their
     * corresponding characters.
     *
     * **Note:** No other HTML entities are unescaped. To unescape additional HTML
     * entities use a third-party library like [_he_](https://mths.be/he).
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to unescape.
     * @returns {string} Returns the unescaped string.
     * @example
     *
     * _.unescape('fred, barney, &amp; pebbles');
     * // => 'fred, barney, & pebbles'
     */
    function unescape(string) {
      string = baseToString(string);
      return (string && reHasEscapedHtml.test(string))
        ? string.replace(reEscapedHtml, unescapeHtmlChar)
        : string;
    }

    /**
     * Splits `string` into an array of its words.
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to inspect.
     * @param {RegExp|string} [pattern] The pattern to match words.
     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
     * @returns {Array} Returns the words of `string`.
     * @example
     *
     * _.words('fred, barney, & pebbles');
     * // => ['fred', 'barney', 'pebbles']
     *
     * _.words('fred, barney, & pebbles', /[^, ]+/g);
     * // => ['fred', 'barney', '&', 'pebbles']
     */
    function words(string, pattern, guard) {
      if (guard && isIterateeCall(string, pattern, guard)) {
        pattern = undefined;
      }
      string = baseToString(string);
      return string.match(pattern || reWords) || [];
    }

    /*------------------------------------------------------------------------*/

    /**
     * Attempts to invoke `func`, returning either the result or the caught error
     * object. Any additional arguments are provided to `func` when it is invoked.
     *
     * @static
     * @memberOf _
     * @category Utility
     * @param {Function} func The function to attempt.
     * @returns {*} Returns the `func` result or error object.
     * @example
     *
     * // avoid throwing errors for invalid selectors
     * var elements = _.attempt(function(selector) {
     *   return document.querySelectorAll(selector);
     * }, '>_>');
     *
     * if (_.isError(elements)) {
     *   elements = [];
     * }
     */
    var attempt = restParam(function(func, args) {
      try {
        return func.apply(undefined, args);
      } catch(e) {
        return isError(e) ? e : new Error(e);
      }
    });

    /**
     * Creates a function that invokes `func` with the `this` binding of `thisArg`
     * and arguments of the created function. If `func` is a property name the
     * created callback returns the property value for a given element. If `func`
     * is an object the created callback returns `true` for elements that contain
     * the equivalent object properties, otherwise it returns `false`.
     *
     * @static
     * @memberOf _
     * @alias iteratee
     * @category Utility
     * @param {*} [func=_.identity] The value to convert to a callback.
     * @param {*} [thisArg] The `this` binding of `func`.
     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
     * @returns {Function} Returns the callback.
     * @example
     *
     * var users = [
     *   { 'user': 'barney', 'age': 36 },
     *   { 'user': 'fred',   'age': 40 }
     * ];
     *
     * // wrap to create custom callback shorthands
     * _.callback = _.wrap(_.callback, function(callback, func, thisArg) {
     *   var match = /^(.+?)__([gl]t)(.+)$/.exec(func);
     *   if (!match) {
     *     return callback(func, thisArg);
     *   }
     *   return function(object) {
     *     return match[2] == 'gt'
     *       ? object[match[1]] > match[3]
     *       : object[match[1]] < match[3];
     *   };
     * });
     *
     * _.filter(users, 'age__gt36');
     * // => [{ 'user': 'fred', 'age': 40 }]
     */
    function callback(func, thisArg, guard) {
      if (guard && isIterateeCall(func, thisArg, guard)) {
        thisArg = undefined;
      }
      return isObjectLike(func)
        ? matches(func)
        : baseCallback(func, thisArg);
    }

    /**
     * Creates a function that returns `value`.
     *
     * @static
     * @memberOf _
     * @category Utility
     * @param {*} value The value to return from the new function.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var object = { 'user': 'fred' };
     * var getter = _.constant(object);
     *
     * getter() === object;
     * // => true
     */
    function constant(value) {
      return function() {
        return value;
      };
    }

    /**
     * This method returns the first argument provided to it.
     *
     * @static
     * @memberOf _
     * @category Utility
     * @param {*} value Any value.
     * @returns {*} Returns `value`.
     * @example
     *
     * var object = { 'user': 'fred' };
     *
     * _.identity(object) === object;
     * // => true
     */
    function identity(value) {
      return value;
    }

    /**
     * Creates a function that performs a deep comparison between a given object
     * and `source`, returning `true` if the given object has equivalent property
     * values, else `false`.
     *
     * **Note:** This method supports comparing arrays, booleans, `Date` objects,
     * numbers, `Object` objects, regexes, and strings. Objects are compared by
     * their own, not inherited, enumerable properties. For comparing a single
     * own or inherited property value see `_.matchesProperty`.
     *
     * @static
     * @memberOf _
     * @category Utility
     * @param {Object} source The object of property values to match.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var users = [
     *   { 'user': 'barney', 'age': 36, 'active': true },
     *   { 'user': 'fred',   'age': 40, 'active': false }
     * ];
     *
     * _.filter(users, _.matches({ 'age': 40, 'active': false }));
     * // => [{ 'user': 'fred', 'age': 40, 'active': false }]
     */
    function matches(source) {
      return baseMatches(baseClone(source, true));
    }

    /**
     * Creates a function that compares the property value of `path` on a given
     * object to `value`.
     *
     * **Note:** This method supports comparing arrays, booleans, `Date` objects,
     * numbers, `Object` objects, regexes, and strings. Objects are compared by
     * their own, not inherited, enumerable properties.
     *
     * @static
     * @memberOf _
     * @category Utility
     * @param {Array|string} path The path of the property to get.
     * @param {*} srcValue The value to match.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var users = [
     *   { 'user': 'barney' },
     *   { 'user': 'fred' }
     * ];
     *
     * _.find(users, _.matchesProperty('user', 'fred'));
     * // => { 'user': 'fred' }
     */
    function matchesProperty(path, srcValue) {
      return baseMatchesProperty(path, baseClone(srcValue, true));
    }

    /**
     * Creates a function that invokes the method at `path` on a given object.
     * Any additional arguments are provided to the invoked method.
     *
     * @static
     * @memberOf _
     * @category Utility
     * @param {Array|string} path The path of the method to invoke.
     * @param {...*} [args] The arguments to invoke the method with.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var objects = [
     *   { 'a': { 'b': { 'c': _.constant(2) } } },
     *   { 'a': { 'b': { 'c': _.constant(1) } } }
     * ];
     *
     * _.map(objects, _.method('a.b.c'));
     * // => [2, 1]
     *
     * _.invoke(_.sortBy(objects, _.method(['a', 'b', 'c'])), 'a.b.c');
     * // => [1, 2]
     */
    var method = restParam(function(path, args) {
      return function(object) {
        return invokePath(object, path, args);
      };
    });

    /**
     * The opposite of `_.method`; this method creates a function that invokes
     * the method at a given path on `object`. Any additional arguments are
     * provided to the invoked method.
     *
     * @static
     * @memberOf _
     * @category Utility
     * @param {Object} object The object to query.
     * @param {...*} [args] The arguments to invoke the method with.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var array = _.times(3, _.constant),
     *     object = { 'a': array, 'b': array, 'c': array };
     *
     * _.map(['a[2]', 'c[0]'], _.methodOf(object));
     * // => [2, 0]
     *
     * _.map([['a', '2'], ['c', '0']], _.methodOf(object));
     * // => [2, 0]
     */
    var methodOf = restParam(function(object, args) {
      return function(path) {
        return invokePath(object, path, args);
      };
    });

    /**
     * Adds all own enumerable function properties of a source object to the
     * destination object. If `object` is a function then methods are added to
     * its prototype as well.
     *
     * **Note:** Use `_.runInContext` to create a pristine `lodash` function to
     * avoid conflicts caused by modifying the original.
     *
     * @static
     * @memberOf _
     * @category Utility
     * @param {Function|Object} [object=lodash] The destination object.
     * @param {Object} source The object of functions to add.
     * @param {Object} [options] The options object.
     * @param {boolean} [options.chain=true] Specify whether the functions added
     *  are chainable.
     * @returns {Function|Object} Returns `object`.
     * @example
     *
     * function vowels(string) {
     *   return _.filter(string, function(v) {
     *     return /[aeiou]/i.test(v);
     *   });
     * }
     *
     * _.mixin({ 'vowels': vowels });
     * _.vowels('fred');
     * // => ['e']
     *
     * _('fred').vowels().value();
     * // => ['e']
     *
     * _.mixin({ 'vowels': vowels }, { 'chain': false });
     * _('fred').vowels();
     * // => ['e']
     */
    function mixin(object, source, options) {
      if (options == null) {
        var isObj = isObject(source),
            props = isObj ? keys(source) : undefined,
            methodNames = (props && props.length) ? baseFunctions(source, props) : undefined;

        if (!(methodNames ? methodNames.length : isObj)) {
          methodNames = false;
          options = source;
          source = object;
          object = this;
        }
      }
      if (!methodNames) {
        methodNames = baseFunctions(source, keys(source));
      }
      var chain = true,
          index = -1,
          isFunc = isFunction(object),
          length = methodNames.length;

      if (options === false) {
        chain = false;
      } else if (isObject(options) && 'chain' in options) {
        chain = options.chain;
      }
      while (++index < length) {
        var methodName = methodNames[index],
            func = source[methodName];

        object[methodName] = func;
        if (isFunc) {
          object.prototype[methodName] = (function(func) {
            return function() {
              var chainAll = this.__chain__;
              if (chain || chainAll) {
                var result = object(this.__wrapped__),
                    actions = result.__actions__ = arrayCopy(this.__actions__);

                actions.push({ 'func': func, 'args': arguments, 'thisArg': object });
                result.__chain__ = chainAll;
                return result;
              }
              return func.apply(object, arrayPush([this.value()], arguments));
            };
          }(func));
        }
      }
      return object;
    }

    /**
     * Reverts the `_` variable to its previous value and returns a reference to
     * the `lodash` function.
     *
     * @static
     * @memberOf _
     * @category Utility
     * @returns {Function} Returns the `lodash` function.
     * @example
     *
     * var lodash = _.noConflict();
     */
    function noConflict() {
      root._ = oldDash;
      return this;
    }

    /**
     * A no-operation function that returns `undefined` regardless of the
     * arguments it receives.
     *
     * @static
     * @memberOf _
     * @category Utility
     * @example
     *
     * var object = { 'user': 'fred' };
     *
     * _.noop(object) === undefined;
     * // => true
     */
    function noop() {
      // No operation performed.
    }

    /**
     * Creates a function that returns the property value at `path` on a
     * given object.
     *
     * @static
     * @memberOf _
     * @category Utility
     * @param {Array|string} path The path of the property to get.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var objects = [
     *   { 'a': { 'b': { 'c': 2 } } },
     *   { 'a': { 'b': { 'c': 1 } } }
     * ];
     *
     * _.map(objects, _.property('a.b.c'));
     * // => [2, 1]
     *
     * _.pluck(_.sortBy(objects, _.property(['a', 'b', 'c'])), 'a.b.c');
     * // => [1, 2]
     */
    function property(path) {
      return isKey(path) ? baseProperty(path) : basePropertyDeep(path);
    }

    /**
     * The opposite of `_.property`; this method creates a function that returns
     * the property value at a given path on `object`.
     *
     * @static
     * @memberOf _
     * @category Utility
     * @param {Object} object The object to query.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var array = [0, 1, 2],
     *     object = { 'a': array, 'b': array, 'c': array };
     *
     * _.map(['a[2]', 'c[0]'], _.propertyOf(object));
     * // => [2, 0]
     *
     * _.map([['a', '2'], ['c', '0']], _.propertyOf(object));
     * // => [2, 0]
     */
    function propertyOf(object) {
      return function(path) {
        return baseGet(object, toPath(path), path + '');
      };
    }

    /**
     * Creates an array of numbers (positive and/or negative) progressing from
     * `start` up to, but not including, `end`. If `end` is not specified it is
     * set to `start` with `start` then set to `0`. If `end` is less than `start`
     * a zero-length range is created unless a negative `step` is specified.
     *
     * @static
     * @memberOf _
     * @category Utility
     * @param {number} [start=0] The start of the range.
     * @param {number} end The end of the range.
     * @param {number} [step=1] The value to increment or decrement by.
     * @returns {Array} Returns the new array of numbers.
     * @example
     *
     * _.range(4);
     * // => [0, 1, 2, 3]
     *
     * _.range(1, 5);
     * // => [1, 2, 3, 4]
     *
     * _.range(0, 20, 5);
     * // => [0, 5, 10, 15]
     *
     * _.range(0, -4, -1);
     * // => [0, -1, -2, -3]
     *
     * _.range(1, 4, 0);
     * // => [1, 1, 1]
     *
     * _.range(0);
     * // => []
     */
    function range(start, end, step) {
      if (step && isIterateeCall(start, end, step)) {
        end = step = undefined;
      }
      start = +start || 0;
      step = step == null ? 1 : (+step || 0);

      if (end == null) {
        end = start;
        start = 0;
      } else {
        end = +end || 0;
      }
      // Use `Array(length)` so engines like Chakra and V8 avoid slower modes.
      // See https://youtu.be/XAqIpGU8ZZk#t=17m25s for more details.
      var index = -1,
          length = nativeMax(nativeCeil((end - start) / (step || 1)), 0),
          result = Array(length);

      while (++index < length) {
        result[index] = start;
        start += step;
      }
      return result;
    }

    /**
     * Invokes the iteratee function `n` times, returning an array of the results
     * of each invocation. The `iteratee` is bound to `thisArg` and invoked with
     * one argument; (index).
     *
     * @static
     * @memberOf _
     * @category Utility
     * @param {number} n The number of times to invoke `iteratee`.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {Array} Returns the array of results.
     * @example
     *
     * var diceRolls = _.times(3, _.partial(_.random, 1, 6, false));
     * // => [3, 6, 4]
     *
     * _.times(3, function(n) {
     *   mage.castSpell(n);
     * });
     * // => invokes `mage.castSpell(n)` three times with `n` of `0`, `1`, and `2`
     *
     * _.times(3, function(n) {
     *   this.cast(n);
     * }, mage);
     * // => also invokes `mage.castSpell(n)` three times
     */
    function times(n, iteratee, thisArg) {
      n = nativeFloor(n);

      // Exit early to avoid a JSC JIT bug in Safari 8
      // where `Array(0)` is treated as `Array(1)`.
      if (n < 1 || !nativeIsFinite(n)) {
        return [];
      }
      var index = -1,
          result = Array(nativeMin(n, MAX_ARRAY_LENGTH));

      iteratee = bindCallback(iteratee, thisArg, 1);
      while (++index < n) {
        if (index < MAX_ARRAY_LENGTH) {
          result[index] = iteratee(index);
        } else {
          iteratee(index);
        }
      }
      return result;
    }

    /**
     * Generates a unique ID. If `prefix` is provided the ID is appended to it.
     *
     * @static
     * @memberOf _
     * @category Utility
     * @param {string} [prefix] The value to prefix the ID with.
     * @returns {string} Returns the unique ID.
     * @example
     *
     * _.uniqueId('contact_');
     * // => 'contact_104'
     *
     * _.uniqueId();
     * // => '105'
     */
    function uniqueId(prefix) {
      var id = ++idCounter;
      return baseToString(prefix) + id;
    }

    /*------------------------------------------------------------------------*/

    /**
     * Adds two numbers.
     *
     * @static
     * @memberOf _
     * @category Math
     * @param {number} augend The first number to add.
     * @param {number} addend The second number to add.
     * @returns {number} Returns the sum.
     * @example
     *
     * _.add(6, 4);
     * // => 10
     */
    function add(augend, addend) {
      return (+augend || 0) + (+addend || 0);
    }

    /**
     * Calculates `n` rounded up to `precision`.
     *
     * @static
     * @memberOf _
     * @category Math
     * @param {number} n The number to round up.
     * @param {number} [precision=0] The precision to round up to.
     * @returns {number} Returns the rounded up number.
     * @example
     *
     * _.ceil(4.006);
     * // => 5
     *
     * _.ceil(6.004, 2);
     * // => 6.01
     *
     * _.ceil(6040, -2);
     * // => 6100
     */
    var ceil = createRound('ceil');

    /**
     * Calculates `n` rounded down to `precision`.
     *
     * @static
     * @memberOf _
     * @category Math
     * @param {number} n The number to round down.
     * @param {number} [precision=0] The precision to round down to.
     * @returns {number} Returns the rounded down number.
     * @example
     *
     * _.floor(4.006);
     * // => 4
     *
     * _.floor(0.046, 2);
     * // => 0.04
     *
     * _.floor(4060, -2);
     * // => 4000
     */
    var floor = createRound('floor');

    /**
     * Gets the maximum value of `collection`. If `collection` is empty or falsey
     * `-Infinity` is returned. If an iteratee function is provided it is invoked
     * for each value in `collection` to generate the criterion by which the value
     * is ranked. The `iteratee` is bound to `thisArg` and invoked with three
     * arguments: (value, index, collection).
     *
     * If a property name is provided for `iteratee` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `iteratee` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @category Math
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [iteratee] The function invoked per iteration.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {*} Returns the maximum value.
     * @example
     *
     * _.max([4, 2, 8, 6]);
     * // => 8
     *
     * _.max([]);
     * // => -Infinity
     *
     * var users = [
     *   { 'user': 'barney', 'age': 36 },
     *   { 'user': 'fred',   'age': 40 }
     * ];
     *
     * _.max(users, function(chr) {
     *   return chr.age;
     * });
     * // => { 'user': 'fred', 'age': 40 }
     *
     * // using the `_.property` callback shorthand
     * _.max(users, 'age');
     * // => { 'user': 'fred', 'age': 40 }
     */
    var max = createExtremum(gt, NEGATIVE_INFINITY);

    /**
     * Gets the minimum value of `collection`. If `collection` is empty or falsey
     * `Infinity` is returned. If an iteratee function is provided it is invoked
     * for each value in `collection` to generate the criterion by which the value
     * is ranked. The `iteratee` is bound to `thisArg` and invoked with three
     * arguments: (value, index, collection).
     *
     * If a property name is provided for `iteratee` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `iteratee` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @category Math
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [iteratee] The function invoked per iteration.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {*} Returns the minimum value.
     * @example
     *
     * _.min([4, 2, 8, 6]);
     * // => 2
     *
     * _.min([]);
     * // => Infinity
     *
     * var users = [
     *   { 'user': 'barney', 'age': 36 },
     *   { 'user': 'fred',   'age': 40 }
     * ];
     *
     * _.min(users, function(chr) {
     *   return chr.age;
     * });
     * // => { 'user': 'barney', 'age': 36 }
     *
     * // using the `_.property` callback shorthand
     * _.min(users, 'age');
     * // => { 'user': 'barney', 'age': 36 }
     */
    var min = createExtremum(lt, POSITIVE_INFINITY);

    /**
     * Calculates `n` rounded to `precision`.
     *
     * @static
     * @memberOf _
     * @category Math
     * @param {number} n The number to round.
     * @param {number} [precision=0] The precision to round to.
     * @returns {number} Returns the rounded number.
     * @example
     *
     * _.round(4.006);
     * // => 4
     *
     * _.round(4.006, 2);
     * // => 4.01
     *
     * _.round(4060, -2);
     * // => 4100
     */
    var round = createRound('round');

    /**
     * Gets the sum of the values in `collection`.
     *
     * @static
     * @memberOf _
     * @category Math
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [iteratee] The function invoked per iteration.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {number} Returns the sum.
     * @example
     *
     * _.sum([4, 6]);
     * // => 10
     *
     * _.sum({ 'a': 4, 'b': 6 });
     * // => 10
     *
     * var objects = [
     *   { 'n': 4 },
     *   { 'n': 6 }
     * ];
     *
     * _.sum(objects, function(object) {
     *   return object.n;
     * });
     * // => 10
     *
     * // using the `_.property` callback shorthand
     * _.sum(objects, 'n');
     * // => 10
     */
    function sum(collection, iteratee, thisArg) {
      if (thisArg && isIterateeCall(collection, iteratee, thisArg)) {
        iteratee = undefined;
      }
      iteratee = getCallback(iteratee, thisArg, 3);
      return iteratee.length == 1
        ? arraySum(isArray(collection) ? collection : toIterable(collection), iteratee)
        : baseSum(collection, iteratee);
    }

    /*------------------------------------------------------------------------*/

    // Ensure wrappers are instances of `baseLodash`.
    lodash.prototype = baseLodash.prototype;

    LodashWrapper.prototype = baseCreate(baseLodash.prototype);
    LodashWrapper.prototype.constructor = LodashWrapper;

    LazyWrapper.prototype = baseCreate(baseLodash.prototype);
    LazyWrapper.prototype.constructor = LazyWrapper;

    // Add functions to the `Map` cache.
    MapCache.prototype['delete'] = mapDelete;
    MapCache.prototype.get = mapGet;
    MapCache.prototype.has = mapHas;
    MapCache.prototype.set = mapSet;

    // Add functions to the `Set` cache.
    SetCache.prototype.push = cachePush;

    // Assign cache to `_.memoize`.
    memoize.Cache = MapCache;

    // Add functions that return wrapped values when chaining.
    lodash.after = after;
    lodash.ary = ary;
    lodash.assign = assign;
    lodash.at = at;
    lodash.before = before;
    lodash.bind = bind;
    lodash.bindAll = bindAll;
    lodash.bindKey = bindKey;
    lodash.callback = callback;
    lodash.chain = chain;
    lodash.chunk = chunk;
    lodash.compact = compact;
    lodash.constant = constant;
    lodash.countBy = countBy;
    lodash.create = create;
    lodash.curry = curry;
    lodash.curryRight = curryRight;
    lodash.debounce = debounce;
    lodash.defaults = defaults;
    lodash.defaultsDeep = defaultsDeep;
    lodash.defer = defer;
    lodash.delay = delay;
    lodash.difference = difference;
    lodash.drop = drop;
    lodash.dropRight = dropRight;
    lodash.dropRightWhile = dropRightWhile;
    lodash.dropWhile = dropWhile;
    lodash.fill = fill;
    lodash.filter = filter;
    lodash.flatten = flatten;
    lodash.flattenDeep = flattenDeep;
    lodash.flow = flow;
    lodash.flowRight = flowRight;
    lodash.forEach = forEach;
    lodash.forEachRight = forEachRight;
    lodash.forIn = forIn;
    lodash.forInRight = forInRight;
    lodash.forOwn = forOwn;
    lodash.forOwnRight = forOwnRight;
    lodash.functions = functions;
    lodash.groupBy = groupBy;
    lodash.indexBy = indexBy;
    lodash.initial = initial;
    lodash.intersection = intersection;
    lodash.invert = invert;
    lodash.invoke = invoke;
    lodash.keys = keys;
    lodash.keysIn = keysIn;
    lodash.map = map;
    lodash.mapKeys = mapKeys;
    lodash.mapValues = mapValues;
    lodash.matches = matches;
    lodash.matchesProperty = matchesProperty;
    lodash.memoize = memoize;
    lodash.merge = merge;
    lodash.method = method;
    lodash.methodOf = methodOf;
    lodash.mixin = mixin;
    lodash.modArgs = modArgs;
    lodash.negate = negate;
    lodash.omit = omit;
    lodash.once = once;
    lodash.pairs = pairs;
    lodash.partial = partial;
    lodash.partialRight = partialRight;
    lodash.partition = partition;
    lodash.pick = pick;
    lodash.pluck = pluck;
    lodash.property = property;
    lodash.propertyOf = propertyOf;
    lodash.pull = pull;
    lodash.pullAt = pullAt;
    lodash.range = range;
    lodash.rearg = rearg;
    lodash.reject = reject;
    lodash.remove = remove;
    lodash.rest = rest;
    lodash.restParam = restParam;
    lodash.set = set;
    lodash.shuffle = shuffle;
    lodash.slice = slice;
    lodash.sortBy = sortBy;
    lodash.sortByAll = sortByAll;
    lodash.sortByOrder = sortByOrder;
    lodash.spread = spread;
    lodash.take = take;
    lodash.takeRight = takeRight;
    lodash.takeRightWhile = takeRightWhile;
    lodash.takeWhile = takeWhile;
    lodash.tap = tap;
    lodash.throttle = throttle;
    lodash.thru = thru;
    lodash.times = times;
    lodash.toArray = toArray;
    lodash.toPlainObject = toPlainObject;
    lodash.transform = transform;
    lodash.union = union;
    lodash.uniq = uniq;
    lodash.unzip = unzip;
    lodash.unzipWith = unzipWith;
    lodash.values = values;
    lodash.valuesIn = valuesIn;
    lodash.where = where;
    lodash.without = without;
    lodash.wrap = wrap;
    lodash.xor = xor;
    lodash.zip = zip;
    lodash.zipObject = zipObject;
    lodash.zipWith = zipWith;

    // Add aliases.
    lodash.backflow = flowRight;
    lodash.collect = map;
    lodash.compose = flowRight;
    lodash.each = forEach;
    lodash.eachRight = forEachRight;
    lodash.extend = assign;
    lodash.iteratee = callback;
    lodash.methods = functions;
    lodash.object = zipObject;
    lodash.select = filter;
    lodash.tail = rest;
    lodash.unique = uniq;

    // Add functions to `lodash.prototype`.
    mixin(lodash, lodash);

    /*------------------------------------------------------------------------*/

    // Add functions that return unwrapped values when chaining.
    lodash.add = add;
    lodash.attempt = attempt;
    lodash.camelCase = camelCase;
    lodash.capitalize = capitalize;
    lodash.ceil = ceil;
    lodash.clone = clone;
    lodash.cloneDeep = cloneDeep;
    lodash.deburr = deburr;
    lodash.endsWith = endsWith;
    lodash.escape = escape;
    lodash.escapeRegExp = escapeRegExp;
    lodash.every = every;
    lodash.find = find;
    lodash.findIndex = findIndex;
    lodash.findKey = findKey;
    lodash.findLast = findLast;
    lodash.findLastIndex = findLastIndex;
    lodash.findLastKey = findLastKey;
    lodash.findWhere = findWhere;
    lodash.first = first;
    lodash.floor = floor;
    lodash.get = get;
    lodash.gt = gt;
    lodash.gte = gte;
    lodash.has = has;
    lodash.identity = identity;
    lodash.includes = includes;
    lodash.indexOf = indexOf;
    lodash.inRange = inRange;
    lodash.isArguments = isArguments;
    lodash.isArray = isArray;
    lodash.isBoolean = isBoolean;
    lodash.isDate = isDate;
    lodash.isElement = isElement;
    lodash.isEmpty = isEmpty;
    lodash.isEqual = isEqual;
    lodash.isError = isError;
    lodash.isFinite = isFinite;
    lodash.isFunction = isFunction;
    lodash.isMatch = isMatch;
    lodash.isNaN = isNaN;
    lodash.isNative = isNative;
    lodash.isNull = isNull;
    lodash.isNumber = isNumber;
    lodash.isObject = isObject;
    lodash.isPlainObject = isPlainObject;
    lodash.isRegExp = isRegExp;
    lodash.isString = isString;
    lodash.isTypedArray = isTypedArray;
    lodash.isUndefined = isUndefined;
    lodash.kebabCase = kebabCase;
    lodash.last = last;
    lodash.lastIndexOf = lastIndexOf;
    lodash.lt = lt;
    lodash.lte = lte;
    lodash.max = max;
    lodash.min = min;
    lodash.noConflict = noConflict;
    lodash.noop = noop;
    lodash.now = now;
    lodash.pad = pad;
    lodash.padLeft = padLeft;
    lodash.padRight = padRight;
    lodash.parseInt = parseInt;
    lodash.random = random;
    lodash.reduce = reduce;
    lodash.reduceRight = reduceRight;
    lodash.repeat = repeat;
    lodash.result = result;
    lodash.round = round;
    lodash.runInContext = runInContext;
    lodash.size = size;
    lodash.snakeCase = snakeCase;
    lodash.some = some;
    lodash.sortedIndex = sortedIndex;
    lodash.sortedLastIndex = sortedLastIndex;
    lodash.startCase = startCase;
    lodash.startsWith = startsWith;
    lodash.sum = sum;
    lodash.template = template;
    lodash.trim = trim;
    lodash.trimLeft = trimLeft;
    lodash.trimRight = trimRight;
    lodash.trunc = trunc;
    lodash.unescape = unescape;
    lodash.uniqueId = uniqueId;
    lodash.words = words;

    // Add aliases.
    lodash.all = every;
    lodash.any = some;
    lodash.contains = includes;
    lodash.eq = isEqual;
    lodash.detect = find;
    lodash.foldl = reduce;
    lodash.foldr = reduceRight;
    lodash.head = first;
    lodash.include = includes;
    lodash.inject = reduce;

    mixin(lodash, (function() {
      var source = {};
      baseForOwn(lodash, function(func, methodName) {
        if (!lodash.prototype[methodName]) {
          source[methodName] = func;
        }
      });
      return source;
    }()), false);

    /*------------------------------------------------------------------------*/

    // Add functions capable of returning wrapped and unwrapped values when chaining.
    lodash.sample = sample;

    lodash.prototype.sample = function(n) {
      if (!this.__chain__ && n == null) {
        return sample(this.value());
      }
      return this.thru(function(value) {
        return sample(value, n);
      });
    };

    /*------------------------------------------------------------------------*/

    /**
     * The semantic version number.
     *
     * @static
     * @memberOf _
     * @type string
     */
    lodash.VERSION = VERSION;

    // Assign default placeholders.
    arrayEach(['bind', 'bindKey', 'curry', 'curryRight', 'partial', 'partialRight'], function(methodName) {
      lodash[methodName].placeholder = lodash;
    });

    // Add `LazyWrapper` methods for `_.drop` and `_.take` variants.
    arrayEach(['drop', 'take'], function(methodName, index) {
      LazyWrapper.prototype[methodName] = function(n) {
        var filtered = this.__filtered__;
        if (filtered && !index) {
          return new LazyWrapper(this);
        }
        n = n == null ? 1 : nativeMax(nativeFloor(n) || 0, 0);

        var result = this.clone();
        if (filtered) {
          result.__takeCount__ = nativeMin(result.__takeCount__, n);
        } else {
          result.__views__.push({ 'size': n, 'type': methodName + (result.__dir__ < 0 ? 'Right' : '') });
        }
        return result;
      };

      LazyWrapper.prototype[methodName + 'Right'] = function(n) {
        return this.reverse()[methodName](n).reverse();
      };
    });

    // Add `LazyWrapper` methods that accept an `iteratee` value.
    arrayEach(['filter', 'map', 'takeWhile'], function(methodName, index) {
      var type = index + 1,
          isFilter = type != LAZY_MAP_FLAG;

      LazyWrapper.prototype[methodName] = function(iteratee, thisArg) {
        var result = this.clone();
        result.__iteratees__.push({ 'iteratee': getCallback(iteratee, thisArg, 1), 'type': type });
        result.__filtered__ = result.__filtered__ || isFilter;
        return result;
      };
    });

    // Add `LazyWrapper` methods for `_.first` and `_.last`.
    arrayEach(['first', 'last'], function(methodName, index) {
      var takeName = 'take' + (index ? 'Right' : '');

      LazyWrapper.prototype[methodName] = function() {
        return this[takeName](1).value()[0];
      };
    });

    // Add `LazyWrapper` methods for `_.initial` and `_.rest`.
    arrayEach(['initial', 'rest'], function(methodName, index) {
      var dropName = 'drop' + (index ? '' : 'Right');

      LazyWrapper.prototype[methodName] = function() {
        return this.__filtered__ ? new LazyWrapper(this) : this[dropName](1);
      };
    });

    // Add `LazyWrapper` methods for `_.pluck` and `_.where`.
    arrayEach(['pluck', 'where'], function(methodName, index) {
      var operationName = index ? 'filter' : 'map',
          createCallback = index ? baseMatches : property;

      LazyWrapper.prototype[methodName] = function(value) {
        return this[operationName](createCallback(value));
      };
    });

    LazyWrapper.prototype.compact = function() {
      return this.filter(identity);
    };

    LazyWrapper.prototype.reject = function(predicate, thisArg) {
      predicate = getCallback(predicate, thisArg, 1);
      return this.filter(function(value) {
        return !predicate(value);
      });
    };

    LazyWrapper.prototype.slice = function(start, end) {
      start = start == null ? 0 : (+start || 0);

      var result = this;
      if (result.__filtered__ && (start > 0 || end < 0)) {
        return new LazyWrapper(result);
      }
      if (start < 0) {
        result = result.takeRight(-start);
      } else if (start) {
        result = result.drop(start);
      }
      if (end !== undefined) {
        end = (+end || 0);
        result = end < 0 ? result.dropRight(-end) : result.take(end - start);
      }
      return result;
    };

    LazyWrapper.prototype.takeRightWhile = function(predicate, thisArg) {
      return this.reverse().takeWhile(predicate, thisArg).reverse();
    };

    LazyWrapper.prototype.toArray = function() {
      return this.take(POSITIVE_INFINITY);
    };

    // Add `LazyWrapper` methods to `lodash.prototype`.
    baseForOwn(LazyWrapper.prototype, function(func, methodName) {
      var checkIteratee = /^(?:filter|map|reject)|While$/.test(methodName),
          retUnwrapped = /^(?:first|last)$/.test(methodName),
          lodashFunc = lodash[retUnwrapped ? ('take' + (methodName == 'last' ? 'Right' : '')) : methodName];

      if (!lodashFunc) {
        return;
      }
      lodash.prototype[methodName] = function() {
        var args = retUnwrapped ? [1] : arguments,
            chainAll = this.__chain__,
            value = this.__wrapped__,
            isHybrid = !!this.__actions__.length,
            isLazy = value instanceof LazyWrapper,
            iteratee = args[0],
            useLazy = isLazy || isArray(value);

        if (useLazy && checkIteratee && typeof iteratee == 'function' && iteratee.length != 1) {
          // Avoid lazy use if the iteratee has a "length" value other than `1`.
          isLazy = useLazy = false;
        }
        var interceptor = function(value) {
          return (retUnwrapped && chainAll)
            ? lodashFunc(value, 1)[0]
            : lodashFunc.apply(undefined, arrayPush([value], args));
        };

        var action = { 'func': thru, 'args': [interceptor], 'thisArg': undefined },
            onlyLazy = isLazy && !isHybrid;

        if (retUnwrapped && !chainAll) {
          if (onlyLazy) {
            value = value.clone();
            value.__actions__.push(action);
            return func.call(value);
          }
          return lodashFunc.call(undefined, this.value())[0];
        }
        if (!retUnwrapped && useLazy) {
          value = onlyLazy ? value : new LazyWrapper(this);
          var result = func.apply(value, args);
          result.__actions__.push(action);
          return new LodashWrapper(result, chainAll);
        }
        return this.thru(interceptor);
      };
    });

    // Add `Array` and `String` methods to `lodash.prototype`.
    arrayEach(['join', 'pop', 'push', 'replace', 'shift', 'sort', 'splice', 'split', 'unshift'], function(methodName) {
      var func = (/^(?:replace|split)$/.test(methodName) ? stringProto : arrayProto)[methodName],
          chainName = /^(?:push|sort|unshift)$/.test(methodName) ? 'tap' : 'thru',
          retUnwrapped = /^(?:join|pop|replace|shift)$/.test(methodName);

      lodash.prototype[methodName] = function() {
        var args = arguments;
        if (retUnwrapped && !this.__chain__) {
          return func.apply(this.value(), args);
        }
        return this[chainName](function(value) {
          return func.apply(value, args);
        });
      };
    });

    // Map minified function names to their real names.
    baseForOwn(LazyWrapper.prototype, function(func, methodName) {
      var lodashFunc = lodash[methodName];
      if (lodashFunc) {
        var key = lodashFunc.name,
            names = realNames[key] || (realNames[key] = []);

        names.push({ 'name': methodName, 'func': lodashFunc });
      }
    });

    realNames[createHybridWrapper(undefined, BIND_KEY_FLAG).name] = [{ 'name': 'wrapper', 'func': undefined }];

    // Add functions to the lazy wrapper.
    LazyWrapper.prototype.clone = lazyClone;
    LazyWrapper.prototype.reverse = lazyReverse;
    LazyWrapper.prototype.value = lazyValue;

    // Add chaining functions to the `lodash` wrapper.
    lodash.prototype.chain = wrapperChain;
    lodash.prototype.commit = wrapperCommit;
    lodash.prototype.concat = wrapperConcat;
    lodash.prototype.plant = wrapperPlant;
    lodash.prototype.reverse = wrapperReverse;
    lodash.prototype.toString = wrapperToString;
    lodash.prototype.run = lodash.prototype.toJSON = lodash.prototype.valueOf = lodash.prototype.value = wrapperValue;

    // Add function aliases to the `lodash` wrapper.
    lodash.prototype.collect = lodash.prototype.map;
    lodash.prototype.head = lodash.prototype.first;
    lodash.prototype.select = lodash.prototype.filter;
    lodash.prototype.tail = lodash.prototype.rest;

    return lodash;
  }

  /*--------------------------------------------------------------------------*/

  // Export lodash.
  var _ = runInContext();

  // Some AMD build optimizers like r.js check for condition patterns like the following:
  if (typeof define == 'function' && typeof define.amd == 'object' && define.amd) {
    // Expose lodash to the global object when an AMD loader is present to avoid
    // errors in cases where lodash is loaded by a script tag and not intended
    // as an AMD module. See http://requirejs.org/docs/errors.html#mismatch for
    // more details.
    root._ = _;

    // Define as an anonymous module so, through path mapping, it can be
    // referenced as the "underscore" module.
    define(function() {
      return _;
    });
  }
  // Check for `exports` after `define` in case a build optimizer adds an `exports` object.
  else if (freeExports && freeModule) {
    // Export for Node.js or RingoJS.
    if (moduleExports) {
      (freeModule.exports = _)._ = _;
    }
    // Export for Rhino with CommonJS support.
    else {
      freeExports._ = _;
    }
  }
  else {
    // Export for a browser or Rhino.
    root._ = _;
  }
}.call(this));

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],22:[function(require,module,exports){
/**
 * Copies the values of `source` to `array`.
 *
 * @private
 * @param {Array} source The array to copy values from.
 * @param {Array} [array=[]] The array to copy values to.
 * @returns {Array} Returns `array`.
 */
function arrayCopy(source, array) {
  var index = -1,
      length = source.length;

  array || (array = Array(length));
  while (++index < length) {
    array[index] = source[index];
  }
  return array;
}

module.exports = arrayCopy;

},{}],23:[function(require,module,exports){
/**
 * A specialized version of `_.forEach` for arrays without support for callback
 * shorthands and `this` binding.
 *
 * @private
 * @param {Array} array The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns `array`.
 */
function arrayEach(array, iteratee) {
  var index = -1,
      length = array.length;

  while (++index < length) {
    if (iteratee(array[index], index, array) === false) {
      break;
    }
  }
  return array;
}

module.exports = arrayEach;

},{}],24:[function(require,module,exports){
/**
 * A specialized version of `_.map` for arrays without support for callback
 * shorthands and `this` binding.
 *
 * @private
 * @param {Array} array The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the new mapped array.
 */
function arrayMap(array, iteratee) {
  var index = -1,
      length = array.length,
      result = Array(length);

  while (++index < length) {
    result[index] = iteratee(array[index], index, array);
  }
  return result;
}

module.exports = arrayMap;

},{}],25:[function(require,module,exports){
/**
 * A specialized version of `_.some` for arrays without support for callback
 * shorthands and `this` binding.
 *
 * @private
 * @param {Array} array The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {boolean} Returns `true` if any element passes the predicate check,
 *  else `false`.
 */
function arraySome(array, predicate) {
  var index = -1,
      length = array.length;

  while (++index < length) {
    if (predicate(array[index], index, array)) {
      return true;
    }
  }
  return false;
}

module.exports = arraySome;

},{}],26:[function(require,module,exports){
var baseCopy = require('./baseCopy'),
    keys = require('../object/keys');

/**
 * The base implementation of `_.assign` without support for argument juggling,
 * multiple sources, and `customizer` functions.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @returns {Object} Returns `object`.
 */
function baseAssign(object, source) {
  return source == null
    ? object
    : baseCopy(source, keys(source), object);
}

module.exports = baseAssign;

},{"../object/keys":88,"./baseCopy":30}],27:[function(require,module,exports){
var baseMatches = require('./baseMatches'),
    baseMatchesProperty = require('./baseMatchesProperty'),
    bindCallback = require('./bindCallback'),
    identity = require('../utility/identity'),
    property = require('../utility/property');

/**
 * The base implementation of `_.callback` which supports specifying the
 * number of arguments to provide to `func`.
 *
 * @private
 * @param {*} [func=_.identity] The value to convert to a callback.
 * @param {*} [thisArg] The `this` binding of `func`.
 * @param {number} [argCount] The number of arguments to provide to `func`.
 * @returns {Function} Returns the callback.
 */
function baseCallback(func, thisArg, argCount) {
  var type = typeof func;
  if (type == 'function') {
    return thisArg === undefined
      ? func
      : bindCallback(func, thisArg, argCount);
  }
  if (func == null) {
    return identity;
  }
  if (type == 'object') {
    return baseMatches(func);
  }
  return thisArg === undefined
    ? property(func)
    : baseMatchesProperty(func, thisArg);
}

module.exports = baseCallback;

},{"../utility/identity":92,"../utility/property":93,"./baseMatches":42,"./baseMatchesProperty":43,"./bindCallback":50}],28:[function(require,module,exports){
var arrayCopy = require('./arrayCopy'),
    arrayEach = require('./arrayEach'),
    baseAssign = require('./baseAssign'),
    baseForOwn = require('./baseForOwn'),
    initCloneArray = require('./initCloneArray'),
    initCloneByTag = require('./initCloneByTag'),
    initCloneObject = require('./initCloneObject'),
    isArray = require('../lang/isArray'),
    isObject = require('../lang/isObject');

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    funcTag = '[object Function]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    objectTag = '[object Object]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    weakMapTag = '[object WeakMap]';

var arrayBufferTag = '[object ArrayBuffer]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/** Used to identify `toStringTag` values supported by `_.clone`. */
var cloneableTags = {};
cloneableTags[argsTag] = cloneableTags[arrayTag] =
cloneableTags[arrayBufferTag] = cloneableTags[boolTag] =
cloneableTags[dateTag] = cloneableTags[float32Tag] =
cloneableTags[float64Tag] = cloneableTags[int8Tag] =
cloneableTags[int16Tag] = cloneableTags[int32Tag] =
cloneableTags[numberTag] = cloneableTags[objectTag] =
cloneableTags[regexpTag] = cloneableTags[stringTag] =
cloneableTags[uint8Tag] = cloneableTags[uint8ClampedTag] =
cloneableTags[uint16Tag] = cloneableTags[uint32Tag] = true;
cloneableTags[errorTag] = cloneableTags[funcTag] =
cloneableTags[mapTag] = cloneableTags[setTag] =
cloneableTags[weakMapTag] = false;

/** Used for native method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 */
var objToString = objectProto.toString;

/**
 * The base implementation of `_.clone` without support for argument juggling
 * and `this` binding `customizer` functions.
 *
 * @private
 * @param {*} value The value to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @param {Function} [customizer] The function to customize cloning values.
 * @param {string} [key] The key of `value`.
 * @param {Object} [object] The object `value` belongs to.
 * @param {Array} [stackA=[]] Tracks traversed source objects.
 * @param {Array} [stackB=[]] Associates clones with source counterparts.
 * @returns {*} Returns the cloned value.
 */
function baseClone(value, isDeep, customizer, key, object, stackA, stackB) {
  var result;
  if (customizer) {
    result = object ? customizer(value, key, object) : customizer(value);
  }
  if (result !== undefined) {
    return result;
  }
  if (!isObject(value)) {
    return value;
  }
  var isArr = isArray(value);
  if (isArr) {
    result = initCloneArray(value);
    if (!isDeep) {
      return arrayCopy(value, result);
    }
  } else {
    var tag = objToString.call(value),
        isFunc = tag == funcTag;

    if (tag == objectTag || tag == argsTag || (isFunc && !object)) {
      result = initCloneObject(isFunc ? {} : value);
      if (!isDeep) {
        return baseAssign(result, value);
      }
    } else {
      return cloneableTags[tag]
        ? initCloneByTag(value, tag, isDeep)
        : (object ? value : {});
    }
  }
  // Check for circular references and return its corresponding clone.
  stackA || (stackA = []);
  stackB || (stackB = []);

  var length = stackA.length;
  while (length--) {
    if (stackA[length] == value) {
      return stackB[length];
    }
  }
  // Add the source value to the stack of traversed objects and associate it with its clone.
  stackA.push(value);
  stackB.push(result);

  // Recursively populate clone (susceptible to call stack limits).
  (isArr ? arrayEach : baseForOwn)(value, function(subValue, key) {
    result[key] = baseClone(subValue, isDeep, customizer, key, value, stackA, stackB);
  });
  return result;
}

module.exports = baseClone;

},{"../lang/isArray":80,"../lang/isObject":83,"./arrayCopy":22,"./arrayEach":23,"./baseAssign":26,"./baseForOwn":35,"./initCloneArray":65,"./initCloneByTag":66,"./initCloneObject":67}],29:[function(require,module,exports){
/**
 * The base implementation of `compareAscending` which compares values and
 * sorts them in ascending order without guaranteeing a stable sort.
 *
 * @private
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {number} Returns the sort order indicator for `value`.
 */
function baseCompareAscending(value, other) {
  if (value !== other) {
    var valIsNull = value === null,
        valIsUndef = value === undefined,
        valIsReflexive = value === value;

    var othIsNull = other === null,
        othIsUndef = other === undefined,
        othIsReflexive = other === other;

    if ((value > other && !othIsNull) || !valIsReflexive ||
        (valIsNull && !othIsUndef && othIsReflexive) ||
        (valIsUndef && othIsReflexive)) {
      return 1;
    }
    if ((value < other && !valIsNull) || !othIsReflexive ||
        (othIsNull && !valIsUndef && valIsReflexive) ||
        (othIsUndef && valIsReflexive)) {
      return -1;
    }
  }
  return 0;
}

module.exports = baseCompareAscending;

},{}],30:[function(require,module,exports){
/**
 * Copies properties of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy properties from.
 * @param {Array} props The property names to copy.
 * @param {Object} [object={}] The object to copy properties to.
 * @returns {Object} Returns `object`.
 */
function baseCopy(source, props, object) {
  object || (object = {});

  var index = -1,
      length = props.length;

  while (++index < length) {
    var key = props[index];
    object[key] = source[key];
  }
  return object;
}

module.exports = baseCopy;

},{}],31:[function(require,module,exports){
var baseForOwn = require('./baseForOwn'),
    createBaseEach = require('./createBaseEach');

/**
 * The base implementation of `_.forEach` without support for callback
 * shorthands and `this` binding.
 *
 * @private
 * @param {Array|Object|string} collection The collection to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array|Object|string} Returns `collection`.
 */
var baseEach = createBaseEach(baseForOwn);

module.exports = baseEach;

},{"./baseForOwn":35,"./createBaseEach":53}],32:[function(require,module,exports){
/**
 * The base implementation of `_.find`, `_.findLast`, `_.findKey`, and `_.findLastKey`,
 * without support for callback shorthands and `this` binding, which iterates
 * over `collection` using the provided `eachFunc`.
 *
 * @private
 * @param {Array|Object|string} collection The collection to search.
 * @param {Function} predicate The function invoked per iteration.
 * @param {Function} eachFunc The function to iterate over `collection`.
 * @param {boolean} [retKey] Specify returning the key of the found element
 *  instead of the element itself.
 * @returns {*} Returns the found element or its key, else `undefined`.
 */
function baseFind(collection, predicate, eachFunc, retKey) {
  var result;
  eachFunc(collection, function(value, key, collection) {
    if (predicate(value, key, collection)) {
      result = retKey ? key : value;
      return false;
    }
  });
  return result;
}

module.exports = baseFind;

},{}],33:[function(require,module,exports){
/**
 * The base implementation of `_.findIndex` and `_.findLastIndex` without
 * support for callback shorthands and `this` binding.
 *
 * @private
 * @param {Array} array The array to search.
 * @param {Function} predicate The function invoked per iteration.
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function baseFindIndex(array, predicate, fromRight) {
  var length = array.length,
      index = fromRight ? length : -1;

  while ((fromRight ? index-- : ++index < length)) {
    if (predicate(array[index], index, array)) {
      return index;
    }
  }
  return -1;
}

module.exports = baseFindIndex;

},{}],34:[function(require,module,exports){
var createBaseFor = require('./createBaseFor');

/**
 * The base implementation of `baseForIn` and `baseForOwn` which iterates
 * over `object` properties returned by `keysFunc` invoking `iteratee` for
 * each property. Iteratee functions may exit iteration early by explicitly
 * returning `false`.
 *
 * @private
 * @param {Object} object The object to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @returns {Object} Returns `object`.
 */
var baseFor = createBaseFor();

module.exports = baseFor;

},{"./createBaseFor":54}],35:[function(require,module,exports){
var baseFor = require('./baseFor'),
    keys = require('../object/keys');

/**
 * The base implementation of `_.forOwn` without support for callback
 * shorthands and `this` binding.
 *
 * @private
 * @param {Object} object The object to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Object} Returns `object`.
 */
function baseForOwn(object, iteratee) {
  return baseFor(object, iteratee, keys);
}

module.exports = baseForOwn;

},{"../object/keys":88,"./baseFor":34}],36:[function(require,module,exports){
var toObject = require('./toObject');

/**
 * The base implementation of `get` without support for string paths
 * and default values.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array} path The path of the property to get.
 * @param {string} [pathKey] The key representation of path.
 * @returns {*} Returns the resolved value.
 */
function baseGet(object, path, pathKey) {
  if (object == null) {
    return;
  }
  if (pathKey !== undefined && pathKey in toObject(object)) {
    path = [pathKey];
  }
  var index = 0,
      length = path.length;

  while (object != null && index < length) {
    object = object[path[index++]];
  }
  return (index && index == length) ? object : undefined;
}

module.exports = baseGet;

},{"./toObject":76}],37:[function(require,module,exports){
var indexOfNaN = require('./indexOfNaN');

/**
 * The base implementation of `_.indexOf` without support for binary searches.
 *
 * @private
 * @param {Array} array The array to search.
 * @param {*} value The value to search for.
 * @param {number} fromIndex The index to search from.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function baseIndexOf(array, value, fromIndex) {
  if (value !== value) {
    return indexOfNaN(array, fromIndex);
  }
  var index = fromIndex - 1,
      length = array.length;

  while (++index < length) {
    if (array[index] === value) {
      return index;
    }
  }
  return -1;
}

module.exports = baseIndexOf;

},{"./indexOfNaN":64}],38:[function(require,module,exports){
var baseIsEqualDeep = require('./baseIsEqualDeep'),
    isObject = require('../lang/isObject'),
    isObjectLike = require('./isObjectLike');

/**
 * The base implementation of `_.isEqual` without support for `this` binding
 * `customizer` functions.
 *
 * @private
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @param {Function} [customizer] The function to customize comparing values.
 * @param {boolean} [isLoose] Specify performing partial comparisons.
 * @param {Array} [stackA] Tracks traversed `value` objects.
 * @param {Array} [stackB] Tracks traversed `other` objects.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 */
function baseIsEqual(value, other, customizer, isLoose, stackA, stackB) {
  if (value === other) {
    return true;
  }
  if (value == null || other == null || (!isObject(value) && !isObjectLike(other))) {
    return value !== value && other !== other;
  }
  return baseIsEqualDeep(value, other, baseIsEqual, customizer, isLoose, stackA, stackB);
}

module.exports = baseIsEqual;

},{"../lang/isObject":83,"./baseIsEqualDeep":39,"./isObjectLike":73}],39:[function(require,module,exports){
var equalArrays = require('./equalArrays'),
    equalByTag = require('./equalByTag'),
    equalObjects = require('./equalObjects'),
    isArray = require('../lang/isArray'),
    isTypedArray = require('../lang/isTypedArray');

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    objectTag = '[object Object]';

/** Used for native method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 */
var objToString = objectProto.toString;

/**
 * A specialized version of `baseIsEqual` for arrays and objects which performs
 * deep comparisons and tracks traversed objects enabling objects with circular
 * references to be compared.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Function} [customizer] The function to customize comparing objects.
 * @param {boolean} [isLoose] Specify performing partial comparisons.
 * @param {Array} [stackA=[]] Tracks traversed `value` objects.
 * @param {Array} [stackB=[]] Tracks traversed `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function baseIsEqualDeep(object, other, equalFunc, customizer, isLoose, stackA, stackB) {
  var objIsArr = isArray(object),
      othIsArr = isArray(other),
      objTag = arrayTag,
      othTag = arrayTag;

  if (!objIsArr) {
    objTag = objToString.call(object);
    if (objTag == argsTag) {
      objTag = objectTag;
    } else if (objTag != objectTag) {
      objIsArr = isTypedArray(object);
    }
  }
  if (!othIsArr) {
    othTag = objToString.call(other);
    if (othTag == argsTag) {
      othTag = objectTag;
    } else if (othTag != objectTag) {
      othIsArr = isTypedArray(other);
    }
  }
  var objIsObj = objTag == objectTag,
      othIsObj = othTag == objectTag,
      isSameTag = objTag == othTag;

  if (isSameTag && !(objIsArr || objIsObj)) {
    return equalByTag(object, other, objTag);
  }
  if (!isLoose) {
    var objIsWrapped = objIsObj && hasOwnProperty.call(object, '__wrapped__'),
        othIsWrapped = othIsObj && hasOwnProperty.call(other, '__wrapped__');

    if (objIsWrapped || othIsWrapped) {
      return equalFunc(objIsWrapped ? object.value() : object, othIsWrapped ? other.value() : other, customizer, isLoose, stackA, stackB);
    }
  }
  if (!isSameTag) {
    return false;
  }
  // Assume cyclic values are equal.
  // For more information on detecting circular references see https://es5.github.io/#JO.
  stackA || (stackA = []);
  stackB || (stackB = []);

  var length = stackA.length;
  while (length--) {
    if (stackA[length] == object) {
      return stackB[length] == other;
    }
  }
  // Add `object` and `other` to the stack of traversed objects.
  stackA.push(object);
  stackB.push(other);

  var result = (objIsArr ? equalArrays : equalObjects)(object, other, equalFunc, customizer, isLoose, stackA, stackB);

  stackA.pop();
  stackB.pop();

  return result;
}

module.exports = baseIsEqualDeep;

},{"../lang/isArray":80,"../lang/isTypedArray":85,"./equalArrays":58,"./equalByTag":59,"./equalObjects":60}],40:[function(require,module,exports){
var baseIsEqual = require('./baseIsEqual'),
    toObject = require('./toObject');

/**
 * The base implementation of `_.isMatch` without support for callback
 * shorthands and `this` binding.
 *
 * @private
 * @param {Object} object The object to inspect.
 * @param {Array} matchData The propery names, values, and compare flags to match.
 * @param {Function} [customizer] The function to customize comparing objects.
 * @returns {boolean} Returns `true` if `object` is a match, else `false`.
 */
function baseIsMatch(object, matchData, customizer) {
  var index = matchData.length,
      length = index,
      noCustomizer = !customizer;

  if (object == null) {
    return !length;
  }
  object = toObject(object);
  while (index--) {
    var data = matchData[index];
    if ((noCustomizer && data[2])
          ? data[1] !== object[data[0]]
          : !(data[0] in object)
        ) {
      return false;
    }
  }
  while (++index < length) {
    data = matchData[index];
    var key = data[0],
        objValue = object[key],
        srcValue = data[1];

    if (noCustomizer && data[2]) {
      if (objValue === undefined && !(key in object)) {
        return false;
      }
    } else {
      var result = customizer ? customizer(objValue, srcValue, key) : undefined;
      if (!(result === undefined ? baseIsEqual(srcValue, objValue, customizer, true) : result)) {
        return false;
      }
    }
  }
  return true;
}

module.exports = baseIsMatch;

},{"./baseIsEqual":38,"./toObject":76}],41:[function(require,module,exports){
var baseEach = require('./baseEach'),
    isArrayLike = require('./isArrayLike');

/**
 * The base implementation of `_.map` without support for callback shorthands
 * and `this` binding.
 *
 * @private
 * @param {Array|Object|string} collection The collection to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the new mapped array.
 */
function baseMap(collection, iteratee) {
  var index = -1,
      result = isArrayLike(collection) ? Array(collection.length) : [];

  baseEach(collection, function(value, key, collection) {
    result[++index] = iteratee(value, key, collection);
  });
  return result;
}

module.exports = baseMap;

},{"./baseEach":31,"./isArrayLike":68}],42:[function(require,module,exports){
var baseIsMatch = require('./baseIsMatch'),
    getMatchData = require('./getMatchData'),
    toObject = require('./toObject');

/**
 * The base implementation of `_.matches` which does not clone `source`.
 *
 * @private
 * @param {Object} source The object of property values to match.
 * @returns {Function} Returns the new function.
 */
function baseMatches(source) {
  var matchData = getMatchData(source);
  if (matchData.length == 1 && matchData[0][2]) {
    var key = matchData[0][0],
        value = matchData[0][1];

    return function(object) {
      if (object == null) {
        return false;
      }
      return object[key] === value && (value !== undefined || (key in toObject(object)));
    };
  }
  return function(object) {
    return baseIsMatch(object, matchData);
  };
}

module.exports = baseMatches;

},{"./baseIsMatch":40,"./getMatchData":62,"./toObject":76}],43:[function(require,module,exports){
var baseGet = require('./baseGet'),
    baseIsEqual = require('./baseIsEqual'),
    baseSlice = require('./baseSlice'),
    isArray = require('../lang/isArray'),
    isKey = require('./isKey'),
    isStrictComparable = require('./isStrictComparable'),
    last = require('../array/last'),
    toObject = require('./toObject'),
    toPath = require('./toPath');

/**
 * The base implementation of `_.matchesProperty` which does not clone `srcValue`.
 *
 * @private
 * @param {string} path The path of the property to get.
 * @param {*} srcValue The value to compare.
 * @returns {Function} Returns the new function.
 */
function baseMatchesProperty(path, srcValue) {
  var isArr = isArray(path),
      isCommon = isKey(path) && isStrictComparable(srcValue),
      pathKey = (path + '');

  path = toPath(path);
  return function(object) {
    if (object == null) {
      return false;
    }
    var key = pathKey;
    object = toObject(object);
    if ((isArr || !isCommon) && !(key in object)) {
      object = path.length == 1 ? object : baseGet(object, baseSlice(path, 0, -1));
      if (object == null) {
        return false;
      }
      key = last(path);
      object = toObject(object);
    }
    return object[key] === srcValue
      ? (srcValue !== undefined || (key in object))
      : baseIsEqual(srcValue, object[key], undefined, true);
  };
}

module.exports = baseMatchesProperty;

},{"../array/last":14,"../lang/isArray":80,"./baseGet":36,"./baseIsEqual":38,"./baseSlice":46,"./isKey":71,"./isStrictComparable":74,"./toObject":76,"./toPath":77}],44:[function(require,module,exports){
/**
 * The base implementation of `_.property` without support for deep paths.
 *
 * @private
 * @param {string} key The key of the property to get.
 * @returns {Function} Returns the new function.
 */
function baseProperty(key) {
  return function(object) {
    return object == null ? undefined : object[key];
  };
}

module.exports = baseProperty;

},{}],45:[function(require,module,exports){
var baseGet = require('./baseGet'),
    toPath = require('./toPath');

/**
 * A specialized version of `baseProperty` which supports deep paths.
 *
 * @private
 * @param {Array|string} path The path of the property to get.
 * @returns {Function} Returns the new function.
 */
function basePropertyDeep(path) {
  var pathKey = (path + '');
  path = toPath(path);
  return function(object) {
    return baseGet(object, path, pathKey);
  };
}

module.exports = basePropertyDeep;

},{"./baseGet":36,"./toPath":77}],46:[function(require,module,exports){
/**
 * The base implementation of `_.slice` without an iteratee call guard.
 *
 * @private
 * @param {Array} array The array to slice.
 * @param {number} [start=0] The start position.
 * @param {number} [end=array.length] The end position.
 * @returns {Array} Returns the slice of `array`.
 */
function baseSlice(array, start, end) {
  var index = -1,
      length = array.length;

  start = start == null ? 0 : (+start || 0);
  if (start < 0) {
    start = -start > length ? 0 : (length + start);
  }
  end = (end === undefined || end > length) ? length : (+end || 0);
  if (end < 0) {
    end += length;
  }
  length = start > end ? 0 : ((end - start) >>> 0);
  start >>>= 0;

  var result = Array(length);
  while (++index < length) {
    result[index] = array[index + start];
  }
  return result;
}

module.exports = baseSlice;

},{}],47:[function(require,module,exports){
/**
 * The base implementation of `_.sortBy` which uses `comparer` to define
 * the sort order of `array` and replaces criteria objects with their
 * corresponding values.
 *
 * @private
 * @param {Array} array The array to sort.
 * @param {Function} comparer The function to define sort order.
 * @returns {Array} Returns `array`.
 */
function baseSortBy(array, comparer) {
  var length = array.length;

  array.sort(comparer);
  while (length--) {
    array[length] = array[length].value;
  }
  return array;
}

module.exports = baseSortBy;

},{}],48:[function(require,module,exports){
/**
 * Converts `value` to a string if it's not one. An empty string is returned
 * for `null` or `undefined` values.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 */
function baseToString(value) {
  return value == null ? '' : (value + '');
}

module.exports = baseToString;

},{}],49:[function(require,module,exports){
/**
 * The base implementation of `_.values` and `_.valuesIn` which creates an
 * array of `object` property values corresponding to the property names
 * of `props`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array} props The property names to get values for.
 * @returns {Object} Returns the array of property values.
 */
function baseValues(object, props) {
  var index = -1,
      length = props.length,
      result = Array(length);

  while (++index < length) {
    result[index] = object[props[index]];
  }
  return result;
}

module.exports = baseValues;

},{}],50:[function(require,module,exports){
var identity = require('../utility/identity');

/**
 * A specialized version of `baseCallback` which only supports `this` binding
 * and specifying the number of arguments to provide to `func`.
 *
 * @private
 * @param {Function} func The function to bind.
 * @param {*} thisArg The `this` binding of `func`.
 * @param {number} [argCount] The number of arguments to provide to `func`.
 * @returns {Function} Returns the callback.
 */
function bindCallback(func, thisArg, argCount) {
  if (typeof func != 'function') {
    return identity;
  }
  if (thisArg === undefined) {
    return func;
  }
  switch (argCount) {
    case 1: return function(value) {
      return func.call(thisArg, value);
    };
    case 3: return function(value, index, collection) {
      return func.call(thisArg, value, index, collection);
    };
    case 4: return function(accumulator, value, index, collection) {
      return func.call(thisArg, accumulator, value, index, collection);
    };
    case 5: return function(value, other, key, object, source) {
      return func.call(thisArg, value, other, key, object, source);
    };
  }
  return function() {
    return func.apply(thisArg, arguments);
  };
}

module.exports = bindCallback;

},{"../utility/identity":92}],51:[function(require,module,exports){
(function (global){
/** Native method references. */
var ArrayBuffer = global.ArrayBuffer,
    Uint8Array = global.Uint8Array;

/**
 * Creates a clone of the given array buffer.
 *
 * @private
 * @param {ArrayBuffer} buffer The array buffer to clone.
 * @returns {ArrayBuffer} Returns the cloned array buffer.
 */
function bufferClone(buffer) {
  var result = new ArrayBuffer(buffer.byteLength),
      view = new Uint8Array(result);

  view.set(new Uint8Array(buffer));
  return result;
}

module.exports = bufferClone;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],52:[function(require,module,exports){
var baseCompareAscending = require('./baseCompareAscending');

/**
 * Used by `_.sortBy` to compare transformed elements of a collection and stable
 * sort them in ascending order.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @returns {number} Returns the sort order indicator for `object`.
 */
function compareAscending(object, other) {
  return baseCompareAscending(object.criteria, other.criteria) || (object.index - other.index);
}

module.exports = compareAscending;

},{"./baseCompareAscending":29}],53:[function(require,module,exports){
var getLength = require('./getLength'),
    isLength = require('./isLength'),
    toObject = require('./toObject');

/**
 * Creates a `baseEach` or `baseEachRight` function.
 *
 * @private
 * @param {Function} eachFunc The function to iterate over a collection.
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Function} Returns the new base function.
 */
function createBaseEach(eachFunc, fromRight) {
  return function(collection, iteratee) {
    var length = collection ? getLength(collection) : 0;
    if (!isLength(length)) {
      return eachFunc(collection, iteratee);
    }
    var index = fromRight ? length : -1,
        iterable = toObject(collection);

    while ((fromRight ? index-- : ++index < length)) {
      if (iteratee(iterable[index], index, iterable) === false) {
        break;
      }
    }
    return collection;
  };
}

module.exports = createBaseEach;

},{"./getLength":61,"./isLength":72,"./toObject":76}],54:[function(require,module,exports){
var toObject = require('./toObject');

/**
 * Creates a base function for `_.forIn` or `_.forInRight`.
 *
 * @private
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Function} Returns the new base function.
 */
function createBaseFor(fromRight) {
  return function(object, iteratee, keysFunc) {
    var iterable = toObject(object),
        props = keysFunc(object),
        length = props.length,
        index = fromRight ? length : -1;

    while ((fromRight ? index-- : ++index < length)) {
      var key = props[index];
      if (iteratee(iterable[key], key, iterable) === false) {
        break;
      }
    }
    return object;
  };
}

module.exports = createBaseFor;

},{"./toObject":76}],55:[function(require,module,exports){
var baseCallback = require('./baseCallback'),
    baseFind = require('./baseFind'),
    baseFindIndex = require('./baseFindIndex'),
    isArray = require('../lang/isArray');

/**
 * Creates a `_.find` or `_.findLast` function.
 *
 * @private
 * @param {Function} eachFunc The function to iterate over a collection.
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Function} Returns the new find function.
 */
function createFind(eachFunc, fromRight) {
  return function(collection, predicate, thisArg) {
    predicate = baseCallback(predicate, thisArg, 3);
    if (isArray(collection)) {
      var index = baseFindIndex(collection, predicate, fromRight);
      return index > -1 ? collection[index] : undefined;
    }
    return baseFind(collection, predicate, eachFunc);
  };
}

module.exports = createFind;

},{"../lang/isArray":80,"./baseCallback":27,"./baseFind":32,"./baseFindIndex":33}],56:[function(require,module,exports){
var bindCallback = require('./bindCallback'),
    isArray = require('../lang/isArray');

/**
 * Creates a function for `_.forEach` or `_.forEachRight`.
 *
 * @private
 * @param {Function} arrayFunc The function to iterate over an array.
 * @param {Function} eachFunc The function to iterate over a collection.
 * @returns {Function} Returns the new each function.
 */
function createForEach(arrayFunc, eachFunc) {
  return function(collection, iteratee, thisArg) {
    return (typeof iteratee == 'function' && thisArg === undefined && isArray(collection))
      ? arrayFunc(collection, iteratee)
      : eachFunc(collection, bindCallback(iteratee, thisArg, 3));
  };
}

module.exports = createForEach;

},{"../lang/isArray":80,"./bindCallback":50}],57:[function(require,module,exports){
/** Native method references. */
var pow = Math.pow;

/**
 * Creates a `_.ceil`, `_.floor`, or `_.round` function.
 *
 * @private
 * @param {string} methodName The name of the `Math` method to use when rounding.
 * @returns {Function} Returns the new round function.
 */
function createRound(methodName) {
  var func = Math[methodName];
  return function(number, precision) {
    precision = precision === undefined ? 0 : (+precision || 0);
    if (precision) {
      precision = pow(10, precision);
      return func(number * precision) / precision;
    }
    return func(number);
  };
}

module.exports = createRound;

},{}],58:[function(require,module,exports){
var arraySome = require('./arraySome');

/**
 * A specialized version of `baseIsEqualDeep` for arrays with support for
 * partial deep comparisons.
 *
 * @private
 * @param {Array} array The array to compare.
 * @param {Array} other The other array to compare.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Function} [customizer] The function to customize comparing arrays.
 * @param {boolean} [isLoose] Specify performing partial comparisons.
 * @param {Array} [stackA] Tracks traversed `value` objects.
 * @param {Array} [stackB] Tracks traversed `other` objects.
 * @returns {boolean} Returns `true` if the arrays are equivalent, else `false`.
 */
function equalArrays(array, other, equalFunc, customizer, isLoose, stackA, stackB) {
  var index = -1,
      arrLength = array.length,
      othLength = other.length;

  if (arrLength != othLength && !(isLoose && othLength > arrLength)) {
    return false;
  }
  // Ignore non-index properties.
  while (++index < arrLength) {
    var arrValue = array[index],
        othValue = other[index],
        result = customizer ? customizer(isLoose ? othValue : arrValue, isLoose ? arrValue : othValue, index) : undefined;

    if (result !== undefined) {
      if (result) {
        continue;
      }
      return false;
    }
    // Recursively compare arrays (susceptible to call stack limits).
    if (isLoose) {
      if (!arraySome(other, function(othValue) {
            return arrValue === othValue || equalFunc(arrValue, othValue, customizer, isLoose, stackA, stackB);
          })) {
        return false;
      }
    } else if (!(arrValue === othValue || equalFunc(arrValue, othValue, customizer, isLoose, stackA, stackB))) {
      return false;
    }
  }
  return true;
}

module.exports = equalArrays;

},{"./arraySome":25}],59:[function(require,module,exports){
/** `Object#toString` result references. */
var boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    numberTag = '[object Number]',
    regexpTag = '[object RegExp]',
    stringTag = '[object String]';

/**
 * A specialized version of `baseIsEqualDeep` for comparing objects of
 * the same `toStringTag`.
 *
 * **Note:** This function only supports comparing values with tags of
 * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {string} tag The `toStringTag` of the objects to compare.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function equalByTag(object, other, tag) {
  switch (tag) {
    case boolTag:
    case dateTag:
      // Coerce dates and booleans to numbers, dates to milliseconds and booleans
      // to `1` or `0` treating invalid dates coerced to `NaN` as not equal.
      return +object == +other;

    case errorTag:
      return object.name == other.name && object.message == other.message;

    case numberTag:
      // Treat `NaN` vs. `NaN` as equal.
      return (object != +object)
        ? other != +other
        : object == +other;

    case regexpTag:
    case stringTag:
      // Coerce regexes to strings and treat strings primitives and string
      // objects as equal. See https://es5.github.io/#x15.10.6.4 for more details.
      return object == (other + '');
  }
  return false;
}

module.exports = equalByTag;

},{}],60:[function(require,module,exports){
var keys = require('../object/keys');

/** Used for native method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * A specialized version of `baseIsEqualDeep` for objects with support for
 * partial deep comparisons.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Function} [customizer] The function to customize comparing values.
 * @param {boolean} [isLoose] Specify performing partial comparisons.
 * @param {Array} [stackA] Tracks traversed `value` objects.
 * @param {Array} [stackB] Tracks traversed `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function equalObjects(object, other, equalFunc, customizer, isLoose, stackA, stackB) {
  var objProps = keys(object),
      objLength = objProps.length,
      othProps = keys(other),
      othLength = othProps.length;

  if (objLength != othLength && !isLoose) {
    return false;
  }
  var index = objLength;
  while (index--) {
    var key = objProps[index];
    if (!(isLoose ? key in other : hasOwnProperty.call(other, key))) {
      return false;
    }
  }
  var skipCtor = isLoose;
  while (++index < objLength) {
    key = objProps[index];
    var objValue = object[key],
        othValue = other[key],
        result = customizer ? customizer(isLoose ? othValue : objValue, isLoose? objValue : othValue, key) : undefined;

    // Recursively compare objects (susceptible to call stack limits).
    if (!(result === undefined ? equalFunc(objValue, othValue, customizer, isLoose, stackA, stackB) : result)) {
      return false;
    }
    skipCtor || (skipCtor = key == 'constructor');
  }
  if (!skipCtor) {
    var objCtor = object.constructor,
        othCtor = other.constructor;

    // Non `Object` object instances with different constructors are not equal.
    if (objCtor != othCtor &&
        ('constructor' in object && 'constructor' in other) &&
        !(typeof objCtor == 'function' && objCtor instanceof objCtor &&
          typeof othCtor == 'function' && othCtor instanceof othCtor)) {
      return false;
    }
  }
  return true;
}

module.exports = equalObjects;

},{"../object/keys":88}],61:[function(require,module,exports){
var baseProperty = require('./baseProperty');

/**
 * Gets the "length" property value of `object`.
 *
 * **Note:** This function is used to avoid a [JIT bug](https://bugs.webkit.org/show_bug.cgi?id=142792)
 * that affects Safari on at least iOS 8.1-8.3 ARM64.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {*} Returns the "length" value.
 */
var getLength = baseProperty('length');

module.exports = getLength;

},{"./baseProperty":44}],62:[function(require,module,exports){
var isStrictComparable = require('./isStrictComparable'),
    pairs = require('../object/pairs');

/**
 * Gets the propery names, values, and compare flags of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the match data of `object`.
 */
function getMatchData(object) {
  var result = pairs(object),
      length = result.length;

  while (length--) {
    result[length][2] = isStrictComparable(result[length][1]);
  }
  return result;
}

module.exports = getMatchData;

},{"../object/pairs":90,"./isStrictComparable":74}],63:[function(require,module,exports){
var isNative = require('../lang/isNative');

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = object == null ? undefined : object[key];
  return isNative(value) ? value : undefined;
}

module.exports = getNative;

},{"../lang/isNative":82}],64:[function(require,module,exports){
/**
 * Gets the index at which the first occurrence of `NaN` is found in `array`.
 *
 * @private
 * @param {Array} array The array to search.
 * @param {number} fromIndex The index to search from.
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {number} Returns the index of the matched `NaN`, else `-1`.
 */
function indexOfNaN(array, fromIndex, fromRight) {
  var length = array.length,
      index = fromIndex + (fromRight ? 0 : -1);

  while ((fromRight ? index-- : ++index < length)) {
    var other = array[index];
    if (other !== other) {
      return index;
    }
  }
  return -1;
}

module.exports = indexOfNaN;

},{}],65:[function(require,module,exports){
/** Used for native method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Initializes an array clone.
 *
 * @private
 * @param {Array} array The array to clone.
 * @returns {Array} Returns the initialized clone.
 */
function initCloneArray(array) {
  var length = array.length,
      result = new array.constructor(length);

  // Add array properties assigned by `RegExp#exec`.
  if (length && typeof array[0] == 'string' && hasOwnProperty.call(array, 'index')) {
    result.index = array.index;
    result.input = array.input;
  }
  return result;
}

module.exports = initCloneArray;

},{}],66:[function(require,module,exports){
var bufferClone = require('./bufferClone');

/** `Object#toString` result references. */
var boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    numberTag = '[object Number]',
    regexpTag = '[object RegExp]',
    stringTag = '[object String]';

var arrayBufferTag = '[object ArrayBuffer]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/** Used to match `RegExp` flags from their coerced string values. */
var reFlags = /\w*$/;

/**
 * Initializes an object clone based on its `toStringTag`.
 *
 * **Note:** This function only supports cloning values with tags of
 * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
 *
 * @private
 * @param {Object} object The object to clone.
 * @param {string} tag The `toStringTag` of the object to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the initialized clone.
 */
function initCloneByTag(object, tag, isDeep) {
  var Ctor = object.constructor;
  switch (tag) {
    case arrayBufferTag:
      return bufferClone(object);

    case boolTag:
    case dateTag:
      return new Ctor(+object);

    case float32Tag: case float64Tag:
    case int8Tag: case int16Tag: case int32Tag:
    case uint8Tag: case uint8ClampedTag: case uint16Tag: case uint32Tag:
      var buffer = object.buffer;
      return new Ctor(isDeep ? bufferClone(buffer) : buffer, object.byteOffset, object.length);

    case numberTag:
    case stringTag:
      return new Ctor(object);

    case regexpTag:
      var result = new Ctor(object.source, reFlags.exec(object));
      result.lastIndex = object.lastIndex;
  }
  return result;
}

module.exports = initCloneByTag;

},{"./bufferClone":51}],67:[function(require,module,exports){
/**
 * Initializes an object clone.
 *
 * @private
 * @param {Object} object The object to clone.
 * @returns {Object} Returns the initialized clone.
 */
function initCloneObject(object) {
  var Ctor = object.constructor;
  if (!(typeof Ctor == 'function' && Ctor instanceof Ctor)) {
    Ctor = Object;
  }
  return new Ctor;
}

module.exports = initCloneObject;

},{}],68:[function(require,module,exports){
var getLength = require('./getLength'),
    isLength = require('./isLength');

/**
 * Checks if `value` is array-like.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 */
function isArrayLike(value) {
  return value != null && isLength(getLength(value));
}

module.exports = isArrayLike;

},{"./getLength":61,"./isLength":72}],69:[function(require,module,exports){
/** Used to detect unsigned integer values. */
var reIsUint = /^\d+$/;

/**
 * Used as the [maximum length](http://ecma-international.org/ecma-262/6.0/#sec-number.max_safe_integer)
 * of an array-like value.
 */
var MAX_SAFE_INTEGER = 9007199254740991;

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  value = (typeof value == 'number' || reIsUint.test(value)) ? +value : -1;
  length = length == null ? MAX_SAFE_INTEGER : length;
  return value > -1 && value % 1 == 0 && value < length;
}

module.exports = isIndex;

},{}],70:[function(require,module,exports){
var isArrayLike = require('./isArrayLike'),
    isIndex = require('./isIndex'),
    isObject = require('../lang/isObject');

/**
 * Checks if the provided arguments are from an iteratee call.
 *
 * @private
 * @param {*} value The potential iteratee value argument.
 * @param {*} index The potential iteratee index or key argument.
 * @param {*} object The potential iteratee object argument.
 * @returns {boolean} Returns `true` if the arguments are from an iteratee call, else `false`.
 */
function isIterateeCall(value, index, object) {
  if (!isObject(object)) {
    return false;
  }
  var type = typeof index;
  if (type == 'number'
      ? (isArrayLike(object) && isIndex(index, object.length))
      : (type == 'string' && index in object)) {
    var other = object[index];
    return value === value ? (value === other) : (other !== other);
  }
  return false;
}

module.exports = isIterateeCall;

},{"../lang/isObject":83,"./isArrayLike":68,"./isIndex":69}],71:[function(require,module,exports){
var isArray = require('../lang/isArray'),
    toObject = require('./toObject');

/** Used to match property names within property paths. */
var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\n\\]|\\.)*?\1)\]/,
    reIsPlainProp = /^\w*$/;

/**
 * Checks if `value` is a property name and not a property path.
 *
 * @private
 * @param {*} value The value to check.
 * @param {Object} [object] The object to query keys on.
 * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
 */
function isKey(value, object) {
  var type = typeof value;
  if ((type == 'string' && reIsPlainProp.test(value)) || type == 'number') {
    return true;
  }
  if (isArray(value)) {
    return false;
  }
  var result = !reIsDeepProp.test(value);
  return result || (object != null && value in toObject(object));
}

module.exports = isKey;

},{"../lang/isArray":80,"./toObject":76}],72:[function(require,module,exports){
/**
 * Used as the [maximum length](http://ecma-international.org/ecma-262/6.0/#sec-number.max_safe_integer)
 * of an array-like value.
 */
var MAX_SAFE_INTEGER = 9007199254740991;

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This function is based on [`ToLength`](http://ecma-international.org/ecma-262/6.0/#sec-tolength).
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 */
function isLength(value) {
  return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

module.exports = isLength;

},{}],73:[function(require,module,exports){
/**
 * Checks if `value` is object-like.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

module.exports = isObjectLike;

},{}],74:[function(require,module,exports){
var isObject = require('../lang/isObject');

/**
 * Checks if `value` is suitable for strict equality comparisons, i.e. `===`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` if suitable for strict
 *  equality comparisons, else `false`.
 */
function isStrictComparable(value) {
  return value === value && !isObject(value);
}

module.exports = isStrictComparable;

},{"../lang/isObject":83}],75:[function(require,module,exports){
var isArguments = require('../lang/isArguments'),
    isArray = require('../lang/isArray'),
    isIndex = require('./isIndex'),
    isLength = require('./isLength'),
    keysIn = require('../object/keysIn');

/** Used for native method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * A fallback implementation of `Object.keys` which creates an array of the
 * own enumerable property names of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function shimKeys(object) {
  var props = keysIn(object),
      propsLength = props.length,
      length = propsLength && object.length;

  var allowIndexes = !!length && isLength(length) &&
    (isArray(object) || isArguments(object));

  var index = -1,
      result = [];

  while (++index < propsLength) {
    var key = props[index];
    if ((allowIndexes && isIndex(key, length)) || hasOwnProperty.call(object, key)) {
      result.push(key);
    }
  }
  return result;
}

module.exports = shimKeys;

},{"../lang/isArguments":79,"../lang/isArray":80,"../object/keysIn":89,"./isIndex":69,"./isLength":72}],76:[function(require,module,exports){
var isObject = require('../lang/isObject');

/**
 * Converts `value` to an object if it's not one.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {Object} Returns the object.
 */
function toObject(value) {
  return isObject(value) ? value : Object(value);
}

module.exports = toObject;

},{"../lang/isObject":83}],77:[function(require,module,exports){
var baseToString = require('./baseToString'),
    isArray = require('../lang/isArray');

/** Used to match property names within property paths. */
var rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\n\\]|\\.)*?)\2)\]/g;

/** Used to match backslashes in property paths. */
var reEscapeChar = /\\(\\)?/g;

/**
 * Converts `value` to property path array if it's not one.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {Array} Returns the property path array.
 */
function toPath(value) {
  if (isArray(value)) {
    return value;
  }
  var result = [];
  baseToString(value).replace(rePropName, function(match, number, quote, string) {
    result.push(quote ? string.replace(reEscapeChar, '$1') : (number || match));
  });
  return result;
}

module.exports = toPath;

},{"../lang/isArray":80,"./baseToString":48}],78:[function(require,module,exports){
var baseClone = require('../internal/baseClone'),
    bindCallback = require('../internal/bindCallback'),
    isIterateeCall = require('../internal/isIterateeCall');

/**
 * Creates a clone of `value`. If `isDeep` is `true` nested objects are cloned,
 * otherwise they are assigned by reference. If `customizer` is provided it's
 * invoked to produce the cloned values. If `customizer` returns `undefined`
 * cloning is handled by the method instead. The `customizer` is bound to
 * `thisArg` and invoked with up to three argument; (value [, index|key, object]).
 *
 * **Note:** This method is loosely based on the
 * [structured clone algorithm](http://www.w3.org/TR/html5/infrastructure.html#internal-structured-cloning-algorithm).
 * The enumerable properties of `arguments` objects and objects created by
 * constructors other than `Object` are cloned to plain `Object` objects. An
 * empty object is returned for uncloneable values such as functions, DOM nodes,
 * Maps, Sets, and WeakMaps.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @param {Function} [customizer] The function to customize cloning values.
 * @param {*} [thisArg] The `this` binding of `customizer`.
 * @returns {*} Returns the cloned value.
 * @example
 *
 * var users = [
 *   { 'user': 'barney' },
 *   { 'user': 'fred' }
 * ];
 *
 * var shallow = _.clone(users);
 * shallow[0] === users[0];
 * // => true
 *
 * var deep = _.clone(users, true);
 * deep[0] === users[0];
 * // => false
 *
 * // using a customizer callback
 * var el = _.clone(document.body, function(value) {
 *   if (_.isElement(value)) {
 *     return value.cloneNode(false);
 *   }
 * });
 *
 * el === document.body
 * // => false
 * el.nodeName
 * // => BODY
 * el.childNodes.length;
 * // => 0
 */
function clone(value, isDeep, customizer, thisArg) {
  if (isDeep && typeof isDeep != 'boolean' && isIterateeCall(value, isDeep, customizer)) {
    isDeep = false;
  }
  else if (typeof isDeep == 'function') {
    thisArg = customizer;
    customizer = isDeep;
    isDeep = false;
  }
  return typeof customizer == 'function'
    ? baseClone(value, isDeep, bindCallback(customizer, thisArg, 3))
    : baseClone(value, isDeep);
}

module.exports = clone;

},{"../internal/baseClone":28,"../internal/bindCallback":50,"../internal/isIterateeCall":70}],79:[function(require,module,exports){
var isArrayLike = require('../internal/isArrayLike'),
    isObjectLike = require('../internal/isObjectLike');

/** Used for native method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Native method references. */
var propertyIsEnumerable = objectProto.propertyIsEnumerable;

/**
 * Checks if `value` is classified as an `arguments` object.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
function isArguments(value) {
  return isObjectLike(value) && isArrayLike(value) &&
    hasOwnProperty.call(value, 'callee') && !propertyIsEnumerable.call(value, 'callee');
}

module.exports = isArguments;

},{"../internal/isArrayLike":68,"../internal/isObjectLike":73}],80:[function(require,module,exports){
var getNative = require('../internal/getNative'),
    isLength = require('../internal/isLength'),
    isObjectLike = require('../internal/isObjectLike');

/** `Object#toString` result references. */
var arrayTag = '[object Array]';

/** Used for native method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 */
var objToString = objectProto.toString;

/* Native method references for those with the same name as other `lodash` methods. */
var nativeIsArray = getNative(Array, 'isArray');

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(function() { return arguments; }());
 * // => false
 */
var isArray = nativeIsArray || function(value) {
  return isObjectLike(value) && isLength(value.length) && objToString.call(value) == arrayTag;
};

module.exports = isArray;

},{"../internal/getNative":63,"../internal/isLength":72,"../internal/isObjectLike":73}],81:[function(require,module,exports){
var isObject = require('./isObject');

/** `Object#toString` result references. */
var funcTag = '[object Function]';

/** Used for native method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 */
var objToString = objectProto.toString;

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in older versions of Chrome and Safari which return 'function' for regexes
  // and Safari 8 which returns 'object' for typed array constructors.
  return isObject(value) && objToString.call(value) == funcTag;
}

module.exports = isFunction;

},{"./isObject":83}],82:[function(require,module,exports){
var isFunction = require('./isFunction'),
    isObjectLike = require('../internal/isObjectLike');

/** Used to detect host constructors (Safari > 5). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Used for native method references. */
var objectProto = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var fnToString = Function.prototype.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  fnToString.call(hasOwnProperty).replace(/[\\^$.*+?()[\]{}|]/g, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/**
 * Checks if `value` is a native function.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function, else `false`.
 * @example
 *
 * _.isNative(Array.prototype.push);
 * // => true
 *
 * _.isNative(_);
 * // => false
 */
function isNative(value) {
  if (value == null) {
    return false;
  }
  if (isFunction(value)) {
    return reIsNative.test(fnToString.call(value));
  }
  return isObjectLike(value) && reIsHostCtor.test(value);
}

module.exports = isNative;

},{"../internal/isObjectLike":73,"./isFunction":81}],83:[function(require,module,exports){
/**
 * Checks if `value` is the [language type](https://es5.github.io/#x8) of `Object`.
 * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(1);
 * // => false
 */
function isObject(value) {
  // Avoid a V8 JIT bug in Chrome 19-20.
  // See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

module.exports = isObject;

},{}],84:[function(require,module,exports){
var isObjectLike = require('../internal/isObjectLike');

/** `Object#toString` result references. */
var stringTag = '[object String]';

/** Used for native method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 */
var objToString = objectProto.toString;

/**
 * Checks if `value` is classified as a `String` primitive or object.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
 * @example
 *
 * _.isString('abc');
 * // => true
 *
 * _.isString(1);
 * // => false
 */
function isString(value) {
  return typeof value == 'string' || (isObjectLike(value) && objToString.call(value) == stringTag);
}

module.exports = isString;

},{"../internal/isObjectLike":73}],85:[function(require,module,exports){
var isLength = require('../internal/isLength'),
    isObjectLike = require('../internal/isObjectLike');

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    funcTag = '[object Function]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    objectTag = '[object Object]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    weakMapTag = '[object WeakMap]';

var arrayBufferTag = '[object ArrayBuffer]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/** Used to identify `toStringTag` values of typed arrays. */
var typedArrayTags = {};
typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
typedArrayTags[uint32Tag] = true;
typedArrayTags[argsTag] = typedArrayTags[arrayTag] =
typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
typedArrayTags[dateTag] = typedArrayTags[errorTag] =
typedArrayTags[funcTag] = typedArrayTags[mapTag] =
typedArrayTags[numberTag] = typedArrayTags[objectTag] =
typedArrayTags[regexpTag] = typedArrayTags[setTag] =
typedArrayTags[stringTag] = typedArrayTags[weakMapTag] = false;

/** Used for native method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 */
var objToString = objectProto.toString;

/**
 * Checks if `value` is classified as a typed array.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
 * @example
 *
 * _.isTypedArray(new Uint8Array);
 * // => true
 *
 * _.isTypedArray([]);
 * // => false
 */
function isTypedArray(value) {
  return isObjectLike(value) && isLength(value.length) && !!typedArrayTags[objToString.call(value)];
}

module.exports = isTypedArray;

},{"../internal/isLength":72,"../internal/isObjectLike":73}],86:[function(require,module,exports){
var createRound = require('../internal/createRound');

/**
 * Calculates `n` rounded to `precision`.
 *
 * @static
 * @memberOf _
 * @category Math
 * @param {number} n The number to round.
 * @param {number} [precision=0] The precision to round to.
 * @returns {number} Returns the rounded number.
 * @example
 *
 * _.round(4.006);
 * // => 4
 *
 * _.round(4.006, 2);
 * // => 4.01
 *
 * _.round(4060, -2);
 * // => 4100
 */
var round = createRound('round');

module.exports = round;

},{"../internal/createRound":57}],87:[function(require,module,exports){
var baseGet = require('../internal/baseGet'),
    toPath = require('../internal/toPath');

/**
 * Gets the property value at `path` of `object`. If the resolved value is
 * `undefined` the `defaultValue` is used in its place.
 *
 * @static
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to get.
 * @param {*} [defaultValue] The value returned if the resolved value is `undefined`.
 * @returns {*} Returns the resolved value.
 * @example
 *
 * var object = { 'a': [{ 'b': { 'c': 3 } }] };
 *
 * _.get(object, 'a[0].b.c');
 * // => 3
 *
 * _.get(object, ['a', '0', 'b', 'c']);
 * // => 3
 *
 * _.get(object, 'a.b.c', 'default');
 * // => 'default'
 */
function get(object, path, defaultValue) {
  var result = object == null ? undefined : baseGet(object, toPath(path), (path + ''));
  return result === undefined ? defaultValue : result;
}

module.exports = get;

},{"../internal/baseGet":36,"../internal/toPath":77}],88:[function(require,module,exports){
var getNative = require('../internal/getNative'),
    isArrayLike = require('../internal/isArrayLike'),
    isObject = require('../lang/isObject'),
    shimKeys = require('../internal/shimKeys');

/* Native method references for those with the same name as other `lodash` methods. */
var nativeKeys = getNative(Object, 'keys');

/**
 * Creates an array of the own enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects. See the
 * [ES spec](http://ecma-international.org/ecma-262/6.0/#sec-object.keys)
 * for more details.
 *
 * @static
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keys(new Foo);
 * // => ['a', 'b'] (iteration order is not guaranteed)
 *
 * _.keys('hi');
 * // => ['0', '1']
 */
var keys = !nativeKeys ? shimKeys : function(object) {
  var Ctor = object == null ? undefined : object.constructor;
  if ((typeof Ctor == 'function' && Ctor.prototype === object) ||
      (typeof object != 'function' && isArrayLike(object))) {
    return shimKeys(object);
  }
  return isObject(object) ? nativeKeys(object) : [];
};

module.exports = keys;

},{"../internal/getNative":63,"../internal/isArrayLike":68,"../internal/shimKeys":75,"../lang/isObject":83}],89:[function(require,module,exports){
var isArguments = require('../lang/isArguments'),
    isArray = require('../lang/isArray'),
    isIndex = require('../internal/isIndex'),
    isLength = require('../internal/isLength'),
    isObject = require('../lang/isObject');

/** Used for native method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Creates an array of the own and inherited enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects.
 *
 * @static
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keysIn(new Foo);
 * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
 */
function keysIn(object) {
  if (object == null) {
    return [];
  }
  if (!isObject(object)) {
    object = Object(object);
  }
  var length = object.length;
  length = (length && isLength(length) &&
    (isArray(object) || isArguments(object)) && length) || 0;

  var Ctor = object.constructor,
      index = -1,
      isProto = typeof Ctor == 'function' && Ctor.prototype === object,
      result = Array(length),
      skipIndexes = length > 0;

  while (++index < length) {
    result[index] = (index + '');
  }
  for (var key in object) {
    if (!(skipIndexes && isIndex(key, length)) &&
        !(key == 'constructor' && (isProto || !hasOwnProperty.call(object, key)))) {
      result.push(key);
    }
  }
  return result;
}

module.exports = keysIn;

},{"../internal/isIndex":69,"../internal/isLength":72,"../lang/isArguments":79,"../lang/isArray":80,"../lang/isObject":83}],90:[function(require,module,exports){
var keys = require('./keys'),
    toObject = require('../internal/toObject');

/**
 * Creates a two dimensional array of the key-value pairs for `object`,
 * e.g. `[[key1, value1], [key2, value2]]`.
 *
 * @static
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the new array of key-value pairs.
 * @example
 *
 * _.pairs({ 'barney': 36, 'fred': 40 });
 * // => [['barney', 36], ['fred', 40]] (iteration order is not guaranteed)
 */
function pairs(object) {
  object = toObject(object);

  var index = -1,
      props = keys(object),
      length = props.length,
      result = Array(length);

  while (++index < length) {
    var key = props[index];
    result[index] = [key, object[key]];
  }
  return result;
}

module.exports = pairs;

},{"../internal/toObject":76,"./keys":88}],91:[function(require,module,exports){
var baseValues = require('../internal/baseValues'),
    keys = require('./keys');

/**
 * Creates an array of the own enumerable property values of `object`.
 *
 * **Note:** Non-object values are coerced to objects.
 *
 * @static
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property values.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.values(new Foo);
 * // => [1, 2] (iteration order is not guaranteed)
 *
 * _.values('hi');
 * // => ['h', 'i']
 */
function values(object) {
  return baseValues(object, keys(object));
}

module.exports = values;

},{"../internal/baseValues":49,"./keys":88}],92:[function(require,module,exports){
/**
 * This method returns the first argument provided to it.
 *
 * @static
 * @memberOf _
 * @category Utility
 * @param {*} value Any value.
 * @returns {*} Returns `value`.
 * @example
 *
 * var object = { 'user': 'fred' };
 *
 * _.identity(object) === object;
 * // => true
 */
function identity(value) {
  return value;
}

module.exports = identity;

},{}],93:[function(require,module,exports){
var baseProperty = require('../internal/baseProperty'),
    basePropertyDeep = require('../internal/basePropertyDeep'),
    isKey = require('../internal/isKey');

/**
 * Creates a function that returns the property value at `path` on a
 * given object.
 *
 * @static
 * @memberOf _
 * @category Utility
 * @param {Array|string} path The path of the property to get.
 * @returns {Function} Returns the new function.
 * @example
 *
 * var objects = [
 *   { 'a': { 'b': { 'c': 2 } } },
 *   { 'a': { 'b': { 'c': 1 } } }
 * ];
 *
 * _.map(objects, _.property('a.b.c'));
 * // => [2, 1]
 *
 * _.pluck(_.sortBy(objects, _.property(['a', 'b', 'c'])), 'a.b.c');
 * // => [1, 2]
 */
function property(path) {
  return isKey(path) ? baseProperty(path) : basePropertyDeep(path);
}

module.exports = property;

},{"../internal/baseProperty":44,"../internal/basePropertyDeep":45,"../internal/isKey":71}],94:[function(require,module,exports){
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

},{}],95:[function(require,module,exports){
exports.remove = removeDiacritics;

var replacementList = [
  {
    base: ' ',
    chars: "\u00A0",
  }, {
    base: '0',
    chars: "\u07C0",
  }, {
    base: 'A',
    chars: "\u24B6\uFF21\u00C0\u00C1\u00C2\u1EA6\u1EA4\u1EAA\u1EA8\u00C3\u0100\u0102\u1EB0\u1EAE\u1EB4\u1EB2\u0226\u01E0\u00C4\u01DE\u1EA2\u00C5\u01FA\u01CD\u0200\u0202\u1EA0\u1EAC\u1EB6\u1E00\u0104\u023A\u2C6F",
  }, {
    base: 'AA',
    chars: "\uA732",
  }, {
    base: 'AE',
    chars: "\u00C6\u01FC\u01E2",
  }, {
    base: 'AO',
    chars: "\uA734",
  }, {
    base: 'AU',
    chars: "\uA736",
  }, {
    base: 'AV',
    chars: "\uA738\uA73A",
  }, {
    base: 'AY',
    chars: "\uA73C",
  }, {
    base: 'B',
    chars: "\u24B7\uFF22\u1E02\u1E04\u1E06\u0243\u0181",
  }, {
    base: 'C',
    chars: "\uFF43\u24b8\uff23\uA73E\u1E08\u0106",
  }, {
    base: 'D',
    chars: "\u24B9\uFF24\u1E0A\u010E\u1E0C\u1E10\u1E12\u1E0E\u0110\u018A\u0189\u1D05\uA779",
  }, {
    base: 'Dh',
    chars: "\u00D0",
  }, {
    base: 'DZ',
    chars: "\u01F1\u01C4",
  }, {
    base: 'Dz',
    chars: "\u01F2\u01C5",
  }, {
    base: 'E',
    chars: "\u025B\u24BA\uFF25\u00C8\u00C9\u00CA\u1EC0\u1EBE\u1EC4\u1EC2\u1EBC\u0112\u1E14\u1E16\u0114\u0116\u00CB\u1EBA\u011A\u0204\u0206\u1EB8\u1EC6\u0228\u1E1C\u0118\u1E18\u1E1A\u0190\u018E\u1D07",
  }, {
    base: 'F',
    chars: "\uA77C\u24BB\uFF26\u1E1E\u0191\uA77B",
  }, {
    base: 'G',
    chars: "\u24BC\uFF27\u01F4\u011C\u1E20\u011E\u0120\u01E6\u0122\u01E4\u0193\uA7A0\uA77D\uA77E\u0262",
  }, {
    base: 'H',
    chars: "\u24BD\uFF28\u0124\u1E22\u1E26\u021E\u1E24\u1E28\u1E2A\u0126\u2C67\u2C75\uA78D",
  }, {
    base: 'I',
    chars: "\u24BE\uFF29\xCC\xCD\xCE\u0128\u012A\u012C\u0130\xCF\u1E2E\u1EC8\u01CF\u0208\u020A\u1ECA\u012E\u1E2C\u0197",
  }, {
    base: 'J',
    chars: "\u24BF\uFF2A\u0134\u0248\u0237",
  }, {
    base: 'K',
    chars: "\u24C0\uFF2B\u1E30\u01E8\u1E32\u0136\u1E34\u0198\u2C69\uA740\uA742\uA744\uA7A2",
  }, {
    base: 'L',
    chars: "\u24C1\uFF2C\u013F\u0139\u013D\u1E36\u1E38\u013B\u1E3C\u1E3A\u0141\u023D\u2C62\u2C60\uA748\uA746\uA780",
  }, {
    base: 'LJ',
    chars: "\u01C7",
  }, {
    base: 'Lj',
    chars: "\u01C8",
  }, {
    base: 'M',
    chars: "\u24C2\uFF2D\u1E3E\u1E40\u1E42\u2C6E\u019C\u03FB",
  }, {
    base: 'N',
    chars: "\uA7A4\u0220\u24C3\uFF2E\u01F8\u0143\xD1\u1E44\u0147\u1E46\u0145\u1E4A\u1E48\u019D\uA790\u1D0E",
  }, {
    base: 'NJ',
    chars: "\u01CA",
  }, {
    base: 'Nj',
    chars: "\u01CB",
  }, {
    base: 'O',
    chars: "\u24C4\uFF2F\xD2\xD3\xD4\u1ED2\u1ED0\u1ED6\u1ED4\xD5\u1E4C\u022C\u1E4E\u014C\u1E50\u1E52\u014E\u022E\u0230\xD6\u022A\u1ECE\u0150\u01D1\u020C\u020E\u01A0\u1EDC\u1EDA\u1EE0\u1EDE\u1EE2\u1ECC\u1ED8\u01EA\u01EC\xD8\u01FE\u0186\u019F\uA74A\uA74C",
  }, {
    base: 'OE',
    chars: "\u0152",
  }, {
    base: 'OI',
    chars: "\u01A2",
  }, {
    base: 'OO',
    chars: "\uA74E",
  }, {
    base: 'OU',
    chars: "\u0222",
  }, {
    base: 'P',
    chars: "\u24C5\uFF30\u1E54\u1E56\u01A4\u2C63\uA750\uA752\uA754",
  }, {
    base: 'Q',
    chars: "\u24C6\uFF31\uA756\uA758\u024A",
  }, {
    base: 'R',
    chars: "\u24C7\uFF32\u0154\u1E58\u0158\u0210\u0212\u1E5A\u1E5C\u0156\u1E5E\u024C\u2C64\uA75A\uA7A6\uA782",
  }, {
    base: 'S',
    chars: "\u24C8\uFF33\u1E9E\u015A\u1E64\u015C\u1E60\u0160\u1E66\u1E62\u1E68\u0218\u015E\u2C7E\uA7A8\uA784",
  }, {
    base: 'T',
    chars: "\u24C9\uFF34\u1E6A\u0164\u1E6C\u021A\u0162\u1E70\u1E6E\u0166\u01AC\u01AE\u023E\uA786",
  }, {
    base: 'Th',
    chars: "\u00DE",
  }, {
    base: 'TZ',
    chars: "\uA728",
  }, {
    base: 'U',
    chars: "\u24CA\uFF35\xD9\xDA\xDB\u0168\u1E78\u016A\u1E7A\u016C\xDC\u01DB\u01D7\u01D5\u01D9\u1EE6\u016E\u0170\u01D3\u0214\u0216\u01AF\u1EEA\u1EE8\u1EEE\u1EEC\u1EF0\u1EE4\u1E72\u0172\u1E76\u1E74\u0244",
  }, {
    base: 'V',
    chars: "\u24CB\uFF36\u1E7C\u1E7E\u01B2\uA75E\u0245",
  }, {
    base: 'VY',
    chars: "\uA760",
  }, {
    base: 'W',
    chars: "\u24CC\uFF37\u1E80\u1E82\u0174\u1E86\u1E84\u1E88\u2C72",
  }, {
    base: 'X',
    chars: "\u24CD\uFF38\u1E8A\u1E8C",
  }, {
    base: 'Y',
    chars: "\u24CE\uFF39\u1EF2\xDD\u0176\u1EF8\u0232\u1E8E\u0178\u1EF6\u1EF4\u01B3\u024E\u1EFE",
  }, {
    base: 'Z',
    chars: "\u24CF\uFF3A\u0179\u1E90\u017B\u017D\u1E92\u1E94\u01B5\u0224\u2C7F\u2C6B\uA762",
  }, {
    base: 'a',
    chars: "\u24D0\uFF41\u1E9A\u00E0\u00E1\u00E2\u1EA7\u1EA5\u1EAB\u1EA9\u00E3\u0101\u0103\u1EB1\u1EAF\u1EB5\u1EB3\u0227\u01E1\u00E4\u01DF\u1EA3\u00E5\u01FB\u01CE\u0201\u0203\u1EA1\u1EAD\u1EB7\u1E01\u0105\u2C65\u0250\u0251",
  }, {
    base: 'aa',
    chars: "\uA733",
  }, {
    base: 'ae',
    chars: "\u00E6\u01FD\u01E3",
  }, {
    base: 'ao',
    chars: "\uA735",
  }, {
    base: 'au',
    chars: "\uA737",
  }, {
    base: 'av',
    chars: "\uA739\uA73B",
  }, {
    base: 'ay',
    chars: "\uA73D",
  }, {
    base: 'b',
    chars: "\u24D1\uFF42\u1E03\u1E05\u1E07\u0180\u0183\u0253\u0182",
  }, {
    base: 'c',
    chars: "\u24D2\u0107\u0109\u010B\u010D\u00E7\u1E09\u0188\u023C\uA73F\u2184\u0043\u0108\u010A\u010C\u00C7\u0187\u023B",
  }, {
    base: 'd',
    chars: "\u24D3\uFF44\u1E0B\u010F\u1E0D\u1E11\u1E13\u1E0F\u0111\u018C\u0256\u0257\u018B\u13E7\u0501\uA7AA",
  }, {
    base: 'dh',
    chars: "\u00F0",
  }, {
    base: 'dz',
    chars: "\u01F3\u01C6",
  }, {
    base: 'e',
    chars: "\u24D4\uFF45\u00E8\u00E9\u00EA\u1EC1\u1EBF\u1EC5\u1EC3\u1EBD\u0113\u1E15\u1E17\u0115\u0117\u00EB\u1EBB\u011B\u0205\u0207\u1EB9\u1EC7\u0229\u1E1D\u0119\u1E19\u1E1B\u0247\u01DD",
  }, {
    base: 'f',
    chars: "\u24D5\uFF46\u1E1F\u0192",
  }, {
    base: 'ff',
    chars: "\uFB00",
  }, {
    base: 'fi',
    chars: "\uFB01",
  }, {
    base: 'fl',
    chars: "\uFB02",
  }, {
    base: 'ffi',
    chars: "\uFB03",
  }, {
    base: 'ffl',
    chars: "\uFB04",
  }, {
    base: 'g',
    chars: "\u24D6\uFF47\u01F5\u011D\u1E21\u011F\u0121\u01E7\u0123\u01E5\u0260\uA7A1\uA77F\u1D79",
  }, {
    base: 'h',
    chars: "\u24D7\uFF48\u0125\u1E23\u1E27\u021F\u1E25\u1E29\u1E2B\u1E96\u0127\u2C68\u2C76\u0265",
  }, {
    base: 'hv',
    chars: "\u0195",
  }, {
    base: 'i',
    chars: "\u24D8\uFF49\xEC\xED\xEE\u0129\u012B\u012D\xEF\u1E2F\u1EC9\u01D0\u0209\u020B\u1ECB\u012F\u1E2D\u0268\u0131",
  }, {
    base: 'j',
    chars: "\u24D9\uFF4A\u0135\u01F0\u0249",
  }, {
    base: 'k',
    chars: "\u24DA\uFF4B\u1E31\u01E9\u1E33\u0137\u1E35\u0199\u2C6A\uA741\uA743\uA745\uA7A3",
  }, {
    base: 'l',
    chars: "\u24DB\uFF4C\u0140\u013A\u013E\u1E37\u1E39\u013C\u1E3D\u1E3B\u017F\u0142\u019A\u026B\u2C61\uA749\uA781\uA747\u026D",
  }, {
    base: 'lj',
    chars: "\u01C9",
  }, {
    base: 'm',
    chars: "\u24DC\uFF4D\u1E3F\u1E41\u1E43\u0271\u026F",
  }, {
    base: 'n',
    chars: "\u24DD\uFF4E\u01F9\u0144\xF1\u1E45\u0148\u1E47\u0146\u1E4B\u1E49\u019E\u0272\u0149\uA791\uA7A5\u043B\u0509",
  }, {
    base: 'nj',
    chars: "\u01CC",
  }, {
    base: 'o',
    chars: "\u24DE\uFF4F\xF2\xF3\xF4\u1ED3\u1ED1\u1ED7\u1ED5\xF5\u1E4D\u022D\u1E4F\u014D\u1E51\u1E53\u014F\u022F\u0231\xF6\u022B\u1ECF\u0151\u01D2\u020D\u020F\u01A1\u1EDD\u1EDB\u1EE1\u1EDF\u1EE3\u1ECD\u1ED9\u01EB\u01ED\xF8\u01FF\uA74B\uA74D\u0275\u0254\u1D11",
  }, {
    base: 'oe',
    chars: "\u0153",
  }, {
    base: 'oi',
    chars: "\u01A3",
  }, {
    base: 'oo',
    chars: "\uA74F",
  }, {
    base: 'ou',
    chars: "\u0223",
  }, {
    base: 'p',
    chars: "\u24DF\uFF50\u1E55\u1E57\u01A5\u1D7D\uA751\uA753\uA755\u03C1",
  }, {
    base: 'q',
    chars: "\u24E0\uFF51\u024B\uA757\uA759",
  }, {
    base: 'r',
    chars: "\u24E1\uFF52\u0155\u1E59\u0159\u0211\u0213\u1E5B\u1E5D\u0157\u1E5F\u024D\u027D\uA75B\uA7A7\uA783",
  }, {
    base: 's',
    chars: "\u24E2\uFF53\u015B\u1E65\u015D\u1E61\u0161\u1E67\u1E63\u1E69\u0219\u015F\u023F\uA7A9\uA785\u1E9B\u0282",
  }, {
    base: 'ss',
    chars: "\xDF",
  }, {
    base: 't',
    chars: "\u24E3\uFF54\u1E6B\u1E97\u0165\u1E6D\u021B\u0163\u1E71\u1E6F\u0167\u01AD\u0288\u2C66\uA787",
  }, {
    base: 'th',
    chars: "\u00FE",
  }, {
    base: 'tz',
    chars: "\uA729",
  }, {
    base: 'u',
    chars: "\u24E4\uFF55\xF9\xFA\xFB\u0169\u1E79\u016B\u1E7B\u016D\xFC\u01DC\u01D8\u01D6\u01DA\u1EE7\u016F\u0171\u01D4\u0215\u0217\u01B0\u1EEB\u1EE9\u1EEF\u1EED\u1EF1\u1EE5\u1E73\u0173\u1E77\u1E75\u0289",
  }, {
    base: 'v',
    chars: "\u24E5\uFF56\u1E7D\u1E7F\u028B\uA75F\u028C",
  }, {
    base: 'vy',
    chars: "\uA761",
  }, {
    base: 'w',
    chars: "\u24E6\uFF57\u1E81\u1E83\u0175\u1E87\u1E85\u1E98\u1E89\u2C73",
  }, {
    base: 'x',
    chars: "\u24E7\uFF58\u1E8B\u1E8D",
  }, {
    base: 'y',
    chars: "\u24E8\uFF59\u1EF3\xFD\u0177\u1EF9\u0233\u1E8F\xFF\u1EF7\u1E99\u1EF5\u01B4\u024F\u1EFF",
  }, {
    base: 'z',
    chars: "\u24E9\uFF5A\u017A\u1E91\u017C\u017E\u1E93\u1E95\u01B6\u0225\u0240\u2C6C\uA763",
  }
];

var diacriticsMap = {};
for (var i = 0; i < replacementList.length; i += 1) {
  var chars = replacementList[i].chars;
  for (var j = 0; j < chars.length; j += 1) {
    diacriticsMap[chars[j]] = replacementList[i].base;
  }
}

function removeDiacritics(str) {
  return str.replace(/[^\u0000-\u007e]/g, function(c) {
    return diacriticsMap[c] || c;
  });
}

},{}],96:[function(require,module,exports){
(function() {
  'use strict';

  /**
   * Extend an Object with another Object's properties.
   *
   * The source objects are specified as additional arguments.
   *
   * @param dst Object the object to extend.
   *
   * @return Object the final object.
   */
  var _extend = function(dst) {
    var sources = Array.prototype.slice.call(arguments, 1);
    for (var i=0; i<sources.length; ++i) {
      var src = sources[i];
      for (var p in src) {
        if (src.hasOwnProperty(p)) dst[p] = src[p];
      }
    }
    return dst;
  };

  /**
   * Based on the algorithm at http://en.wikipedia.org/wiki/Levenshtein_distance.
   */
  var Levenshtein = {
    /**
     * Calculate levenshtein distance of the two strings.
     *
     * @param str1 String the first string.
     * @param str2 String the second string.
     * @return Integer the levenshtein distance (0 and above).
     */
    get: function(str1, str2) {
      // base cases
      if (str1 === str2) return 0;
      if (str1.length === 0) return str2.length;
      if (str2.length === 0) return str1.length;

      // two rows
      var prevRow  = new Array(str2.length + 1),
          curCol, nextCol, i, j, tmp;

      // initialise previous row
      for (i=0; i<prevRow.length; ++i) {
        prevRow[i] = i;
      }

      // calculate current row distance from previous row
      for (i=0; i<str1.length; ++i) {
        nextCol = i + 1;

        for (j=0; j<str2.length; ++j) {
          curCol = nextCol;

          // substution
          nextCol = prevRow[j] + ( (str1.charAt(i) === str2.charAt(j)) ? 0 : 1 );
          // insertion
          tmp = curCol + 1;
          if (nextCol > tmp) {
            nextCol = tmp;
          }
          // deletion
          tmp = prevRow[j + 1] + 1;
          if (nextCol > tmp) {
            nextCol = tmp;
          }

          // copy current col value into previous (in preparation for next iteration)
          prevRow[j] = curCol;
        }

        // copy last col value into previous (in preparation for next iteration)
        prevRow[j] = nextCol;
      }

      return nextCol;
    },

    /**
     * Asynchronously calculate levenshtein distance of the two strings.
     *
     * @param str1 String the first string.
     * @param str2 String the second string.
     * @param cb Function callback function with signature: function(Error err, int distance)
     * @param [options] Object additional options.
     * @param [options.progress] Function progress callback with signature: function(percentComplete)
     */
    getAsync: function(str1, str2, cb, options) {
      options = _extend({}, {
        progress: null
      }, options);

      // base cases
      if (str1 === str2) return cb(null, 0);
      if (str1.length === 0) return cb(null, str2.length);
      if (str2.length === 0) return cb(null, str1.length);

      // two rows
      var prevRow  = new Array(str2.length + 1),
          curCol, nextCol,
          i, j, tmp,
          startTime, currentTime;

      // initialise previous row
      for (i=0; i<prevRow.length; ++i) {
        prevRow[i] = i;
      }

      nextCol = 1;
      i = 0;
      j = -1;

      var __calculate = function() {
        // reset timer
        startTime = new Date().valueOf();
        currentTime = startTime;

        // keep going until one second has elapsed
        while (currentTime - startTime < 1000) {
          // reached end of current row?
          if (str2.length <= (++j)) {
            // copy current into previous (in preparation for next iteration)
            prevRow[j] = nextCol;

            // if already done all chars
            if (str1.length <= (++i)) {
              return cb(null, nextCol);
            }
            // else if we have more left to do
            else {
              nextCol = i + 1;
              j = 0;
            }
          }

          // calculation
          curCol = nextCol;

          // substution
          nextCol = prevRow[j] + ( (str1.charAt(i) === str2.charAt(j)) ? 0 : 1 );
          // insertion
          tmp = curCol + 1;
          if (nextCol > tmp) {
            nextCol = tmp;
          }
          // deletion
          tmp = prevRow[j + 1] + 1;
          if (nextCol > tmp) {
            nextCol = tmp;
          }

          // copy current into previous (in preparation for next iteration)
          prevRow[j] = curCol;

          // get current time
          currentTime = new Date().valueOf();
        }

        // send a progress update?
        if (null !== options.progress) {
          try {
            options.progress.call(null, (i * 100.0/ str1.length));
          } catch (err) {
            return cb('Progress callback: ' + err.toString());
          }
        }

        // next iteration
        setTimeout(__calculate(), 0);
      };

      __calculate();
    }

  };

  // amd
  if (typeof define !== "undefined" && define !== null && define.amd) {
    define(function() {
      return Levenshtein;
    });
  }
  // commonjs
  else if (typeof module !== "undefined" && module !== null) {
    module.exports = Levenshtein;
  }
  // web worker
  else if (typeof self !== "undefined" && typeof self.postMessage === 'function' && typeof self.importScripts === 'function') {
    self.Levenshtein = Levenshtein;
  }
  // browser main thread
  else if (typeof window !== "undefined" && window !== null) {
    window.Levenshtein = Levenshtein;
  }
}());


},{}],97:[function(require,module,exports){
'use strict';

var stripDiacritics = require('diacritics').remove;
var levenshtein = require('fast-levenshtein').get;
var _ = require('lodash');

exports.getSimilar = getSimilar;
exports.compareObjects = compareObjects;
exports.compareStrings = compareStrings;

function getSimilar (obj, set, weights, threshold) {
  var similar = [];
  threshold = threshold || -1;
  _.forEach(set, function forEach (setObj) {
    var resemblance = compareObjects(obj, setObj, weights);
    if (resemblance > threshold) {
      similar.push({
        resemblance: resemblance,
        obj: _.cloneDeep(setObj)
      });
    }
  });

  // sort results so that best match is result[0]
  return similar.sort(function descendingResemblance (a, b) {
    return b.resemblance - a.resemblance;
  });
}

function compareStrings (a, b) {
  // test falsy values
  a = a || '';
  b = b || '';

  // to string
  a = JSON.stringify(a);
  b = JSON.stringify(b);

  // unify case
  a = a.toLowerCase();
  b = b.toLowerCase();

  // remove diacritics
  a = stripDiacritics(a);
  b = stripDiacritics(b);

  // remove non alphanumerical characters
  a = a.replace(/[^\w]+/g, '');
  b = b.replace(/[^\w]+/g, '');

  // likeness
  return 1 - (levenshtein(a, b) / Math.max(Math.max(a.length, b.length), 1));
}

function compareObjects (a, b, weights) {
  var resemblance = 0;
  var totalWeight = 0;
  var propWeight, aPropValue, bPropValue;

  _.forOwn(weights, function forOwn (weight, key) {
    propWeight = _.isNumber(weight) ? weight : 0;

    aPropValue = _.has(a, key) ? _.get(a, key) : '';
    bPropValue = _.has(b, key) ? _.get(b, key) : '';

    resemblance += compareStrings(aPropValue, bPropValue) * propWeight;
    totalWeight += propWeight;
  });

  if (totalWeight === 0) {
    return 1;
  }
  return resemblance / totalWeight;
}

},{"diacritics":95,"fast-levenshtein":96,"lodash":21}]},{},[5,6,7,8,9,10,11,12,1,2,3,4,13])

