angular.module('edison').factory('dialog', ['$mdDialog', 'edisonAPI', function($mdDialog, edisonAPI) {


  return {
    absence: {
      open: function(id, cb) {
        $mdDialog.show({
          controller: function DialogController($scope, $mdDialog) {
            $scope.absenceTime = 'TODAY';
            $scope.absence = [{
              title: 'Toute la journée',
              value: 'TODAY'
            }, {
              title: '1 Heure',
              value: '1'
            }, {
              title: '2 Heure',
              value: '2'
            }, {
              title: '3 Heure',
              value: '3'
            }, {
              title: '4 Heure',
              value: '4'
            }]
            $scope.hide = function() {
              $mdDialog.hide();
            };
            $scope.cancel = function() {
              $mdDialog.cancel();
            };
            $scope.answer = function(answer) {
              $mdDialog.hide(answer);
              var hours = 0;
              if (answer === "TODAY") {
                hours = 23 - (new Date).getHours() + 1;
              } else {
                hours = parseInt(answer);
              }
              start = new Date;
              end = new Date;
              end.setHours(end.getHours() + hours)
              edisonAPI.absenceArtisan(id, {
                start: start,
                end: end
              }).success(cb)
            };
          },
          templateUrl: '/Pages/Intervention/dialogs/absence.html',
        });
      }
    }
  }

}]);
