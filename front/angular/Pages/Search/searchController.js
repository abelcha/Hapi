var SearchController = function(edisonAPI, TabContainer, $routeParams, $location, LxProgressService) {
    var tab = TabContainer.getCurrentTab();
    tab.setTitle('Search')
    var _this = this;
    _this.routeParams = $routeParams
    LxProgressService.circular.show('#5fa2db', '#globalProgress');
    edisonAPI.searchText($routeParams.query).success(function(resp) {
        LxProgressService.circular.hide()
        _this.data = resp
    })
    _this.openLink = function(link) {
        $location.url(link)
    }
}

angular.module('edison').controller('SearchController', SearchController);
