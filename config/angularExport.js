angular.module('browserify', [])
    .factory('config', [function() {
        "use strict";
        var config = require("./dataList.js")
        config.filters = require('./FiltersFactory');
        return config;

    }])
    .factory('textTemplate', [function() {
        return require('./textTemplate.js')
    }])
