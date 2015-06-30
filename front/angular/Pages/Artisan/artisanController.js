var ArtisanCtrl = function($rootScope, $location, $routeParams, ContextMenu, LxNotificationService, tabContainer, config, dialog, artisanPrm, Artisan) {
    "use strict";
    var _this = this;
    _this.config = config;
    _this.dialog = dialog;
    _this.moment = moment;
    _this.contextMenu = new ContextMenu('artisan')

    var tab = tabContainer.getCurrentTab();
    if (!tab.data) {
        var artisan = new Artisan(artisanPrm.data)
        tab.setData(artisan);
        if ($routeParams.id.length > 12) {
            _this.isNew = true;
            artisan.tmpID = $routeParams.id;
            tab.setTitle('SST  ' + moment((new Date(parseInt(artisan.tmpID))).toISOString()).format("HH:mm").toString());
        } else {
            tab.setTitle('SST  ' + $routeParams.id);
            if (!artisan) {
                LxNotificationService.error("Impossible de trouver les informations !");
                $location.url("/dashboard");
                tabContainer.remove(tab);
                return 0;
            }
        }
    } else {
        var artisan = tab.data;
    }
    _this.data = tab.data;
    var closeTab = function() {
        $location.url("/artisan/list");
        tabContainer.remove(tab)
    }
    _this.saveArtisan = function(options) {
        artisan.save(function(err, resp) {
            if (err) {
                return false;
            } else if (options.contrat) {
                artisan.envoiContrat.bind(resp)(closeTab);
            } else {
                closeTab();
            }
        })
    }
    _this.onFileUpload = function(file, name) {
        artisan.upload(file, name);
    }

    _this.clickTrigger = function(elem) {
        angular.element("#file_" + elem + ">input").trigger('click');
    }
    _this.rightClick = function($event) {
        console.log('rightClick')
        _this.contextMenu.setPosition($event.pageX, $event.pageY)
        _this.contextMenu.setData(artisan);
        _this.contextMenu.open();
    }

    _this.leftClick = function($event, inter) {
        console.log('leftClick')

        if (_this.contextMenu.active)
            return _this.contextMenu.close();
    }

    _this.addComment = function() {
        artisan.comments.push({
            login: $rootScope.user.login,
            text: _this.commentText,
            date: new Date()
        })
        _this.commentText = "";
    }
}
angular.module('edison').controller('ArtisanController', ArtisanCtrl);
