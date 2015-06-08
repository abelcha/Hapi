 angular.module('edison').directive('sideLink', ['config', function(config) {
     "use strict";
     return {
         restrict: 'AE',
         replace: 'true',
         template: '<a href="/interventions{{exFltr.url}}{{date}}{{exLogin}}" >' +
             '            <i ng-if="icon" class = "menu-icon fa fa-{{icon}}"> </i>' +
             '            <span class="mm-text">{{exFltr.long_name}}</span>' +
             '			  <span ng-if="total" class="label label-success">{{total}}</span>' +
             '        </a>',
         scope: {
             fltr: '@',
             login: '@',
             today: '@',
             icon: '@',
             total:'@'
         },
         link: function(scope, element, attrs) {
             scope.exFltr = _.clone(config.filters().get({
                 short_name: scope.fltr
             }));
             scope.exFltr.url = scope.exFltr.url.length ? "/" + scope.exFltr.url : scope.exFltr.url;
             scope.exLogin = scope.login ? ("#" + scope.login) : '';
             scope.date = scope.today ? "?d=t" : '';
         }
     };
 }]);
