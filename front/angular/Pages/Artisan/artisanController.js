var ArtisanCtrl = function($rootScope, $scope, edisonAPI, $location, $routeParams, ContextMenu, LxNotificationService, tabContainer, config, dialog, artisanPrm, Artisan) {
    "use strict";
    var _this = this;
    _this.config = config;
    _this.dialog = dialog;
    _this.moment = moment;
    _this.contextMenu = new ContextMenu('artisan')

    var tab = tabContainer.getCurrentTab();
    if (!tab.data) {
        console.log('-->', artisanPrm.data)
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
    _this.saveArtisan = function(options) {
        artisan.save(function(err, resp) {
            console.log(resp)
            if (err) {
                return false
            } else if (options.contrat) {
                artisan = new Artisan(resp);
                artisan.envoiContrat.bind(resp)(tabContainer.close);
            } else {
                tabContainer.close(tab);
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

    _this.addComment = function() {
        artisan.comments.push({
            login: $rootScope.user.login,
            text: _this.commentText,
            date: new Date()
        })
        _this.commentText = "";
    }
    var updateTmpArtisan = _.after(5, _.throttle(function() {
        edisonAPI.artisan.saveTmp(artisan);

    }, 2000))

    if (!artisan.id) {
        $scope.$watch(function() {
            return artisan;
        }, updateTmpArtisan, true)
    }
}
angular.module('edison').controller('ArtisanController', ArtisanCtrl);
