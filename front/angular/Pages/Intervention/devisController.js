var DevisCtrl = function($rootScope, $location, $routeParams, tabContainer, config, dialog, devis) {
    "use strict";
    console.log("==>", devis.data);
    var _this = this;
    _this.config = config;
    _this.dialog = dialog;
    var tab = tabContainer.getCurrentTab();
    if (!tab.data) {
    	console.log("nodata")
        tab.setData(devis.data);
        if ($routeParams.id.length > 12) {
    	console.log("nEw")
            _this.isNew = true;
            tab.data.tmpID = $routeParams.id;
            tab.setTitle('#' + moment((new Date(parseInt(tab.data.tmpID))).toISOString()).format("HH:mm").toString());
        } else {
    	console.log("old")

            tab.setTitle('#' + $routeParams.id);
            if (!devis) {
                alert("Impossible de trouver les informations !");
                $location.url("/dashboard");
                tabContainer.remove(tab);
                return 0;
            }
        }
    }

    _this.data = tab.data;
    if (!_this.data.id) {
        _this.data.login = {
            ajout: $rootScope.user.login
        }
    }

}
angular.module('edison').controller('DevisController', DevisCtrl);
