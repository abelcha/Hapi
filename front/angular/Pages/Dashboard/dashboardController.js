var DashboardController = function(user, edisonAPI, $scope, $filter, TabContainer, NgTableParams, $routeParams, $location, LxProgressService) {
    // var tab = TabContainer.getCurrentTab();
    //   tab.setTitle('Dashboard')
    var _this = this;
    //LxProgressService.circular.show('#5fa2db', '#globalProgress');
    $scope._ = _;
    _this.openLink = function(link) {
            $location.url(link)
        }
        /*    edisonAPI.stats.day().then(function(resp) {

                _this.statsTelepro = resp.data;

            })*/



    edisonAPI.intervention.dashboardStats({
        user: user.login
    }).then(function(resp) {
        _this.tableParams = new NgTableParams({
            count: resp.data.weekStats.length,
            sorting: {
                total: 'desc'
            }
        }, {
            counts: [],
            data: resp.data.weekStats
        });
        _this.result = resp.data
    })
}

angular.module('edison').controller('DashboardController', DashboardController);
