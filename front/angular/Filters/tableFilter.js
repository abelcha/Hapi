angular.module("edison").filter('tableFilter', ['config', function(config) {
    "use strict";

    var clean = function(str) {
        return _.deburr(str).toLowerCase();
    }

    var compare = function(a, b, strictMode) {
        if (typeof a === "string") {
            return clean(a).includes(b);
        } else if (!strictMode) {
            return clean(String(a)).startsWith(b);
        } else {
            return a === parseInt(b);
        }
    }
    var compareCustom = function(key, data, input) {
        if (key === '_categorie') {
            var cell = config.categoriesHash()[data.c].long_name;
            return compare(cell, input);
        }
        if (key === '_etat') {
            var cell = config.etatsHash()[data.s].long_name
            return compare(cell, input);
        }
        return true;

    }
    var compareDate = function(key, data, input) {
        var md = (data[key] + 1370000000) * 1000;
        //console.log( input.start, input.end);
        if (md > input.start.getTime() && md < input.end.getTime()) {
            return true
        }
        return false;
    }

    var parseDate = function(e) {
        if (!(/^[0-9\/]+$/).test(e) ||  _.endsWith(e, '/')) {
            return undefined;
        }
        var x = e.split('/');
        if (x.length === 1) {
            var month = parseInt(x[0]);
            return {
                start: new Date(2015, month - 1),
                end: new Date(2015, month)
            }
        } else if (x.length === 2)  {
            var day = parseInt(x[0]);
            var month = parseInt(x[1]);
            return {
                start: new Date(2015, month - 1, day),
                end: new Date(2015, month - 1, day + 1)
            }
        }
        return undefined;
    }


    return function(dataContainer, inputs, strictMode) {
        var rtn = [];
        //console.time('fltr')
        inputs = _.mapValues(inputs, clean);
        _.each(inputs, function(e, k) {
            if (k.charAt(0) === '∆') {
                inputs[k] = parseDate(e);
            }
        })
        _.each(dataContainer, function(data) {
                if (data.id) {
                    var psh = true;
                    _.each(inputs, function(input, k) {
                        if (input && _.size(input) > 0) {
                            if (k.charAt(0) === '_') {
                                if (!compareCustom(k, data, input)) {
                                    psh = false;
                                    return false
                                }
                            } else if (k.charAt(0) === '∆') {
                                if (!compareDate(k.slice(1), data, input)) {
                                    psh = false;
                                    return false
                                }
                            } else {
                                if (!compare(data[k], input, strictMode)) {
                                    psh = false;
                                    return false
                                }
                            }
                        }
                    });
                    if (psh === true) {
                        rtn.push(data);
                    }
                }
            })
            //console.timeEnd('fltr')

        return rtn;
    }
}]);
