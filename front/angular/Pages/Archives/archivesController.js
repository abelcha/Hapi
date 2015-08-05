var archiveReglementController = function(edisonAPI, tabContainer, $routeParams, $location, LxProgressService) {

    var tab = tabContainer.getCurrentTab();
    var _this = this;
    _this.title = 'Archives Reglements'
    tab.setTitle('archives RGL')
    LxProgressService.circular.show('#5fa2db', '#globalProgress');
    edisonAPI.compta.archivesReglement().success(function(resp) {
        LxProgressService.circular.hide()
        _this.data = resp
    })
    _this.moment = moment;
    _this.openLink = function(link) {
        $location.url(link)
    }
}

angular.module('edison').controller('archivesReglementController', archiveReglementController);

var archivesPaiementController = function(edisonAPI, tabContainer, $routeParams, $location, LxProgressService) {
    var _this = this;
    var tab = tabContainer.getCurrentTab();
    _this.type = 'paiement'
    _this.title = 'Archives Paiements'
    tab.setTitle('archives PAY')
    LxProgressService.circular.show('#5fa2db', '#globalProgress');
    edisonAPI.compta.archivesPaiement().success(function(resp) {
        LxProgressService.circular.hide()
        _this.data = resp
    })
    _this.moment = moment;
    _this.openLink = function(link) {
        $location.url(link)
    }
}

angular.module('edison').controller('archivesPaiementController', archivesPaiementController);
