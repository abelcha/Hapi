var editProducts = function(tabContainer, edisonAPI, $rootScope, $scope, $location, LxNotificationService, socket) {
    "use strict";
    var _this = this;
    _this.tab = tabContainer.getCurrentTab();
    _this.tab.setTitle('Produits');


    var single = function(e) {
        e.single = (_(e.desc).deburr().toLowerCase() !== _(e.title).deburr().toLowerCase())
        return e;
    }

    edisonAPI.product.list().then(function(resp) {
        $scope.pl = _.map(resp.data, single);
    })

    var save = _.throttle(function() {
        edisonAPI.product.save($scope.pl).then(function() {
            //  LxNotificationService.success("Les produits on été mis a jour");
        })
    }, 500)

    $scope.$watch('pl', function(curr, prev) {
        if (curr && prev && !_.isEqual(prev, curr)) {
            save()
        }
    }, true)


}
angular.module('edison').controller('editProducts', editProducts);
