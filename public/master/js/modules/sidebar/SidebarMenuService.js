/**=========================================================
 * Module: FlotChartOptionsServices.js
 * Make an http request to load the menu structure
 =========================================================*/

App.service('sidebarMemu', function($rootScope, $http) {
  'use strict';
  var menuJson = 'server/sidebar/sidebar-items.json',
      menuURL  = menuJson + '?v=' + (new Date().getTime()); // jumps cache

  return {
    load: function() {

      $http.get(menuURL)
        .success(function(items) {

           $rootScope.menuItems = items;

        })
        .error(function(data, status, headers, config) {

          alert('Failure loading menu');

        });
    }
  };

});