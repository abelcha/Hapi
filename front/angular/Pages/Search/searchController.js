var SearchController = function(edisonAPI, tabContainer, $routeParams, $location) {
    var tab = tabContainer.getCurrentTab();
    tab.setTitle('Search')
    var _this = this;
    edisonAPI.searchText($routeParams.query).success(function(resp) {
    	_this.data = resp
    })
    _this.openLink = function(link) {
    	$location.url(link)
    }
}

angular.module('edison').controller('SearchController', SearchController);
