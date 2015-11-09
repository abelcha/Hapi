var ArtisanCtrl = function($timeout, $rootScope, $scope, edisonAPI, $location, $routeParams, ContextMenu, LxProgressService, LxNotificationService, TabContainer, config, dialog, artisanPrm, Artisan) {
    "use strict";
    var _this = this;
    _this.config = config;
    _this.dialog = dialog;
    _this.moment = moment;
    _this.contextMenu = new ContextMenu('artisan')
    console.log('==>', artisanPrm)
    var tab = TabContainer.getCurrentTab();
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
                TabContainer.remove(tab);
                return 0;
            }
        }
    } else {
        var artisan = tab.data;
    }
    _this.data = tab.data;
    _this.saveArtisan = function(options) {
        artisan.save(function(err, resp) {
            if (err) {
                return false
            } else if (options.contrat) {
                artisan = new Artisan(resp);
                artisan.envoiContrat.bind(resp)(options, function(err, res) {
                    if (!err) {
                        TabContainer.close(tab);
                    }
                });
            } else {
                TabContainer.close(tab);
            }
        })
    }
    _this.onArtisanFileUpload = function(file, name) {
        LxProgressService.circular.show('#5fa2db', '#fileUploadProgress');
        edisonAPI.artisan.upload(file, name, artisan.id).then(function() {
            console.log('reload')
            LxProgressService.circular.hide()
            _this.loadFilesList();
        })
    }

    _this.artisanClickTrigger = function(elem) {
        setTimeout(function() {
            angular.element("#file_" + elem + ">input").trigger('click');
        }, 0)

    }
    _this.rightClick = function($event) {
        console.log('rightClick')
        _this.contextMenu.setPosition($event.pageX, $event.pageY)
        _this.contextMenu.setData(artisan);
        _this.contextMenu.open();
    }

    _this.fileExist = function(name) {
        if (!artisan.file)
            return false;
        return _.find(artisan.file, function(e) {
            return _.startsWith(e, name)
        });
    }

    _this.loadFilesList = function() {
        edisonAPI.artisan.getFiles(artisan.id).then(function(result) {
            artisan.file = result.data;
            console.log('==>', artisan.file)
        }, console.log)
    }
    if (artisan.id) {
        _this.loadFilesList();
    }

    _this.addComment = function() {

        artisan.comments.push({
            login: $rootScope.user.login,
            text: _this.commentText,
            date: new Date()
        })
        if (artisan.id) {
            edisonAPI.artisan.comment(artisan.id, _this.commentText)
        }
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
