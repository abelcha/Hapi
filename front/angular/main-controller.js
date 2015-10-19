angular.module('edison').controller('MainController', function($timeout, LxNotificationService, $q, DataProvider, TabContainer, $scope, socket, config, $rootScope, $location, edisonAPI, taskList, $window) {
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
    var checkResize = function() {

        $rootScope.smallWin = window.innerWidth < 1200
        $timeout(function() {
            if ($rootScope.smallWin) {
                $rootScope.sideBarIsOpen = true;
            }
        })
    }

    $(window).resize(checkResize);

    checkResize();



    $scope.toggleSidebar = function(open) {
        if (open && !$rootScope.smallWin)
            return 0;
        $scope.sideBarIsOpen = open;
    }


    $scope.shadowClick = function(url) {
        $location.url(url)
    }

    $scope.dateFormat = moment().format('llll').slice(0, -5);
    /*    $scope.$watch('tabs.selectedTab', function(prev, curr) {
            if (prev === -1 && curr !== -1) {
                $scope.tabs.selectedTab = curr;
            }
        });*/
    $rootScope.options = {
        showMap: true
    };

    var bfm = function() {
        edisonAPI.bfm.get().then(function(resp) {
            $rootScope.events = resp.data;
        })
    }
    socket.on('event', _.debounce(bfm, _.random(0, 3000)));

    bfm();

    var reloadStats = function() {
        edisonAPI.stats.telepro()
            .success(function(result) {
                $scope.userStats = _.find(result, function(e) {
                    return e.login === $scope.user.login;
                });
                $rootScope.interventionsStats = result;
            });
    };

    $rootScope.user = window.app_session
    reloadStats();

    socket.on('filterStatsReload', function(data) {
        $scope.userStats = _.find(data, function(e) {
            return e.login === $scope.user.login;
        });
        $rootScope.interventionsStats = data;
    })
    socket.on('notification', function(data) {
        console.log('notification==>',data)
        if (data.dest === $rootScope.user.login && data.dest !== data.origin || data.self) {
            LxNotificationService.notify(data.message, 'android', false, data.color);
        }
    })


    $rootScope.openTab = function(tab) {
        //   console.log('-->', tab);
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

    $scope.tabIconClick = function($event, tab) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.tabs.close(tab)
    };
});
