angular.module('edison').directive('mainNavbar', function($q, edisonAPI, TabContainer, $timeout, $rootScope, $location, $window) {
    "use strict";
    return {
        restrict: 'E',
        templateUrl: '/Templates/main-navbar.html',
        scope: {
            data: "=",
            display: "=",
            small: "="
        },
        link: function(scope, element, attrs) {
            scope.root = $rootScope;
            scope._ = _;
            scope.tabContainer = TabContainer;

            scope.select = function(model) {
                if (scope.selectedTab == model) {
                    scope.selectedTab = null
                } else {
                    scope.selectedTab = model
                }
            }
            $('input[type="search"]').ready(function() {
                $timeout(function() {
                    $('input[type="search"]').on('keyup', function(e, w) {
                        if (e.which == 13) {
                            if ($('ul.md-autocomplete-suggestions>li').length) {
                                $location.url('/search/' + $(this).val())
                                $(this).val("")
                                $(this).blur()
                            }
                        }
                    });
                }, 10);
            })

            $rootScope.$on('closeContextMenu', function() {
                scope.selectedTab = null;
            })




            scope.logout = function() {
                edisonAPI.users.logout().then(function() {
                    $window.location.reload()
                })
            }


            $rootScope.$on('closeSearchBar', function() {
                scope.searchBarSize = 100
            })

            var searchInput = 'md-autocomplete.searchBar>md-autocomplete-wrap>input'
            $(searchInput).ready(function() {
                $timeout(function() {
                    $(searchInput).on('focus', function() {
                        scope.searchFocus = true
                        var selectors = ['.navbar-header', '.navbar-nav', '.dropdown-toggle.user-menu']
                        scope.searchBarSize = _.reduce(selectors, function(total, el) {
                            return total -= $(el).width();
                        }, $(window).width() - 70)
                    })
                    $(searchInput).on('blur', function() {
                        scope.searchFocus = false
                        scope.searchBarSize = 100
                    })
                }, 10);
            })

            scope.changeUser = function(usr) {
                $rootScope.displayUser = usr
            }

            scope.searchBox = {
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
                    if (!x.link)
                        return 0;
                    if (x) {
                        $location.url(x.link)
                    }
                    $timeout(function() {
                        $(searchInput).blur();
                    });
                    scope.searchText = "";
                }
            }



        },
    }

});
