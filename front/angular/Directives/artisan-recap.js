angular.module('edison').directive('artisanRecap', function(edisonAPI, config, $q, $timeout) {
    "use strict";

    return {
        restrict: 'E',
        replace: true,
        templateUrl: '/Directives/artisan-recap.html',
        scope: {
            data: '=',
            recap: "=",
        },
        link: function(scope, element, attrs) {
            console.log('==>', scope.data);
            var svg = dimple.newSvg("#chartContainer", 400, 200);
            var myChart = new dimple.chart(svg, [{
                Month:'Jan-11',
                UnitSales:122,
                Channel:"sweg"

            },
            {
                Month:'Jan-11',
                UnitSales:111,
                Channel:"koo"

            },
            {
                Month:'Jan-12',
                UnitSales:112,
                Channel:"sweg"
            },
            {
                Channel:"koo",
                Month:'Jan-12',
                UnitSales:222,
            }]);
            myChart.setBounds(60, 30, 380, 120)
            var x = myChart.addCategoryAxis("x", "Month");
            x.addOrderRule("Date");
            myChart.addMeasureAxis("y", "UnitSales");
            myChart.addSeries("Channel", dimple.plot.bar);
            myChart.addLegend(60, 10, 510, 20, "right");
            myChart.draw();
        }
    };
});
