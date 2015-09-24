var CommissionsController = function(DateSelect, tabContainer, $routeParams, edisonAPI, $rootScope, $scope, $location, LxProgressService, socket) {
    "use strict";
    var _this = this;
    _this.tab = tabContainer.getCurrentTab();
    _this.tab.setTitle('Stats');


    var dateSelect = new DateSelect;
    console.log("==>",  dateSelect.current);


    $scope.$watch("selectedDate", function(curr) {
        if (!curr ||  !curr.m || !curr.y)
            return false;
        $location.search('m', curr.m);
        $location.search('y', curr.y);
        edisonAPI.intervention.statsBen(curr).then(function(resp) {
            $('#chartContainer > *').remove()
            var svg = dimple.newSvg("#chartContainer", 1300, 400);
            var myChart = new dimple.chart(svg, resp.data);
            myChart.defaultColors = [
                new dimple.color("#4CAF50"), //RGL
                new dimple.color("#2196F3"), //ANN
                new dimple.color("#FDD835"), //ATT
                new dimple.color("#F44336"), //ENV
                new dimple.color("#0091EA"), //PAY
                new dimple.color("black"),
            ];
            myChart.setBounds(60, 30, 1000, 300)
            var x = myChart.addCategoryAxis("x", "day");
            //x.addOrderRule("dt");
            var y = myChart.addMeasureAxis("y", "prix");
            //y.tickFormat = ',.0f';
            myChart.addSeries("recu", dimple.plot.bar);
            //myChart.addPctAxis("y", "paye");
            myChart.assignColor("En Attente", "#2196F3");
            myChart.assignColor("Encaissé", "#4CAF50");
            myChart.addLegend(60, 10, 410, 20, "right");
            myChart.draw();

        })
    })
    if ($location.search().m)  {
        dateSelect.current.m = parseInt($location.search().m)
    }
    if ($location.search().y)  {
        dateSelect.current.y = parseInt($location.search().y)
    }
    _this.dateSelect = dateSelect.list()
    $scope.selectedDate = _.find(dateSelect.list(), dateSelect.current)
}
angular.module('edison').controller('CommissionsController', CommissionsController);
