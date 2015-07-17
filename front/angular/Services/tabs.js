angular.module('edison').factory('tabContainer', ['$location', '$window', '$q', 'edisonAPI', function($location, $window, $q, edisonAPI) {
    "use strict";
    var Tab = function(args, options, prevTab) {

        if (typeof args === 'object') {
            //copy constructor
            _.each(args, function(e, k) {
                this[k] = e;
            })
        } else {
            this.prevTab = prevTab ||  {}
            this.urlFilter = options.urlFilter
            this.hash = options.hash
            this.url = args;
            this.fullUrl = this.url + ['', $.param(this.urlFilter)].join(_.isEmpty(this.urlFilter) ? '' : '?') + (this.hash ? '#' + this.hash : '')
            this.title = '';
            this.position = null;
            this.deleted = false;
            this._timestamp = Date.now();
        }
    }

    Tab.prototype.setData = function(data) {
        //slice create a copy
        this.data = data;
    }

    Tab.prototype.setTitle = function(title, subTitle) {
        this.title = title;
    }

    var TabContainer = function() {
        this._tabs = [];
        this.selectedTab = 0;
    }

    TabContainer.prototype.loadSessionTabs = function(currentUrl) {
        var _this = this;

        return $q(function(resolve, reject) {
            var currentUrlInSessionTabs = false;
            edisonAPI.request({
                fn: "getSessionData",
            }).then(function(result) {
                _this.selectedTab = result.data.selectedTab;
                for (var i = 0; i < result.data._tabs.length; i++) {
                    _this._tabs.push(new Tab(result.data._tabs[i]))
                    if (result.data._tabs[i].url === currentUrl) {
                        _this.selectedTab = i;
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

    TabContainer.prototype.createTab = function(url, options) {
        var tab = new Tab(url, options, this.getCurrentTab());
        tab.position = this._tabs.length;
        this._tabs.push(tab);
        return (tab);
    }

    TabContainer.prototype.isOpen = function(url, options) {
        var index = _.findIndex(this._tabs, function(e) {
            return !e.deleted && e.url === url &&
                (!options.hash && !e.hash || options.hash == e.hash) &&
                _.isEqual(options.urlFilter, e.urlFilter)
        });
        return (index >= 0);
    };

    TabContainer.prototype.getTab = function(url, options) {

        return _.find(this._tabs, function(e) {
            return !e.deleted && e.url === url &&
                (!options.hash && !e.hash || options.hash == e.hash) &&
                _.isEqual(options.urlFilter, e.urlFilter)
        });
    };

    TabContainer.prototype.getTabSimple = function(url, options) {

        return _.find(this._tabs, function(e) {
            return !e.deleted && e.url.split('/')[1] === url.split('/')[1]
        });
    };

    TabContainer.prototype.len = function() {
        var size = 0;

        this._tabs.forEach(function(e) {
            size += !e.deleted;
        })
        return (size);
    }

    TabContainer.prototype.getPrevTab = function(tab) {

        for (var i = tab.position - 1; i >= 0; i--) {
            if (this._tabs[i].deleted === false)
                return (this._tabs[i]);
        }
    };

    TabContainer.prototype.close= function(tab) {
        if (this.len() > 1) {
            console.log("multiple tabs")
            if (this.remove(tab)) {
                $location.url(tab.prevTab.fullUrl ||  '/intervention/list')
            }
        } else {
            console.log("only tab")
            $location.url(tab.prevTab.fullUrl ||  '/intervention/list');
            this.noClose = true;
            //this.remove(tab);
        }
    }

    TabContainer.prototype.remove = function(tab) {
        var newTabs = [];
        var j = 0;

        if (this._tabs.length <= 1) {
            return false;
        }
        var reload = (this.selectedTab === tab.position);
        for (var i = 0; i < this._tabs.length; i++) {
            if (i !== tab.position) {
                newTabs.push(this._tabs[i]);
                newTabs[j].position = j;
                ++j;
            }
        }
        this._tabs = newTabs;

        if (this.selectedTab === tab.position && this.selectedTab !== 0) {
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
        if (this.noClose) {
            tab = this._tabs[0]
        }
        else if ((_.startsWith(url, '/search')  || _.startsWith(url, '/artisan/contact')) && this.getTabSimple(url)) {
            tab = this.getTabSimple(url);
        }
        else if (this.noClose || this.isOpen(url, options)) {
            tab = this.getTab(url, options)
        } else {
            tab = this.createTab(url, options);
        }
        this.noClose = false;
        if (!(options && options.setFocus === false)) {
            this.setFocus(tab)
        }
        if (options && options.title) {
            tab.setTitle(options.title);
        }
    }

    return (new TabContainer());

}]);
