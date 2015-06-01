angular.module('edison').factory('tabContainer', ['$location', '$window', '$q', 'edisonAPI', '_', function($location, $window, $q, edisonAPI, _) {

    var Tab = function(args) {

        if (typeof args === 'object') {
            //copy constructor
            for (var k in args) {
                this[k] = args[k];
            }
        } else {
            this.url = args;
            this.title = '';
            this.position = null;
            this.deleted = false;
            this._timestamp = Date.now();
        }
    }

    Tab.prototype.setData = function(data) {
        //slice create a copy
        this._data = JSON.parse(JSON.stringify(data));
        this.data = JSON.parse(JSON.stringify(data));
    }

    Tab.prototype.setTitle = function(title, subTitle) {
        this.title = title;
        this.subTitle = subTitle
    }

    var TabContainer = function() {

        var self = this;
        this._tabs = [];
        this.selectedTab = 0;
    }

    TabContainer.prototype.loadSessionTabs = function(currentUrl) {
        var self = this;

        return $q(function(resolve, reject) {
            var currentUrlInSessionTabs = false;
            edisonAPI.request({
                fn: "getSessionData",
            }).then(function(result) {
                self.selectedTab = result.data.selectedTab;
                for (var i = 0; i < result.data._tabs.length; i++) {
                    self._tabs.push(new Tab(result.data._tabs[i]))
                    if (result.data._tabs[i].url === currentUrl) {
                        self.selectedTab = i;
                        currentUrlInSessionTabs = true;
                    }
                }
                if (!currentUrlInSessionTabs) {
                    return reject();
                }
                return resolve();
            }).catch(reject);

        })

    }

    TabContainer.prototype.setFocus = function(tab) {
        this.selectedTab = (typeof tab === 'number' ? tab : tab.position);
    };

    TabContainer.prototype.createTab = function(url, title) {
        var tab = new Tab(url);

        tab.position = this._tabs.length;
        this._tabs.push(tab);
        return (tab);
    }

    TabContainer.prototype.isOpen = function(url) {
        var index = _.findIndex(this._tabs, function(e) {
            return ((!e.deleted && e.url === url));
        });
        return (index >= 0);
    };

    TabContainer.prototype.getTab = function(url) {

        return _.find(this._tabs, function(e) {
            return ((!e.deleted && e.url === url));
        });
    };

    TabContainer.prototype.len = function() {
        var size = 0;

        this._tabs.forEach(function(e, i) {
            size += !e.deleted;
        })
        return (size);
    }

    TabContainer.prototype.getPrevTab = function(tab) {

        for (var i = tab.position - 1; i >= 0; i--) {
            if (this._tabs[i].deleted == false)
                return (this._tabs[i]);
        };

    };

    TabContainer.prototype.remove = function(tab) {
        var newTabs = [];
        var j = 0;

        if (this._tabs.length <= 1) {
            return false;
        }
        var reload = (this.selectedTab == tab.position);
        for (var i = 0; i < this._tabs.length; i++) {
            if (i != tab.position) {
                newTabs.push(this._tabs[i]);
                newTabs[j].position = j;
                ++j;
            }
        };
        this._tabs = newTabs;

        if (this.selectedTab == tab.position && this.selectedTab != 0) {
            this.selectedTab--;
        }
        if (this.selectedTab > tab.position) {
            this.selectedTab--;
        }
        return (reload);
    }

    TabContainer.prototype.getCurrentTab = function() {
        return this._tabs[this.selectedTab];
    }
    TabContainer.prototype.addTab = function(url, options) {
        var tab;
        if (!this.isOpen(url)) {
            tab = this.createTab(url);
        } else {
            tab = this.getTab(url)
        }
        if (!(options && options.setFocus === false)) {
            this.setFocus(tab)
        }
        if (options && options.title) {
            tab.setTitle(options.title);
        }
    }

    return (new TabContainer);

}]);
