angular.module('edison').factory('DataProvider', ['socket', '$rootScope', 'config', function(socket, $rootScope, config) {
    "use strict";
    var DataProvider = function(model) {
        var _this = this;
        this.model = model;
        socket.on(this.model + 'ListChange', function(data) {
            _this.updateData(data);

        });
    }

    this.constructor.prototype.data = {};

    DataProvider.prototype.setData = function(data) {
        this.constructor.prototype.data[this.model] = data;
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
                return inter.fltr && inter.fltr[filter.short_name] === 1 && inter.t === hash;
            }
        }
        if (filter && !hash) {
            return function onlyFilter(inter) {
                return inter.fltr && inter.fltr[filter.short_name] === 1;
            }
        }
    }

    DataProvider.prototype.applyFilter = function(filter, hash) {
        console.time("interFilter")
        this.filteredData = this.getData();
        if (this.getData() && (filter || hash)) {
            var filterFunction = this.rowFilterFactory(filter, hash)
            this.filteredData = _.filter(this.getData(), filterFunction);
        }
        console.timeEnd("interFilter")

    }

    DataProvider.prototype.updateData = function(newRow) {
        var _this = this;
        if (this.getData()) {
            var index = _.findIndex(this.getData(), function(e) {
                return e.id === newRow.id
            });
            if (index === -1) {
                _this.getData().unshift(newRow)
            } else {
                _this.getData()[index] = newRow;
            }
            $rootScope.$broadcast(_this.model + 'ListChange');
        }
    }

    DataProvider.prototype.getData = function() {
        return this.data[this.model];
    }

    return DataProvider;

}]);
