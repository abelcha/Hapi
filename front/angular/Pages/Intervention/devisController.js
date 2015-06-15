var DevisCtrl = function($rootScope, $location, $routeParams, LxNotificationService, tabContainer, config, dialog, devisPrm, Devis) {
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
    if (!_this.data.id) {
        _this.data.login = {
            ajout: $rootScope.user.login
        }
    }
    var closeTab = function() {
        $location.url("/devis/list");
        tabContainer.remove(tab)
    }
    _this.saveDevis = function(options) {
        devis.save(function(err, resp) {
            if (err) {
                return false;
            } else if (options.envoi) {
                devis.envoi.bind(resp)(closeTab);
            } else if (options.annulation) {
                devis.annulation(closeTab);
            } else if (options.transfert) {
                devis.transfert()
            } else {
                closeTab();
            }
        })
    }
}
angular.module('edison').controller('DevisController', DevisCtrl);
