var CommissionsController = function(DateSelect, TabContainer, $routeParams, edisonAPI, $rootScope, $scope, $location, LxProgressService, socket) {
    "use strict";
    var _this = this;
    _this.tab = TabContainer.getCurrentTab();
    _this.tab.setTitle('Coms.');

    _this.xcalc = function(e) {
        return e.categorie === 'VT' ? 1.5 : _.round((e.compta.reglement.montant || e.compta.paiement.base || e.prixFinal) * 0.01, 2);
    }

    _this.getTotal = function() {
        var rtn = {
            com: 0,
            all: 0
        }
        _.each($scope.list, function(x) {
            rtn.com += _this.xcalc(x);
            rtn.all += x.compta.reglement.montant || 0
        })
        return rtn;
    }

    var dateSelect = new DateSelect;

    $scope.usrs = _.filter(window.app_users, 'service', 'INTERVENTION');

    $scope.selectedUser = $location.search().l ||  $scope.usrs[0].login

    var actualise = _.debounce(function() {
        LxProgressService.circular.show('#5fa2db', '#globalProgress');

        edisonAPI.intervention.commissions(_.merge($scope.selectedDate, {
            l: $scope.selectedUser
        })).then(function(resp) {
            LxProgressService.circular.hide();
            $scope.list = resp.data
            $scope.total = _this.getTotal()
        })
    }, 50)
    $scope.$watch("selectedUser", function(curr, prev) {
        $location.search('l', curr);
        actualise();
        /* */
    })
    $scope.$watch("selectedDate", function(curr, prev) {
        $location.search('m', curr.m);
        $location.search('y', curr.y);
        actualise();
        /* $location.search('m', curr.m);
         $location.search('y', curr.y);
         edisonAPI.intervention.commissions(curr).then(function(resp) {
             console.log('==>', resp.data)
         })*/
    })
    if ($location.search().m)  {
        dateSelect.current.m = parseInt($location.search().m)
    }
    if ($location.search().y)  {
        dateSelect.current.y = parseInt($location.search().y)
    }
    _this.dateSelect = dateSelect.list()
    $scope.selectedDate = _.find(dateSelect.list(), dateSelect.current)
}
angular.module('edison').controller('CommissionsController', CommissionsController);
