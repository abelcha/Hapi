angular.module('edison').factory('contextMenu', ['$location', 'edisonAPI', '$window', 'dialog', function($location, edisonAPI, $window, dialog) {

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

                console.log("callto:" + inter.artisan.telephone.tel1)
                $window.open("callto:" + inter.artisan.telephone.tel1, '', 'scrollbars=1,height=100,width=100');
            }
        },
        hide: function(inter) {
            return !inter.ai
        }
    }, {
        hidden: false,
        title: "sms SST",
        click: function(inter) {
            dialog.getText({
                title: "Texte du SMS",
                text:"\nEdison Service"
            }, function(text) {
                edisonAPI.sendSMS(text, "0633138868").success(function(e) {
                	console.log(e);
                }).error(function(err) {
                	console.log(err)
                })
            })
        }
    }]

    var ContextMenu = function(page) {
        this.content = content[page];
    }

    ContextMenu.prototype.setData = function(data) {
        this.data = data;
    }

    ContextMenu.prototype.setPosition = function(x, y) {
        this.style.left = (x - 60) + "px";
        this.style.top = y + "px";
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
