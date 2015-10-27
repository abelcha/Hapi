var DashboardController = function($rootScope, statsTelepro, dialog, user, edisonAPI, $scope, $filter, TabContainer, NgTableParams, $routeParams, $location, LxProgressService) {
    var _this = this;
    $scope._ = _;
    $scope.root = $rootScope;

    _this.openLink = function(link) {
        $location.url(link)
    }


    _this.addTask = function() {
        edisonAPI.task.add(_this.newTask).then(_.partial(_this.reloadTask, _this.newTask.to));
    }

    _this.check = function(task) {
        edisonAPI.task.check(task._id).then(_.partial(_this.reloadTask, _this.newTask.to))
    }


    console.log('==>', _.find(statsTelepro.data, 'login', user.login))

    _this.reloadTask = function(usr) {
        _this.newTask = {
            to: usr,
            from: user.login
        }
        edisonAPI.task.listRelevant({
            login: usr
        }).then(function(resp) {
            _this.taskList = resp.data;
        })
    }

    _this.reloadTask(user.login);

    _this.reloadDashboardStats = function(date) {

        edisonAPI.intervention.dashboardStats(date).then(function(resp) {
            _this.tableParams = new NgTableParams({
                count: resp.data.weekStats.length,
                sorting: {
                    total: 'desc'
                }
            }, {
                counts: [],
                data: resp.data.weekStats
            });
            _this.stats = resp.data
        })
    }

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
    _this.dateChoice = _this.dateSelect[1];
    this.reloadDashboardStats(_this.dateChoice);

}



angular.module('edison').controller('DashboardController', DashboardController);
