var SearchController = function(edisonAPI, tabContainer, $routeParams, $location, LxProgressService) {
    var tab = tabContainer.getCurrentTab();
    tab.setTitle('Search')
    var _this = this;
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
