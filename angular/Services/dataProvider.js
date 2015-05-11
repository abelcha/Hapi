angular.module('edison').factory('dataProvider', ['socket', '$rootScope', 'config', '_', function(socket, $rootScope, config, _) {

  var dataProvider = function() {
    var _this = this;
    socket.on('interventionListChange', function(data) {
      _this.updateInterventionList(data);
    });
  }
  dataProvider.prototype.setInterventionList = function(data) {
    this.interventionList = data;
  };

  dataProvider.prototype.refreshInterventionListFilter = function(fltr) {
    var _this = this;
    if (this.interventionList && fltr && fltr !== 'all' && config.filters[fltr]) {
      this.interventionListFiltered = _.filter(this.interventionList, function(e) {
        return e.fltr[config.filters[fltr].short];
      })
    } else {
      this.interventionListFiltered = this.interventionList;
    }
  }

  dataProvider.prototype.updateInterventionList = function(data) {
    var _this = this;
    if (this.interventionList) {
      var index = _.findIndex(this.interventionList, function(e) {
        return e.id === data.id
      });
      _this.interventionList[index] = data;
      $rootScope.$broadcast('InterventionListChange');
    }
  }

  dataProvider.prototype.getInterventionList = function() {
    return this.interventionList;
  }

  return new dataProvider;

}]);
