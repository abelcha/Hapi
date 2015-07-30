var ArchivesController = function(edisonAPI, tabContainer, $routeParams, $location, LxProgressService) {
    var tab = tabContainer.getCurrentTab();
    tab.setTitle('archives')
    var _this = this;
    LxProgressService.circular.show('#5fa2db', '#globalProgress');
    edisonAPI.compta.archives().success(function(resp) {
        LxProgressService.circular.hide()
        _this.data = resp
    })
    _this.moment = moment;
    _this.openLink = function(link) {
        $location.url(link)
    }
}

angular.module('edison').controller('archivesController', ArchivesController);
