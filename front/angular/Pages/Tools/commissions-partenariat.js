var commissionsPartenariat = function(MomentIterator, TabContainer, $routeParams, edisonAPI, $rootScope, $scope, $location, LxProgressService, socket) {
  "use strict";
  var _this = this;
  _this.tab = TabContainer.getCurrentTab();
  _this.tab.setTitle('Coms.');
  LxProgressService.circular.show('#5fa2db', '#globalProgress');
  edisonAPI.artisan.tableauCom().then(function(resp) {
    LxProgressService.circular.hide()
    console.log(resp.data)
    _this.data = resp.data
  })
}
angular.module('edison').controller('commissionsPartenariat', commissionsPartenariat);
