var StatsController = function(DateSelect, tabContainer, $routeParams, edisonAPI, $rootScope, $scope, $location, LxProgressService, socket) {
    "use strict";
    var _this = this;
    _this.tab = tabContainer.getCurrentTab();
    _this.tab.setTitle('Stats');


    var dateSelect = new DateSelect;
    _this.yearSelect = [];
    _.times(dateSelect.current.y - dateSelect.start.y + 1, function(k) {
        _this.yearSelect.push(dateSelect.start.y + k);
    })
    $scope.selectedYear = dateSelect.current.y

    $scope.$watch("selectedYear", function(curr) {
        edisonAPI.intervention.statsBen({
            y: curr
        }).then(function(resp) {
            console.log(resp.data)
            $('#chartContainer2 > *').remove()
            var svg = dimple.newSvg("#chartContainer2", 1070, 400);
            var myChart = new dimple.chart(svg, resp.data);
            myChart.setBounds(60, 30, 1000, 300)
            var x = myChart.addCategoryAxis("x", "mth");
            var y = myChart.addMeasureAxis("y", "montant");
            myChart.addSeries("potentiel", dimple.plot.bar);
            myChart.addLegend(60, 10, 410, 20, "right");
            myChart.draw();

            $scope.totalYear = {
                potentiel: 0,
                recu: 0
            }

            _.each(resp.data, function(e) {
                $scope.totalYear[e.potentiel ? 'potentiel' : 'recu'] += e.montant
            })
            console.log($scope.totalYear);
            /*
                        $('#chartContainer3 > *').remove()
                        var svg2 = dimple.newSvg("#chartContainer3", 100, 400);
                        var myChart2 = new dimple.chart(svg2, resp.data);
                        myChart.setBounds(60, 30, 50, 300)
            */
        })
    });




    $scope.$watch("selectedDate", function(curr) {
        if (!curr ||  !curr.m || !curr.y)
            return false;
        $location.search('m', curr.m);
        $location.search('y', curr.y);
        edisonAPI.intervention.statsBen(curr).then(function(resp) {
            $('#chartContainer > *').remove()
            var svg = dimple.newSvg("#chartContainer", 1300, 400);
            var myChart = new dimple.chart(svg, resp.data);
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
angular.module('edison').controller('StatsController', StatsController);
