angular.module('edison').factory('DateSelect', function() {
    "use strict";
    var DateSelect = function() {

        var _this = this;
        var d = new Date();
        _this.start = {
            m: 9,
            y: 2013
        }
        _this.current = {
            m: d.getMonth() + 1,
            y: d.getFullYear()
        }

        var frenchMonths = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Aout', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
        _this._list = [];
        _.times(_this.current.y - _this.start.y + 1, function(yr) {
            _.times(12, function(mth) {
                _this._list.push({
                    m: mth + 1,
                    y: _this.start.y + yr,
                    t: frenchMonths[mth] + ' ' + (_this.start.y + yr)
                })
            })
        })
        _this._list.splice(_this.current.m - 12)
    }
    DateSelect.prototype.list = function() {
        return this._list;
    }
    return DateSelect;
});
