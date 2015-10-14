angular.module('edison').controller('MainController', function($timeout, LxNotificationService, $q, DataProvider, TabContainer, $scope, socket, config, $rootScope, $location, edisonAPI, taskList, $window) {
    "use strict";

    $rootScope.app_users = app_users;
    $rootScope.displayUser = app_session
    $scope.sidebarHeight = $("#main-menu-bg").height();
    $scope.config = config;
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


    $scope.logout = function() {
        edisonAPI.users.logout().then(function() {
            $window.location.reload()
        })
    }

    $scope.toggleSidebar = function(open) {
        if (open && !$rootScope.smallWin)
            return 0;
        $scope.sideBarIsOpen = open;
    }

    $scope.changeUser = function(usr) {
        $rootScope.displayUser = usr
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
    $('input[type="search"]').ready(function() {

        $('input[type="search"]').on('keyup', function(e, w) {
            if (e.which == 13) {
                if ($('ul.md-autocomplete-suggestions>li').length) {
                    $location.url('/search/' + $(this).val())
                    $(this).val("")
                    $(this).blur()
                }
            }
        });
    })
    var bfm = function() {
        edisonAPI.bfm.get().then(function(resp) {
            $rootScope.events = resp.data;
        })
    }
    socket.on('event', _.debounce(bfm, _.random(0, 3000)));

    bfm();

    $scope.searchBox = {
        search: function(x) {
            var deferred = $q.defer();
            edisonAPI.searchText(x, {
                limit: 10,
                flat: true
            }).success(function(resp) {
                deferred.resolve(resp)
            })
            return deferred.promise;
        },
        change: function(x) {
            if (x) {
                $location.url(x.link)
            }
            $scope.searchText = "";
        }
    }

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
        if (data.dest === $rootScope.user.login && data.dest !== data.origin) {
            LxNotificationService.notify(data.message, 'android', false, data.color);
        }
    })


    $rootScope.openTab = function(tab) {
        //   console.log('-->', tab);
    }

    $rootScope.closeContextMenu = function() {
        _this.selectedModel = null
        $rootScope.$broadcast('closeContextMenu');
    }

    var devisDataProvider = new DataProvider('devis')
    var artisanDataProvider = new DataProvider('artisan')
    var interventionDataProvider = new DataProvider('intervention')



    this.openSubTab = function(model) {
        model.top = $('#' + model.title).offset().top;
        model.left = $('#' + model.title).offset().left;
        $timeout(function() {
            _this.selectedModel = model;
        }, 20)
    }

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
