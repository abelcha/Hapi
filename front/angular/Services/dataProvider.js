angular.module('edison').factory('DataProvider', function($timeout, edisonAPI, socket, $rootScope, config) {
    "use strict";
    var DataProvider = function(model, hashModel) {
        var _this = this;
        this.model = model;
        this.hashModel = hashModel || 't';
        this.rand = new Date
        socket.on(_this.socketListChange(), function(change) {
            if (_this.appliedList.indexOf(change.ts) === -1) {
                _this.appliedList.push(change.ts)
                _this.updateData(change.data);
            }
        });
    }

    DataProvider.prototype.socketListChange = function() {
        var _this = this;
        return _this.model.toUpperCase() + '_CACHE_LIST_CHANGE';
    }
    DataProvider.prototype.appliedList = [];

    DataProvider.prototype.data = {}

    DataProvider.prototype.trie = {}

    DataProvider.prototype.setData = function(data) {
        var _this = this;
        this.data[this.model] = data;
        _this.trie[this.model] = {};
        _.each(data, function(e) {
            _this.getTrie()[e.id] = e;
        })
    };

    DataProvider.prototype.init = function(cb) {
        var _this = this;
        if (_this.getData())
            return cb(_this.getData());
        edisonAPI[_this.model].list({
            cache: true
        }).success(function(resp) {
            _this.setData(resp);
            return cb(null, resp);
        })
    }

    DataProvider.prototype.rowFilterFactory = function(filter, hash) {
        var _this = this;
        if (!filter && hash) {
            return function onlyLogin(inter) {
                return inter[_this.hashModel] === hash;
            }
        }
        if (filter && hash) {
            return function loginAndFilter(inter) {
                return inter.f && inter.f[filter.short_name] === 1 && inter[_this.hashModel] === hash;
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
    }

    DataProvider.prototype.flash = function(row) {
        row.flash = true;
        $timeout(function() {
            row.flash = false;
        }, 1000)
    }

    DataProvider.prototype.updateData = function(newRows) {
        var _this = this;
        if (this.getData()) {
            _.each(newRows, function(e) {
                var tmp = _this.getTrie()[e.id];
                if (tmp) {
                    _.merge(_this.getTrie()[e.id], e);
                } else {
                    _this.getData().unshift(e);
                    _this.getTrie()[e.id] = e;
                }
            })

            $rootScope.$broadcast(_this.socketListChange());
        }

    }

    DataProvider.prototype.getData = function() {
        return this.data[this.model];
    }
    DataProvider.prototype.getTrie = function() {
        return this.trie[this.model];
    }

    DataProvider.prototype.isInit = function() {
        return this.model && this.data && this.data[this.model];
    }
    return DataProvider;

});
