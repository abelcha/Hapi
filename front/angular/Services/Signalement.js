angular.module('edison').factory('Signalement', function(edisonAPI) {
    "use strict";

    var Signalement = function(inter) {
        this.intervention = inter;
    }

    Signalement.prototype.list = []
    return Signalement;
});
