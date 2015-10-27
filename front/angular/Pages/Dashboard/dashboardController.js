var DashboardController = function($rootScope, dialog, user, edisonAPI, $scope, $filter, TabContainer, NgTableParams, $routeParams, $location, LxProgressService) {
    var _this = this;
    $scope._ = _;
    $scope.root = $rootScope;

    _this.openLink = function(link) {
        $location.url(link)
    }


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

    _this.reloadDashboardStats = function(date) {

        edisonAPI.intervention.dashboardStats({
            user: user.login,
            date: date
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
    this.reloadDashboardStats(moment().add('-3', 'months').toDate());

    _this.dateSelect = [{
        nom: 'Du jour',
        date: moment().startOf('day').toDate()
    }, {
        nom: 'De la semaine',
        date: moment().startOf('week').toDate()
    }, {
        nom: 'Du mois',
        date: moment().startOf('month').toDate()
    }, {
        nom: "De l'année",
        date: moment().startOf('year').toDate()
    }]

}

angular.module('edison').controller('DashboardController', DashboardController);
