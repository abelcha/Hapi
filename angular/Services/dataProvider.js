angular.module('edison').factory('dataProvider', ['$timeout', 'socket', '$rootScope', function($timeout, socket, $rootScope) {



  var dataProvider = function() {
    var _this = this;
    socket.on('interventionListChange', function(data) {
      _this.updateInterventionList(data);
    });
  }
  dataProvider.prototype.setInterventionList = function(data) {
    this.interventionList = data;
  };

  dataProvider.prototype.updateInterventionList = function(data) {
    var _this = this;
    if (this.interventionList) {
      var index = this.interventionList.findIndex(function(e) {
        return e.id === data.id
      })
      _this.interventionList[index] = data;
      console.log("interchange")
      $rootScope.$broadcast('InterventionListChange');
    }
  }

  dataProvider.prototype.getInterventionList = function() {
    return this.interventionList;
  }

  return new dataProvider;

}]);
