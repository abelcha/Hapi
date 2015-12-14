var SearchController = function(edisonAPI, TabContainer, $routeParams, $location, LxProgressService, config) {
    var tab = TabContainer.getCurrentTab();
    tab.setTitle('Search')
    var _this = this;
    _this.config = config;
    _this.routeParams = $routeParams
    LxProgressService.circular.show('#5fa2db', '#globalProgress');
    edisonAPI.bigSearch($routeParams.query).success(function(resp) {
        LxProgressService.circular.hide()
        _this.data = resp
    })
    _this.openLink = function(link) {
        $location.url(link)
    }
    _this.open = function(url) {
        $location.url(url);
    }
}

angular.module('edison').controller('SearchController', SearchController);
