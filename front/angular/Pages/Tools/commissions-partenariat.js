var commissionsPartenariat = function(MomentIterator, TabContainer, $routeParams, edisonAPI, $rootScope, $scope,
  $location, LxProgressService, socket) {
  "use strict";
  var _this = this;
  _this.tab = TabContainer.getCurrentTab();
  _this.dateSelectList = MomentIterator(new Date(2016, 1, 0),moment().add(1, 'months').toDate()).range('month').map(function(e) {
    return {
      date: new Date(e),
      name: moment(e).format("MM[/]YYYY")
    }
  })
  _this.changeSelectedDate = function() {
    LxProgressService.circular.show('#5fa2db', '#globalProgress');
    edisonAPI.artisan.tableauCom(_this.selectedDate).then(function(resp) {
      LxProgressService.circular.hide()
      console.log(resp.data)
      _this.data = resp.data
    })
  }
  _this.selectedDate = new Date(_this.dateSelectList[_this.dateSelectList.length - 1].date)
  _this.changeSelectedDate();
  _this.tab.setTitle('Coms.');
  // edisonAPI.artisan.tableauCom().then(function(resp) {
  //   LxProgressService.circular.hide()
  //   console.log(resp.data)
  //   _this.data = resp.data
  // })
}
angular.module('edison').controller('commissionsPartenariat', commissionsPartenariat);
