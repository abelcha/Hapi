angular.module('edison').factory('contextMenu', ['$location', 'edisonAPI', '$window', 'dialog','Intervention', function($location, edisonAPI, $window, dialog, Intervention) {
    "use strict";
    var content = {};

    content.interventionList = [{
        hidden: false,
        title: 'Ouvrir Fiche',
        action: function(inter) {
            $location.url('/intervention/' + inter.id)
        }
    }, {
        hidden: false,
        title: "Appeler l'artisan",
        action: 'callArtisan',
        hide: function(inter) {
            return !inter.ai
        }
    }, {
        hidden: false,
        title: "SMS artisan",
        action: 'smsArtisan',
        hide: function(inter) {
            return !inter.ai
        }
    }, {
        hidden: false,
        title: "Envoyer",
        action: 'envoi',
        hide: function(inter) {
            return inter.s !== "APR" && inter.s !== 'ANN'
        }
    }, {
        hidden: false,
        title: "Vérifier",
        action: 'verification',
        hide: function(inter) {
            return inter.s !== "AVR" && inter.s !== 'ENV'
        }
    }, {
        hidden: false,
        title: "Annuler",
        action: 'annulation'

    }]

    var ContextMenu = function(page) {
        this.content = content[page];
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
        this.content.forEach(function(e) {
            e.hidden = e.hide && e.hide(_this.data);
        })
        this.style.display = "block";
        this.active = true;
    }

    ContextMenu.prototype.close = function() {
        this.style.display = "none";
        this.active = false;

    }

    ContextMenu.prototype.click = function(link) {
        if (typeof link.action === 'function') {
            return link.action(this.getData())
        } else if (typeof link.action === 'string') {
            console.log(Intervention()[link.action])
            return Intervention()[link.action].bind(this.data)();
        } else {
            console.log("error here")
        }
    }

    ContextMenu.prototype.style = {
        left: 0,
        top: 0,
        display: "none"
    }

    return function(page) {
        return new ContextMenu(page);
    }

}]);
