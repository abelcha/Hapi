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
        this.constructor.prototype.data = data;
    };

    DataProvider.prototype.applyCustomFilter = function() {

    }


    DataProvider.prototype.rowFilterFactory = function(filter, hash) {
        if (!filter && hash) {
            return function onlyLogin(inter) {
                return inter.t === hash;
            }
        }
        if (filter && hash) {
            return function loginAndFilter(inter) {
                return inter.fltr[filter.short_name] === 1 && inter.t === hash;
            }
        }
        if (filter && !hash) {
            return function onlyFilter(inter) {
                return inter.fltr[filter.short_name] === 1;
            }
        }
    }

    DataProvider.prototype.applyFilter = function(filter, hash) {
        console.time("interFilter")
        this.filteredData = this.data;
        if (this.data && (filter || hash)) {
            var filterFunction = this.rowFilterFactory(filter, hash)
            this.filteredData = _.filter(this.data, filterFunction);
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
