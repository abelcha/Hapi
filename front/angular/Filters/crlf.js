angular.module('edison').filter('crlf', function() {
    return function(text) {
        return text.split(/\n/g).join('<br>');
    };
});
