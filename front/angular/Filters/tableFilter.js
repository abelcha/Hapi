angular.module("edison").filter('tableFilter', ['config', function(config) {
    "use strict";

    var clean = function(str) {
        return _.deburr(str).toLowerCase();
    }

    var compare = function(a, b) {
        if (typeof a === "string") {
            return clean(a).includes(b);
        } else {
            return clean(String(a)).startsWith(b);
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
        /*        if (key === '_categorie') {
                    console.log("yaycat")
                    return 'Plomberie'
                }
                console.log(cellData);
                return cellData*/
    }

    return function(dataContainer, inputs, sec) {
        var rtn = [];
        console.time('fltr')
        inputs = _.mapValues(inputs, clean);
        _.each(dataContainer, function(data) {
            if (data.id) {
                var psh = true;
                _.each(inputs, function(input, k) {
                    if (input && input.length > 0) {
                        if (k.charAt(0) === '_') {
                            if (!compareCustom(k, data, input)) {
                                psh = false;
                                return false
                            }
                        } else {
                            if (!compare(data[k], input)) {
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
        console.timeEnd('fltr')

        return rtn;
    }
}]);
