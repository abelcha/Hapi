var editCombos = function(tabContainer, edisonAPI, $rootScope, $scope, $location, LxNotificationService, socket) {
    "use strict";
    var _this = this;
    _this.tab = tabContainer.getCurrentTab();
    _this.tab.setTitle('Produits');


    var base = {
        "id": 29300,
        "categorie": "EL",
        "description": "RECHERCHE DE PANNE ELCTRIQUE",
        "sst": 31,
        "file": [],
        "tva": 10,
        "coutFourniture": 0,
        "enDemarchage": false,
        "aDemarcher": false,
        "reglementSurPlace": false,
        "prixFinal": 0,
        "prixAnnonce": 130,
        "modeReglement": "CH",
        "fourniture": [],
        "produits": [],
        "remarque": "Pas de remarque(s)",
        "descriptionTags": [],
        "artisan": {
            "id": 31,
            "nomSociete": "SODESEN"
        },
        "savEnCours": true,
        "litigesEnCours": true,
        "litiges": [],
        "sav": [],
        "client": {
            "civilite": "M.",
            "nom": "DELORME",
            "email": "",
            "location": [
                45.7592,
                4.77779
            ],
            "address": {
                "n": "19",
                "r": "RUE DES CERISIERS",
                "v": "TASSIN-LA-DEMI-LUNE",
                "cp": "69160",
                "lt": 45.7592,
                "lg": 4.77779
            },
            "telephone": {
                "tel1": "0478346059",
                "origine": "0478346059"
            },
            "prenom": "CHRISTIAN"
        },
        "facture": {
            "civilite": "M.",
            "nom": "DELORME",
            "email": "",
            "location": [
                45.7592,
                4.77779
            ],
            "address": {
                "n": "19",
                "r": "RUE DES CERISIERS",
                "v": "TASSIN-LA-DEMI-LUNE",
                "cp": "69160",
                "lt": 45.7592,
                "lg": 4.77779
            },
            "telephone": {
                "tel1": "0478346059",
                "origine": "0478346059"
            },
            "prenom": "CHRISTIAN"
        },
        "produits": [],
        "historique": [],
        "comments": [],
        "date": {
            "intervention": "2015-09-17T11:00:00.000Z",
            "envoi": "2015-09-17T09:11:14.000Z",
            "ajout": "2015-09-17T09:11:14.000Z"
        },
        "login": {
            "ajout": "clement_b",
            "envoi": "clement_b"
        },
        "status": "ENC"
    }



    edisonAPI.combo.list().then(function(resp) {
        $scope.plSave = resp.data
        $scope.pl = _.map(resp.data, _this.extend);
    })

    _this.extend = function(e) {
        var z = _.assign(_.clone(base), e)
        console.log(z, e);
        return z;
    }

    _this.save = function() {
        edisonAPI.combo.save($scope.pl).then(function(resp) {
            $scope.pl = _.map(resp.data, _this.extend);
            LxNotificationService.success("Les produits on été mis a jour");
        }, function(err) {
            LxNotificationService.error("Une erreur est survenu (" + JSON.stringify(err.data) + ')');
            //  edisonAPI.combo.save($scope.plSave);
        })
    }

    _this.getInter = function(prods)  {
        var x = _.clone(base)
        x.produits = prods.produits;
        return x;
    }

    _this.add = function() {
        $scope.pl.push({
            produits: [],
            title: '',
            open: true,
            text: ""
        })
    }



}
angular.module('edison').controller('editCombos', editCombos);
