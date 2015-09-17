 angular.module('edison').directive('link', ['FiltersFactory', '$rootScope', function(FiltersFactory, $rootScope) {
     "use strict";
     return {
         restrict: 'AE',
         replace: true,
         template: '<li>' +
             '      <a href="{{fullUrl}}" >' +
             '            <i ng-if="icon" class = "menu-icon fa fa-{{icon}}"> </i>' +
             '            <span ng-class="{bold : bold, textWhite: textWhite}" class="mm-text">{{title || exFltr.long_name}}</span>' +
             '            <span ng-if="total"class="label label-{{_color}}">{{total}}</span>' +
             '        </a>' +
             '      </li>',
         scope: {
             fltr: '@',
             login: '@',
             today: '@',
             icon: '@',
             title: '@',
             url: '@',
             textWhite: '@',
             model: '@',
             bold: '@',
             count: '@',
             noCounter: '@',
             color: '@',
             hashModel: '@'
         },
         link: function(scope, element, attrs) {
             var findTotal = function() {
                 if (scope.noCounter)
                     return undefined;
                 var total = 0;
                 if (scope.login) {
                     var t = _.find($rootScope.interventionsStats, function(e) {
                         return e.login === scope.login;
                     })
                     total += _.get(t, scope.fltr + '.total', 0);
                 } else {
                     _.each($rootScope.interventionsStats, function(t) {
                         total += _.get(t, scope.fltr + '.total', 0);
                     })
                 }
                 return total;
             }
             $rootScope.$watch('interventionsStats', function() {
                 scope.total = findTotal();
             })
             scope.$watch('login', function(current, prev) {
                 scope._color = (scope.color || 'success')
                 scope._model = scope.model || 'intervention';
                 var filtersFactory = new FiltersFactory(scope._model);
                 scope.exFltr = filtersFactory.getFilterByName(scope.fltr);
                 scope.total = findTotal();
                 scope._url = scope.exFltr.url.length ? "/" + scope.exFltr.url : scope.exFltr.url;
                 scope._login = scope.login && !scope.hashModel ? ("#" + scope.login) : '';
                 scope._hashModel = scope.hashModel ? ("?" + scope.hashModel + "=" + scope.login) : '';
                 scope.fullUrl = scope.url ||  ('/' + scope._model + '/list' + scope._url + scope._hashModel + scope._login)
             })

         }
     };
 }]);

 angular.module('edison').directive('simpleLink', ['FiltersFactory', '$rootScope', function(FiltersFactory, $rootScope) {
     "use strict";
     return {
         restrict: 'AE',
         replace: true,
         template: '<li>' +
             '      <a href="{{url}}" >' +
             '            <i ng-if="icon" class = "menu-icon fa fa-{{icon}}"> </i>' +
             '            <span class="mm-text">{{title}}</span>' +
             '        </a>' +
             '      </li>',
         scope: {
             icon: '@',
             title: '@',
             url: '@',
         },
         link: function(scope, element, attrs) {}
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
         replace: false,
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
             scope.isopen = scope.openDefault
             scope.toggleSidebar = function($event, $elem) {
                 var $ul = $(element).find('>ul')
                 if ($('#main-menu').width() > 200) {
                     if (scope.isopen) {
                         $ul.velocity({
                             height: 0
                         }, 200, function() {
                             scope.$apply(function() {
                                 scope.isopen = false;
                             })
                         });
                     } else {
                         $ul.css('height', '100%')
                         scope.isopen = true
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
