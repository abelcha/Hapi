var editProducts = function(TabContainer, edisonAPI, $rootScope, $scope, $location, LxNotificationService, socket) {
    "use strict";
    var _this = this;
    _this.tab = TabContainer.getCurrentTab();
    _this.tab.setTitle('Produits');


    var single = function(e) {
        e.single = (_(e.desc).deburr().toLowerCase() !== _(e.title).deburr().toLowerCase())
        return e;
    }

    edisonAPI.product.list().then(function(resp) {
        $scope.pl = _.map(resp.data, single);
    })

    _this.remove = function(obj) {
        $scope.pl.splice(_.findIndex($scope.pl, '_id', obj._id), 1);
    }

    _this.save = function() {
        edisonAPI.product.save($scope.pl).then(function(resp) {
            $scope.pl = _.map(resp.data, single);
            LxNotificationService.success("Les produits on été mis a jour");
        }, function(err) {
            LxNotificationService.error("Une erreur est survenu (" + JSON.stringify(err.data) + ')');
        })
    }

    /* $scope.$watch('pl', function(curr, prev) {
         if (curr && prev && !_.isEqual(prev, curr)) {
             save()
         }
     }, true)*/


}
angular.module('edison').controller('editProducts', editProducts);
