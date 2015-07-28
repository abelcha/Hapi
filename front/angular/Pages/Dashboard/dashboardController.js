var DashboardController = function(edisonAPI, tabContainer, $routeParams, $location, LxProgressService) {
    var tab = tabContainer.getCurrentTab();
    tab.setTitle('Dashboard')
    var _this = this;
    //LxProgressService.circular.show('#5fa2db', '#globalProgress');

    _this.openLink = function(link) {
        $location.url(link)
    }
}

angular.module('edison').controller('DashboardController', DashboardController);

