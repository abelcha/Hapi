angular.module('edison').factory('contextMenu', ['$location', 'edisonAPI', 'actionIntervention', '$window', 'dialog', function($location, edisonAPI, actionIntervention, $window, dialog) {
    "use strict";
    var content = {};

    content.interventionList = [{
        hidden: false,
        title: 'Ouvrir Fiche',
        click: function(inter) {
            $location.url('/intervention/' + inter.id)
        }
    }, {
        hidden: false,
        title: "Appeler l'artisan",
        click: function(inter) {
            if (inter.artisan) {
                var now = Date.now();
                $window.open('callto:' + inter.artisan.telephone.tel1, '_self', false)
                dialog.choiceText({
                    title: 'Nouvel Appel',
                }, function(response, text) {
                    edisonAPI.call.save({
                        date: now,
                        to: inter.artisan.telephone.tel1,
                        link: inter.artisan.id,
                        origin: inter.id || inter.tmpID,
                        description: text,
                        response: response
                    }).success(function(resp) {
                        inter.artisan.calls.unshift(resp)
                    })
                })
            }
        },
        hide: function(inter) {
            return !inter.ai
        }
    }, {
        hidden: false,
        title: "SMS artisan",
        click: function(inter) {
            dialog.getText({
                title: "Texte du SMS",
                text: "\nEdison Service"
            }, function(text) {
                edisonAPI.sms.send({
                    link: inter.artisan.id,
                    origin: inter.id,
                    text: text,
                    to: "0633138868"
                })
            })
        },
        hide: function(inter) {
            return !inter.ai
        }
    }, {
        hidden: false,
        title: "Envoyer",
        click: actionIntervention.envoi,
        hide: function(inter) {
            return inter.s !== "APR" && inter.s !== 'ANN'
        }
    }, {
        hidden: false,
        title: "Vérifier",
        click: actionIntervention.verification,
        hide: function(inter) {
            return inter.s !== "AVR" && inter.s !== 'ENV'
        }
    }, {
        hidden: false,
        title: "Annuler",
        click: actionIntervention.annulation

    }]

    var ContextMenu = function(page) {
        this.content = content[page];
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

    ContextMenu.prototype.style = {
        left: 0,
        top: 0,
        display: "none"
    }

    return function(page) {
        return new ContextMenu(page);
    }

}]);
