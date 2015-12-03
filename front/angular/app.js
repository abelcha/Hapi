angular.module('edison', ['chart.js', 'browserify', 'mm.iban', 'ui.slimscroll', 'ngMaterial', 'lumx', 'ngAnimate', 'xeditable', 'btford.socket-io', 'ngFileUpload', 'pickadate', 'ngRoute', 'ngResource', 'ngTable', 'ngMap'])
    .config(function($mdThemingProvider) {
        "use strict";
        $mdThemingProvider.theme('default')
            .primaryPalette('indigo')
            .accentPalette('blue-grey');
    })
    .run(function(editableOptions) {
        "use strict";
        editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
    }).run(function($templateCache, $route, $http) {
        var url;
        for (var i in $route.routes) {
            if (url = $route.routes[i].templateUrl) {
                $http.get(url, {
                    cache: $templateCache
                });
            }
        }
        $http.get("/Directives/dropdown-row.html", {
            cache: $templateCache
        });

        $http.get("/Templates/artisan-categorie.html", {
            cache: $templateCache
        });
        $http.get("/Templates/info-client.html", {
            cache: $templateCache
        });
        $http.get("/Templates/info-categorie.html", {
            cache: $templateCache
        });
        $http.get("/Templates/autocomplete-map.html", {
            cache: $templateCache
        });
    }).config(function($compileProvider) {
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|callto|mailto|file|tel):/);
    });
