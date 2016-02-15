var CommissionsController = function(MomentIterator, TabContainer, $routeParams, edisonAPI, $rootScope, $scope, $location, LxProgressService, socket) {
    "use strict";

    // harald - Grand Compte - 1 janvier 2016 => 2%

    var _this = this;
    _this.tab = TabContainer.getCurrentTab();
    _this.tab.setTitle('Coms.');

    _this.xcalc = function(e) {
        if ((new Date(e.date.ajout)).getFullYear() >= 2016 && e.facture && e.facture.payeur === 'GRN' && e.login.ajout === 'harald_x' ) {
          e.exception1 = true
          return _.round((e.compta.reglement.montant || e.compta.paiement.base || e.prixFinal) * 0.02, 2);
        }
        if ((new Date(e.date.ajout)).getFullYear() >= 2016 && e.categorie === 'VT' && (e.login.ajout === 'maxime_s' || e.login.ajout === 'gregoire_e') ) {
          e.exception2 = true
          console.log('-->', e)
          return _.round((e.compta.reglement.montant || e.compta.paiement.base || e.prixFinal) * 0.005, 2);
        }
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
    var end = new Date();
    var start = new Date(2013, 8, 1)
    _this.dateSelect = MomentIterator(start, end).range('month').map(function(e) {
        return {
            t:e.format('MMM YYYY'),
            m:e.month() + 1,
            y:e.year(),
        }
    }).reverse()

    var dateTarget = _.pick(_this.dateSelect[0], 'm', 'y');
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
    })
    if ($location.search().m)  {
        dateTarget.m = parseInt($location.search().m)
    }
    if ($location.search().y)  {
        dateTarget.y = parseInt($location.search().y)
    }
    $scope.selectedDate = _.find(_this.dateSelect, dateTarget)
}
angular.module('edison').controller('CommissionsController', CommissionsController);
