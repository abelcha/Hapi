angular.module('edison').factory('contextMenu', ['$location', 'edisonAPI', 'LxNotificationService', '$window', 'dialog', function($location, edisonAPI, LxNotificationService, $window, dialog) {

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
                var x = $window.open('callto:' + inter.artisan.telephone.tel1, '_self', false)
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
        click: function(inter) {
            dialog.getFileAndText(inter, [], function(text, file) {
                edisonAPI.intervention.envoi(inter.id, {
                    sms: text,
                    file: file
                }).then(function(res) {
                    console.log(res)
                    LxNotificationService.success(res.data);
                }).catch(function(error) {
                    console.log(error)
                    LxNotificationService.error(error.data);
                });
            })
        },
        hide: function(inter) {
            return inter.s !== "A Programmer" && inter.s !== 'Annulé'
        }
    }, {
        hidden: false,
        title: "Vérifier",
        click: function(inter) {
            edisonAPI.intervention.verification(inter.id).then(function(res) {
                LxNotificationService.success("L'intervention " + inter.id + " à été vérifié");
            }).catch(function(error) {
                LxNotificationService.error(error.data);
            });
        },
        hide: function(inter) {
            return inter.s !== "A Vérifier" && inter.s !== 'Envoyé'
        }
    }, {
        hidden: false,
        title: "Annuler",
        click: function(inter) {
            edisonAPI.intervention.annulation(inter.id).then(function(res) {
                LxNotificationService.success("L'intervention " + inter.id + " à été annulé");
            });
        }

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
