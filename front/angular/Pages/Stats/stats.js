var StatsController = function(tabContainer, $routeParams, edisonAPI, $rootScope, $scope, $location, LxProgressService, socket) {
    "use strict";
    console.log("swef")
    console.log('==>', $routeParams);

    /* 
 var svg = dimple.newSvg("#chartContainer", 600, 200);
            var myChart = new dimple.chart(svg, resp);
            myChart.defaultColors = [
                new dimple.color("#4CAF50"), //RGL
                new dimple.color("#F44336"), //ANN
                new dimple.color("#FDD835"), //ATT
                new dimple.color("#F44336"), //ENV
                new dimple.color("#0091EA"), //PAY
                new dimple.color("black"),
            ];
            myChart.setBounds(60, 30, 380, 120)
            var x = myChart.addCategoryAxis("x", "date");
            x.addOrderRule("dt");
            myChart.addMeasureAxis("y", "total");
            myChart.addSeries("status", dimple.plot.bar);
            myChart.addLegend(60, 10, 410, 20, "right");
            myChart.draw();
            console.log('===>', resp.data);

*/
    var _this = this;
    _this.tab = tabContainer.getCurrentTab();
    _this.tab.setTitle('Stats');
    edisonAPI.intervention.statsBen().then(function(resp) {
            var svg = dimple.newSvg("#chartContainer", 1200, 400);
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
            myChart.addMeasureAxis("y", "prix");
            myChart.addSeries("recu", dimple.plot.bar);
            //myChart.addPctAxis("y", "paye");
            myChart.addLegend(60, 10, 410, 20, "right");
            myChart.draw();
            console.log('===>', resp.data);
    })
}
angular.module('edison').controller('StatsController', StatsController);

