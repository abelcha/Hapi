angular.module('edison').factory('ContextMenu', function($rootScope, $location, edisonAPI, $window, $timeout, dialog, Devis, Intervention, Artisan, contextMenuData) {
    "use strict";

    var ContextMenu = function(model) {
        var _this = this;
        this.model = model
        this.list = contextMenuData[model];
        $rootScope.$on('closeContextMenu', function() {
            return _this.active && _this.close();
        })
        this.style = {
            left: 0,
            top: 0,
            display: "none"
        }
    }

    ContextMenu.prototype.openSub = function(delay) {
        var _this = this
        this.openSubTimeout = $timeout(function() {
            _this.mouseOverCM = true
        }, delay || 0)

    }

    ContextMenu.prototype.closeSub = function() {
        if (this.openSubTimeout) {
            $timeout.cancel(this.openSubTimeout);
        }
        this.mouseOverCM = false
    }

    ContextMenu.prototype.getData = function() {
        return this.data;
    }
    ContextMenu.prototype.setData = function(data) {
        this.data = data;
    }

    ContextMenu.prototype.setPosition = function(x, y) {
        this.style.left = (x - $('#main-menu-inner').width()) - 4;
        this.style.top = y - 48;
    }

    ContextMenu.prototype.active = false;

    ContextMenu.prototype.open = function() {
        var _this = this;
        this.closeSub()
        this.list.forEach(function(e) {
            if (e.subs) {
                _.each(e.subs, function(sub) {
                    sub.hidden = sub.hide && sub.hide(_this.data);
                })
            } else {
                e.hidden = e.hide && e.hide(_this.data);
            }
        });
        this.style.display = "block";
        this.active = true;
    }

    ContextMenu.prototype.close = function() {
        this.style.display = "none";
        this.active = false;

    }

    ContextMenu.prototype.modelObject = {
        intervention: Intervention,
        devis: Devis,
        artisan: Artisan
    }

    ContextMenu.prototype.click = function(link) {
        if (typeof link.action === 'function') {
            return link.action(this.getData())
        } else if (typeof link.action === 'string') {
            console.log(this.data);
            return this.modelObject[this.model]()[link.action].bind(this.data)();
        } else {
            console.error("error here")
        }
    }


    return ContextMenu

});
