angular.module('edison').factory('dataProvider', ['socket', '$rootScope', 'config', function(socket, $rootScope, config) {
    "use strict";
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
        console.time("interFilter")
        this.interventionListFiltered = this.interventionList;
        if (this.interventionList && params) {
            var filterParam = config.filters().get({
                url: params.fltr
            });
            if (params.fltr && filterParam || !params.fltr && hash) {
                this.interventionListFiltered = _.filter(this.interventionList, function(e) {
                    return (!params.fltr || e.fltr[filterParam.short_name]) &&
                        (!hash || e.t === hash) &&
                        ((!params.d) || (e.fltr.d && e.fltr.d[params.d]))
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

    return new dataProvider();

}]);
