angular.module('edison').factory('Tab', function() {


    var Tab = function(container, location) {
        this.container = container;
        this.title = "...";
        this.path = location.path();
        this.url = location.path().split('/').slice(1)
        this.model = this.url[0]
        this.route = this.url[1]
        this.hash = location.hash();
        this.title = this.url[this.url.length - 1]
        this.date = new Date;
    }
    Tab.prototype.setTitle = function(title) {
        this.title = title
        return this;
    };

    Tab.prototype.close = function() {
        this.container.close(this);
    }

    Tab.prototype.setData = function(data) {
        this.data = data;
        return this;
    };
    return Tab;

})

angular.module('edison').factory('TabContainer', function(Tab, $location) {
    "use strict";

    var TabContainer = {
        __tabs: [],
        __ordered: {}
    }


    TabContainer.find = function(location) {
        var cmp = new Tab(this, location)
        return _.find(this.__tabs, function(e) {
            if (e.route === 'list' && cmp.route === 'list') {
                return cmp.model === e.model
            }
            return e.path == location.path() && e.hash == location.hash()
        })
    }

    TabContainer.ordered = function() {
        return this.__ordered;
    }
    TabContainer.close = function(tab) {
        var index = _.findIndex(this.__tabs, function(e) {
            return e.path == tab.path && e.hash == location.hash
        })
        this.__tabs.splice(index, 1);
        $location.url('/intervention/list');
    }



    TabContainer.add = function(location) {
        var tab = this.find(location);
        if (!tab) {
            this.selectedTab = new Tab(this, location);
            this.__tabs.push(this.selectedTab)
        } else {
            this.selectedTab = tab
        }
        return this;
    }

    TabContainer.getCurrentTab = function() {
        return this.selectedTab;
    }
    TabContainer.order = function() {
        var _this = this;
        var models = ["intervention", "artisan", "devis", 'tools', 'compta'];
        var tmp = {};
        _.each(_this.__tabs, function(e) {
            if (_.includes(models, e.model) && e.url[1] !== 'list' && e.url[1] !== 'contact') {
                var dest =  _.endsWith(e.model, 's') ? e.model : e.model + 's';
            } else {
                dest = 'Recents';
            }
            tmp[dest] = tmp[dest] || {
                title: dest,
                tabs: []
            };
            tmp[dest].tabs.push(e)
        })
        this.__ordered = tmp
        return this;
    }
    TabContainer.getOrdered = function() {
        return this.__ordered;
    }


    return TabContainer

});
