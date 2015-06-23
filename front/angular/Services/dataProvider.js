angular.module('edison').factory('DataProvider', ['socket', '$rootScope', 'config', function(socket, $rootScope, config) {
    "use strict";
    var DataProvider = function(model) {
        var _this = this;
        this.model = model;
        socket.on(this.model + 'ListChange', function(data) {
            console.log('listchange')
            _this.updateData(data);

        });
    }

    DataProvider.prototype.data = {}

    DataProvider.prototype.setData = function(data) {
        this.data[this.model] = data;
    };


    DataProvider.prototype.rowFilterFactory = function(filter, hash) {
        if (!filter && hash) {
            return function onlyLogin(inter) {
                return inter.t === hash;
            }
        }
        if (filter && hash) {
            return function loginAndFilter(inter) {
                return inter.f && inter.f[filter.short_name] === 1 && inter.t === hash;
            }
        }
        if (filter && !hash) {
            return function onlyFilter(inter) {
                return inter.f && inter.f[filter.short_name] === 1;
            }
        }
    }

    DataProvider.prototype.applyFilter = function(filter, hash, customFilter) {
        this.filteredData = this.getData();
        if (this.getData() && (filter || hash || customFilter)) {
            this.filteredData = _.filter(this.getData(), customFilter || this.rowFilterFactory(filter, hash));
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


    DataProvider.prototype.isInit = function() {
        return this.model && this.data && this.data[this.model];
    }
    return DataProvider;

}]);
