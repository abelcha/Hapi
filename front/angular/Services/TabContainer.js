angular.module('edison').factory('TabContainer', function($location, $window, $q, edisonAPI) {
    "use strict";


    var Tab = function(url, title, hash) {

        this.url = url;
        this.hash = hash;
        this.title = title;
    }

    Tab.setTitle = function(title) {
        this.title = title;
    }


    var TabContainer = function() {
        if (!(this instanceof TabContainer)) {
            return new TabContainer();
        }
    }

    TabContainer.prototype.init = function() {
        this.add($location.path(), "...", $location.path(), $location.hash())
    }

    TabContainer.prototype.selectedIndex = 0;
    
    TabContainer.prototype.add = function(url, title, hash) {
        var tab = new Tab(url, title, hash);
        this.tabs.push(tab);
        console.log(tab)
    }


    TabContainer.prototype.tabs = [];

    TabContainer.prototype.getTab = function(tab) {
        _.each(this.tabs, function(e) {
            console.log(e, tab)
        })
    }
    TabContainer.prototype.getCurrentTab = function() {
        return this.getTab(this.tab[this.selectedIndex])
    }

    TabContainer.prototype.open = function(url, hash) {
        var _this = this;
    }

    return TabContainer

});
