
angular.module('edison').directive('newlines', function() {
    return {
        require: 'ngModel',
        link: function(scope, element, attrs, modelCtrl) {
            modelCtrl.$parsers.push(function(input) {
                return input ? input.replace(/\n/g, '<br/>') : "";
            });
        }
    };
})

