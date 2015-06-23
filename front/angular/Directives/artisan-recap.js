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
            console.log('-->', scope.id)
            edisonAPI.artisan.extendedStats(scope.id).success(function(resp) {
                var svg = dimple.newSvg("#chartContainer", 600, 200);
                var myChart = new dimple.chart(svg, resp);
                myChart.defaultColors = [
                    new dimple.color("#4CAF50"),//RGL
                    new dimple.color("#F44336"),//ANN
                    new dimple.color("#FDD835"),//ATT
                    new dimple.color("#F44336"),//ENV
                    new dimple.color("#0091EA"),//PAY
                    new dimple.color("black"),
                ];
                myChart.setBounds(60, 30, 380, 120)
                var x = myChart.addCategoryAxis("x", "date");
                x.addOrderRule("dt");
                myChart.addMeasureAxis("y", "total");
                myChart.addSeries("status", dimple.plot.bar);
                myChart.addLegend(60, 10, 410, 20, "right");
                myChart.draw();
            })

        }
    };
});

var x = function() {

    var svg = dimple.newSvg("#chartContainer", 400, 200);
    var myChart = new dimple.chart(svg, [{
        Month: 'Jan-11',
        UnitSales: 122,
        Channel: "sweg"

    }, {
        Month: 'Jan-11',
        UnitSales: 111,
        Channel: "koo"

    }, {
        Month: 'Jan-12',
        UnitSales: 112,
        Channel: "sweg"
    }, {
        Channel: "koo",
        Month: 'Jan-12',
        UnitSales: 222,
    }]);
    myChart.setBounds(60, 30, 380, 120)
    var x = myChart.addCategoryAxis("x", "Month");
    x.addOrderRule("Date");
    myChart.addMeasureAxis("y", "UnitSales");
    myChart.addSeries("Channel", dimple.plot.bar);
    myChart.addLegend(60, 10, 510, 20, "right");
    myChart.draw();
}
