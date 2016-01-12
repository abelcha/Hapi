 angular.module('edison').directive('infoConversation', function(mapAutocomplete, edisonAPI, config) {
    "use strict";
    return {
        restrict: 'E',
        templateUrl: '/Templates/info-conversation.html',
        scope: {
            data: "=",
        },
        link: function(scope, element, attrs) {
            scope.embedded = !!attrs.embedded
            console.log(attrs.embedded);
        },
    }

 });
