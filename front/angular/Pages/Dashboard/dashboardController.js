var DashboardController = function($rootScope, dialog, user, edisonAPI, $scope, $filter, TabContainer, NgTableParams, $routeParams, $location, LxProgressService) {
    // var tab = TabContainer.getCurrentTab();
    //   tab.setTitle('Dashboard')
    var _this = this;
    //LxProgressService.circular.show('#5fa2db', '#globalProgress');
    $scope._ = _;
    $scope.root = $rootScope;
    _this.openLink = function(link) {
            $location.url(link)
        }
        /*    edisonAPI.stats.day().then(function(resp) {

                _this.statsTelepro = resp.data;

            })*/



    _this.addTask = function() {
        edisonAPI.task.add(_this.newTask).then(reloadTask);
    }

    _this.check = function(task) {
        edisonAPI.task.check(task._id).then(reloadTask)
    }


    var reloadTask = function() {
        _this.newTask = {
            to: user.login,
            from: user.login
        }
        edisonAPI.task.listRelevant({
            user: $rootScope.displayUser
        }).then(function(resp) {
            _this.taskList = resp.data;
        })
    }

    reloadTask();

    edisonAPI.intervention.dashboardStats({
        user: user.login
    }).then(function(resp) {
        console.log(resp);
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
