var userHistory = function(TabContainer, edisonAPI, $rootScope, $scope, $location, LxNotificationService, socket) {
	"use strict";
	var _this = this;
	_this.tab = TabContainer.getCurrentTab();
	_this.tab.setTitle('User History');
	edisonAPI.user.history($location.search().login).then(function(resp) {
		$scope.history = resp.data
	})
	_this.xclick = function(h) {
		_this.selectedRow = (_this.selectedRow == h.date ? null : h.date);
	}


}

angular.module('edison').controller('userHistory', userHistory);
