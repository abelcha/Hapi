angular.module('edison').directive('select', function($interpolate) {
    return {
        restrict: 'E',
        require: 'ngModel',
        link: function(scope, elem, attrs, ctrl) {
            var defaultOptionTemplate;
            if (attrs.defaultOption) {
                scope.defaultOptionText = attrs.defaultOption || 'Select...';
                defaultOptionTemplate = '<option value="" disabled selected style="display: none;">{{defaultOptionText}}</option>';
                elem.prepend($interpolate(defaultOptionTemplate)(scope));
            }
        }
    };
});
