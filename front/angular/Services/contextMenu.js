angular.module('edison').factory('ContextMenu', function($rootScope, $location, edisonAPI, $window, dialog, Devis, Intervention, Artisan, contextMenuData) {
    "use strict";

    var ContextMenu = function(model) {
        var _this = this;
        this.model = model
        this.list = contextMenuData[model];
        $rootScope.$on('closeContextMenu', function() {
            return _this.active && _this.close();
        })
    }

    ContextMenu.prototype.getData = function() {
        return this.data;
    }
    ContextMenu.prototype.setData = function(data) {
        this.data = data;
    }

    ContextMenu.prototype.setPosition = function(x, y) {
        this.style.left = (x - $('#main-menu-inner').width());
        this.style.top = y;
    }

    ContextMenu.prototype.active = false;

    ContextMenu.prototype.open = function() {
        var _this = this;
        this.list.forEach(function(e) {
            e.hidden = e.hide && e.hide(_this.data);
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
            return this.modelObject[this.model]()[link.action].bind(this.data)();
        } else {
            console.error("error here")
        }
    }

    ContextMenu.prototype.style = {
        left: 0,
        top: 0,
        display: "none"
    }

    return ContextMenu

});
