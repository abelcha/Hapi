angular.module('edison').factory('user', function($window) {
    "use strict";
    return $window.app_session;
});
