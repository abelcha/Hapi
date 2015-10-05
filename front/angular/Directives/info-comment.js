 angular.module('edison').directive('infoComment', function(user) {
     "use strict";
     return {
         replace: false,
         restrict: 'E',
         templateUrl: '/Templates/info-comment.html',
         scope: {
             data: '=',
         },
         link: function(scope, elem, attr) {
             scope.height = attr.height ||  216;
             scope.user = user;
             scope.addComment = function() {
                 scope.data.comments.push({
                     login: user.login,
                     text: scope.commentText,
                     date: new Date()
                 })
                 scope.commentText = "";
             }
         }
     }
 });
