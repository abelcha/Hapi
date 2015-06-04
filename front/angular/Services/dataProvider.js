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

    dataProvider.prototype.refreshInterventionListFilter = function(params, hash) {
        var _this = this;
        console.time("interFilter")
        this.interventionListFiltered = this.interventionList;
        if (this.interventionList && params) {
            if (params.fltr && config.filters[params.fltr] || !params.fltr && hash) {
                this.interventionListFiltered = _.filter(this.interventionList, function(e) {
                    return (!params.fltr || e.fltr[config.filters[params.fltr].short]) &&
                    (!hash || e.t === hash) &&
                    (!params.d || e.fltr.d[params.d])
                })
            } else if (params.artisanID) {
                var artisanID = parseInt(params.artisanID);
                this.interventionListFiltered = _.filter(this.interventionList, function(e) {
                    return e.ai === artisanID;
                })
            }
        }
        console.timeEnd("interFilter")

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
