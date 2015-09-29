angular.module('edison').factory('DataProvider',function($timeout, edisonAPI, socket, $rootScope, config) {
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

    DataProvider.prototype.setData = function(data) {
        this.data[this.model] = data;
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
            var id_list = _(newRows).flatten().map('id').value();
            for (var i = 0; i < _this.getData().length && id_list.length; i++) {
                var pos = id_list.indexOf(_this.getData()[i].id)
                if (pos >= 0) {
                    console.log('UPDATE DATA')
                    _.merge(_this.getData()[i], newRows[pos]);
                  //  _this.flash(newRows[pos])
                    id_list.splice(pos, 1);
                }
            };
            if (id_list.length) {
                console.log('lol')
                var z = _.filter(newRows, function(e) {
                    return _.includes(id_list, e.id);
                })
                _.each(z, function(x) {
                    console.log('NEW DATA')
                    _this.getData().unshift(x)
                })
            }
            $rootScope.$broadcast(_this.socketListChange());
        }

    }

    DataProvider.prototype.getData = function() {
        return this.data[this.model];
    }


    DataProvider.prototype.isInit = function() {
        return this.model && this.data && this.data[this.model];
    }
    return DataProvider;

});
