 angular.module('edison').directive('link', ['FiltersFactory', '$rootScope', function(FiltersFactory, $rootScope) {
     "use strict";
     return {
         restrict: 'AE',
         replace: true,
         template: '<li>' +
             '      <a href="/{{_model}}/list{{url}}{{_hashModel}}{{_login}}" >' +
             '            <i ng-if="icon" class = "menu-icon fa fa-{{icon}}"> </i>' +
             '            <span class="mm-text">{{title || exFltr.long_name}}</span>' +
             '            <span ng-if="total !== void(0)"class="label label-success">{{total}}</span>' +
             '        </a>' +
             '      </li>',
         scope: {
             fltr: '@',
             login: '@',
             today: '@',
             icon: '@',
             title: '@',
             model: '@',
             count: '@',
             hashModel:'@'
         },
         link: function(scope, element, attrs) {

             var findTotal = function() {
                 if (scope.login) {
                     var t = _.find($rootScope.interventionsStats, function(e) {
                         return e.login === scope.login;
                     })
                     if (t && t[scope.fltr]) {
                         scope.total = t[scope.fltr].total;
                     } else {
                         scope.total = 0;
                     }
                 }
             }
             $rootScope.$watch('interventionsStats', findTotal)
             scope._model = scope.model || 'intervention';
             var filtersFactory = new FiltersFactory(scope._model);
             scope.exFltr = filtersFactory.getFilterByName(scope.fltr);
             findTotal();
             scope.url = scope.exFltr.url.length ? "/" + scope.exFltr.url : scope.exFltr.url;
             scope._login = scope.login ? ("#" + scope.login) : '';
             scope._hashModel = scope.hashModel ? ("?hashModel=" + scope.hashModel) : '';
         }
     };
 }]);

 angular.module('edison').directive('linkSeparator', [function() {
     "use strict";
     return {
         restrict: 'AE',
         replace: true,
         template: '<li>' +
             '      <a>' +
             '            <i ng-if="icon" class = "menu-icon fa fa-{{icon}}"> </i>' +
             '            <strong><span class="mm-text">{{title}}</span></strong>' +
             '        </a>' +
             '      </li>',
         scope: {
             icon: '@',
             title: '@',
         },
         link: function(scope, element, attrs) {

         }
     };
 }]);


 angular.module('edison').service('sidebarSM', function() {

     var C = function() {
         this.display = false;
     };
     C.prototype.set = function(name, value) {
         this[name] = value;
     }
     return new C();

 });

 angular.module('edison').directive('sideBar', ['sidebarSM', function(sidebarSM) {
     "use strict";
     return {
         replace: true,
         restrict: 'E',
         templateUrl: '/Directives/side-bar.html',
         transclude: true,
         scope: {},
         link: function(scope, element, attrs) {
             scope.sidebarSM = sidebarSM;
         }
     }
 }]);

 angular.module('edison').directive('dropDown', ['config', 'sidebarSM', '$timeout', function(config, sidebarSM, $timeout) {
     "use strict";


     return {
         replace: true,
         restrict: 'E',
         templateUrl: '/Directives/dropdown.html',
         transclude: true,
         scope: {
             title: '@',
             icon: '@',
             isOpen: '@',
             openDefault: '&'
         },
         link: function(scope, element, attrs) {
             scope.openDefault = scope.$eval(scope.openDefault)
             scope.isOpen = scope.openDefault
             scope.toggleSidebar = function($event, $elem) {
                 var $ul = $(element).find('>ul')
                 if ($('#main-menu').width() > 200) {
                     if (scope.isOpen) {
                         $ul.velocity({
                             height: 0
                         }, 200, function() {
                             scope.$apply(function() {
                                 scope.isOpen = false;
                             })
                         });
                     } else {
                         $ul.css('height', '100%')
                         scope.isOpen = true
                     }
                 } else {

                     $('#mmc-ul > .mmc-wrapper').html($ul.find('> *'));
                     sidebarSM.set("display", true);
                     $timeout(function checkHover() {
                         if (!$('#mmc-ul').is(":hover")) {
                             sidebarSM.set("display", false);
                             $ul.html($('#mmc-ul > .mmc-wrapper').find(">*"))
                             $('#mmc-ul > .mmc-wrapper').html('');
                         } else {
                             $timeout(checkHover, 1000);
                         }
                     }, 1000)
                 }
             }
         }
     };
 }]);
