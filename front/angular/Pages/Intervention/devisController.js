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
            tab.setTitle('#' + moment((new Date(parseInt(devis.tmpID))).toISOString()).format("HH:mm").toString());
        } else {
            tab.setTitle('#' + $routeParams.id);
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
    _this.saveDevis = function(options) {
        devis.envoi(_this.data);
/*        actionDevis.save(_this.data, function(err, resp) {
            console.log(err, resp)
        })*/
    }
    $('map').css('height', '500px')
}
angular.module('edison').controller('DevisController', DevisCtrl);
