var DashboardController = function(edisonAPI, $scope, $filter, tabContainer, ngTableParams, $routeParams, $location, LxProgressService) {
    var tab = tabContainer.getCurrentTab();
    tab.setTitle('Dashboard')
    var _this = this;
    //LxProgressService.circular.show('#5fa2db', '#globalProgress');

    _this.openLink = function(link) {
        $location.url(link)
    }
    edisonAPI.stats.day().then(function(resp) {

        _this.statsTelepro = resp.data;

    })
}

angular.module('edison').controller('DashboardController', DashboardController);
