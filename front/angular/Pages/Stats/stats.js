var StatsController = function(tabContainer, $routeParams, edisonAPI, $rootScope, $scope, $location, LxProgressService, socket) {
    "use strict";
    var _this = this;
    _this.tab = tabContainer.getCurrentTab();
    _this.tab.setTitle('Stats');

    var d = new Date();
    var start = {
        month: 9,
        year: 2013
    }
    var current = {
        month: d.getMonth(),
        year: d.getFullYear()
    }

    var frenchMonths = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Aout', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

    _this.dateSelect = [];

    _.times(current.year - start.year + 1, function(yr) {
        _.times(12, function(mth) {
            _this.dateSelect.push({
                m: mth + 1,
                y: start.year + yr,
                t: frenchMonths[mth] + ' ' + (start.year + yr)
            })
        })
    })
    _this.dateSelect.splice(current.month - 11)


    $scope.$watch("selectedDate", function(curr) {
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

    $scope.selectedDate = _this.dateSelect[_this.dateSelect.length - 1];


}
angular.module('edison').controller('StatsController', StatsController);
