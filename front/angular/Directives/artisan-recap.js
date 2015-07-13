angular.module('edison').directive('artisanRecap', function(edisonAPI, config, $q, $timeout) {
    "use strict";

    return {
        restrict: 'E',
        replace: true,
        templateUrl: '/Directives/artisan-recap.html',
        scope: {
            id: "=",
        },
        link: function(scope, element, attrs) {
            var reload = function() {
                $("#chartContainer").empty()
                edisonAPI.artisan.extendedStats(scope.id).success(function(resp) {
                    var svg = dimple.newSvg("#chartContainer", 600, 200);
                    var myChart = new dimple.chart(svg, resp);
                    myChart.setBounds(60, 30, 380, 120)
                    var x = myChart.addCategoryAxis("x", "date");
                    x.addOrderRule("dt");
                    myChart.addMeasureAxis("y", "total");
                    myChart.addSeries("status", dimple.plot.bar);
                    myChart.addLegend(60, 10, 410, 20, "right");
                    myChart.assignColor("ANN", "#F44336");
                    myChart.assignColor("ENC", "#FDD835");
                    myChart.assignColor("VRF", "#4CAF50");
                    myChart.draw();
                })
            }
            reload()
            scope.$watch('id', function(current, prev) {
                if (current && prev !== current)
                    reload();
            })
        }
    };
});