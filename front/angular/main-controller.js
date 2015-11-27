angular.module('edison').controller('MainController', function($timeout, LxNotificationService,dialog, $q, DataProvider, TabContainer, $scope, socket, config, $rootScope, $location, edisonAPI, taskList, $window) {
    "use strict";

    $rootScope.app_users = app_users;
    $rootScope.displayUser = app_session
    $scope.sidebarHeight = $("#main-menu-bg").height();
    $scope.config = config;
    $scope._ = _;
    $rootScope.loadingData = true;
    $rootScope.$on('$routeChangeSuccess', function() {
        $window.scrollTo(0, 0);
        $rootScope.loadingData = false;
    });
    var _this = this;

    $rootScope.toggleSidebar = function(open) {
        if ($rootScope.sideBarMode === true) {
            $rootScope.sideBarIsClosed = open;
        }
    }

    $rootScope.toggleSidebarMode = function(newVal) {
        $rootScope.sideBarMode = _.isUndefined(newVal) ? !$rootScope.sideBarMode : newVal;
        $rootScope.sideBarIsClosed = $rootScope.sideBarMode
    }

    var checkResize = function() {
        $rootScope.smallWin = window.innerWidth < 1350
        return $rootScope.toggleSidebarMode($rootScope.smallWin);
    }
    $(window).resize(checkResize);
    checkResize();


    $scope.dateFormat = moment().format('llll').slice(0, -5);
    /*    $scope.$watch('tabs.selectedTab', function(prev, curr) {
            if (prev === -1 && curr !== -1) {
                $scope.tabs.selectedTab = curr;
            }
        });*/
    $rootScope.options = {
        showMap: true
    };


    var getSignalementStats = function() {
        edisonAPI.signalement.stats().then(function(resp) {
            $scope.signalementStats = resp.data;
        })
    }
    getSignalementStats()

    var reloadStats = function() {
        console.log('reloadStats')
        edisonAPI.stats.telepro()
            .success(function(result) {
                $scope.userStats = _.find(result, function(e) {
                    return e.login === $scope.user.login;
                });
                $rootScope.interventionsStats = result;
            });

        edisonAPI.intervention.dashboardStats({
                date: moment().startOf('day').toDate()
            })
            .then(function(resp) {
                _this.statsTeleproBfm = _.sortBy(resp.data.weekStats, 'total').reverse().slice(0, 6)
            });

    };

    $rootScope.user = window.app_session
    reloadStats();
    socket.on('filterStatsReload', _.debounce(reloadStats, _.random(0, 1000)));

    $window.notify = function() {
        LxNotificationService.notify("test", 'android', false, "red");
    }

    socket.on('notification', function(data) {
        if (data.dest === $rootScope.user.login && (data.dest !== data.origin || data.self)) {
            LxNotificationService.notify(data.message, data.icon || 'android', false, data.color);
        }
        if (data.service && data.service === $rootScope.user.service) {
            LxNotificationService.notify(data.message, data.icon || 'android', false, data.color);
        }
    })


    $rootScope.openTab = function(tab) {

    }

    $rootScope.closeContextMenu = function(ev) {
        $rootScope.$broadcast('closeContextMenu');
    }

    var devisDataProvider = new DataProvider('devis')
    var artisanDataProvider = new DataProvider('artisan')
    var interventionDataProvider = new DataProvider('intervention')




    this.tabContainer = TabContainer;
    $scope.$on("$locationChangeStart", function(event) {
        if (_.includes(["/intervention", '/devis', '/artisan', '/'], $location.path())) {
            return 0
        }
        TabContainer.add($location).order();
    })


    $scope.taskList = taskList;

    $scope.linkClick = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
    };


    Mousetrap.bind(['command+i', 'ctrl+i'], function() {
        dialog.declareBug(_this.tabContainer, function(err, resp) {
            console.log(resp);
            edisonAPI.bug.declare(resp).then(function() {
                LxNotificationService.error("Le Serice informatique en a été prevenu");  
            })
           /* edisonAPI.intervention.save(_this).then(function(resp) {
                LxNotificationService.success("L'intervention " + _this.id + " est modifié");
            }, function(err) {
                LxNotificationService.error("Une erreur est survenu (" + err.data + ")");
            });*/
        })
    });


    $scope.tabIconClick = function($event, tab) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.tabs.close(tab)
    };
});
