angular.module('browserify', [])
    .factory('config', [function() {
        "use strict";
        var config = require("./dataList.js")
        return config;
    }])
    .factory('contextMenuData', [function() {
        return require('./contextMenuData.js')
    }])
    .factory('textTemplate', [function() {
        return require('./textTemplate.js')
    }])
    .factory('FiltersFactory', [function() {
        return require('./FiltersFactory');
    }])
    .factory('Paiement', [function() {
        return require('./Paiement');
    }])
    .factory('FlushList', [function() {
        return require('./FlushList');
    }])
    .factory('Description', [function() {
        return require('./Description');
    }])
    .factory('MomentIterator', [function() {
        return require('moment-iterator');
    }])
    .factory('IBAN', [function() {
        return require('iban');
    }])