angular.module('edison').factory('DataProvider', ['socket', '$rootScope', 'config', function(socket, $rootScope, config) {
    "use strict";
    var DataProvider = function(model) {
        var _this = this;
        this.model = model;
        socket.on(this.model + 'ListChange', function(data) {
            _this.updateData(data);
        });
    }
    DataProvider.prototype.setData = function(data) {
        this.data = data;
    };

    DataProvider.prototype.refreshFilters = function(params, hash) {
        console.time("interFilter")
        this.filteredData = this.data;
        if (this.data && params) {
            var filterParam = config.filters().get({
                url: params.fltr
            });
            if (params.fltr && filterParam || !params.fltr && hash) {
                this.filteredData = _.filter(this.data, function(e) {
                    return (!params.fltr || e.fltr[filterParam.short_name]) &&
                        (!hash || e.t === hash) &&
                        ((!params.d) || (e.fltr.d && e.fltr.d[params.d]))
                })
            } else if (params.artisanID) {
                var artisanID = parseInt(params.artisanID);
                this.filteredData = _.filter(this.data, function(e) {
                    return e.ai === artisanID;
                })
            }
        }
        console.timeEnd("interFilter")

    }

    DataProvider.prototype.updateData = function(newRow) {
        var _this = this;
        if (this.data) {
            var index = _.findIndex(this.data, function(e) {
                return e.id === newRow.id
            });
            if (index === -1) {
                _this.data.unshift(newRow)
            } else {
                _this.data[index] = newRow;
            }
            $rootScope.$broadcast(_this.model + 'ListChange');
        }
    }

    DataProvider.prototype.getData = function() {
        return this.data;
    }

    return DataProvider;

}]);
