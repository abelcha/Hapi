var DateSelect = function(dateStart) {
    var _ = require('lodash')
    var _this = this;
    var d = new Date();
    _this.start = {
        m: !dateStart ? 9 : dateStart.getMonth() + 1,
        y: !dateStart ? 2013 : dateStart.getFullYear()
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
                t: frenchMonths[mth] + ' ' + (_this.start.y + yr),
                o: (_this.start.y + yr) + (mth + 1) * 0.01
            })
        })
    })
    _this._list.splice(_this.current.m - 12)
    return this._list;
}
module.exports = DateSelect;
