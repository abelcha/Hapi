var DevisCtrl = function(edisonAPI, $scope, $rootScope, $location, $routeParams, LxProgressService, LxNotificationService, tabContainer, config, dialog, devisPrm, Devis) {
    "use strict";
    var _this = this;
    _this.config = config;
    _this.dialog = dialog;
    _this.moment = moment;
    var tab = tabContainer.getCurrentTab();
    if (!tab.data) {
        var devis = new Devis(devisPrm.data)
        tab.setData(devis);
        if ($routeParams.id.length > 12) {
            _this.isNew = true;
            devis.tmpID = $routeParams.id;
            tab.setTitle('DEVIS ' + moment((new Date(parseInt(devis.tmpID))).toISOString()).format("HH:mm").toString());
        } else {
            tab.setTitle('DEVIS ' + $routeParams.id);
            if (!devis) {
                LxNotificationService.error("Impossible de trouver les informations !");
                $location.url("/dashboard");
                tabContainer.remove(tab);
                return 0;
            }
        }
    } else {
        var devis = tab.data;
    }
    _this.data = tab.data;

    var closeTab = function(err) {
        console.log('=========>', err)
        if (!err)
            tabContainer.close(tab);
    }

    _this.saveDevis = function(options) {
        if (!devis.produits || !devis.produits.length) {
            return LxNotificationService.error("Veuillez ajouter au moins 1 produit");
        }
        devis.save(function(err, resp) {
            if (err) {
                return false;
            } else if (options.envoi) {
                devis.historique = [];
                Devis(resp).sendDevis(closeTab);
            } else if (options.annulation) {
                Devis(resp).annulation(closeTab);
            } else if (options.transfert) {
                Devis(resp).transfert()
            } else {
                closeTab();
            }
        })
    }
    $scope.$watch(function() {
        return devis.client.civilite
    }, function(newVal, oldVal) {
        if (oldVal !== newVal)
            devis.tva = 20;
    })


    var updateTmpDevis = _.after(5, _.throttle(function() {
        edisonAPI.devis.saveTmp(devis);
    }, 2000))

    if (!devis.id) {
        $scope.$watch(function() {
            return devis;
        }, updateTmpDevis, true)
    }

}
angular.module('edison').controller('DevisController', DevisCtrl);
