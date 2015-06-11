 angular.module('edison').directive('link', ['config', '$rootScope', function(config, $rootScope) {
     "use strict";
     return {
         restrict: 'AE',
         replace: true,
         template: '<li>' +
             '      <a href="/interventions{{exFltr.url}}{{date}}{{exLogin}}" >' +
             '            <i ng-if="icon" class = "menu-icon fa fa-{{icon}}"> </i>' +
             '            <span class="mm-text">{{title || exFltr.long_name}}</span>' +
             '            <span ng-if="total" class="label label-success">{{total}}</span>' +
             '        </a>' +
             '      </li>',
         scope: {
             fltr: '@',
             login: '@',
             today: '@',
             icon: '@',
             title: '@',
             count: '@'
         },
         link: function(scope, element, attrs) {
             scope.exFltr = _.clone(config.filters().get({
                 short_name: scope.fltr
             }))
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
             scope.exFltr.url = scope.exFltr.url.length ? "/" + scope.exFltr.url : scope.exFltr.url;
             scope.exLogin = scope.login ? ("#" + scope.login) : '';
             scope.date = attrs.today != void(0) ? "?d=t" : '';
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
         scope: {

         },
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
             icon: '@'
         },
         link: function(scope, element, attrs) {
             scope.toggleSidebar = function($event, $elem) {
                 var $ul = $(element).find('>ul')
                     //  openDropdown(element);
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
