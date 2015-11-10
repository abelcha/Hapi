var StatsNewController = function(DateSelect, TabContainer, $routeParams, edisonAPI, $rootScope, $scope, $location, LxProgressService, socket) {
    "use strict";
    var _this = this;
    _this.tab = TabContainer.getCurrentTab();
    _this.tab.setTitle('Stats');


    var dateSelect = new DateSelect;
    _this.yearSelect = [];
    _.times(dateSelect.current.y - dateSelect.start.y + 1, function(k) {
        _this.yearSelect.push(dateSelect.start.y + k);
    })
    $scope.selectedYear = dateSelect.current.y



    var yearChange = function(curr) {
        /* edisonAPI.intervention.statsBen({
             y: curr
         }).then(function(resp) {
             console.log(resp.data)
             $('#chartContainer2 > *').remove()
             var svg = dimple.newSvg("#chartContainer2", 1070, 400);
             var myChart = new dimple.chart(svg, resp.data);
             myChart.setBounds(60, 30, 1000, 300)
             var x = myChart.addCategoryAxis("x", "mth");
             var y = myChart.addMeasureAxis("y", "montant");
             y.tickFormat = ',.0f';
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
         })*/
    }


    var getChart = function(type, title, series, categories) {


        return {
            chart: {
                type: type
            },
            title: {
                text: title
            },
            xAxis: {
                categories: categories
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Chiffre'
                },
            },
            tooltip: {
                shared: true,
                valueSuffix: ' €'
            },
            plotOptions: {
                animation: false,
                column: {
                    pointPadding: 0,
                    groupPadding: 0.04,
                    borderWidth: 0,
                    animation: false,
                    stacking: 'normal',
                },
                area: {
                    stacking: 'normal',
                    lineColor: '#666666',
                    lineWidth: 1,
                    marker: {
                        lineWidth: 1,
                        lineColor: '#666666'
                    }
                },
                areaspline: {
                    stacking: 'normal',
                }
            },
            series: series
        }
    }


    _this.typeSelect = [
        'column',
        'areaspline',
        'area',
        'line',
        'pie',
        'bar',
        'spline',
    ]
    $scope.selectedType = 'column'

    _this.dividerSelect = [
        'categorie',
        'chiffre',
        'telepro'
    ]
    $scope.selectedDivider = 'chiffre'

    var monthChange = function() {
        edisonAPI.intervention.statsBen({
            month: $scope.selectedDate.m,
            year: $scope.selectedDate.y,
            group: 'day',
            model: 'ca',
            divider: $scope.selectedDivider,
        }).then(function(resp) {
            console.log(resp.data);
            var d = resp.data;
            $('#chartContainer').highcharts(getChart($scope.selectedType, d.title, d.series, d.categories));
        });
    }

    var yearChange = function() {
        edisonAPI.intervention.statsBen({
            year: $scope.selectedDate.y,
            group: 'month',
            model: 'ca',
            divider: $scope.selectedDivider,
        }).then(function(resp) {
            var d = resp.data;
            $('#chartContainer2').highcharts(getChart($scope.selectedType, d.title, d.series, d.categories));
        });
    }

    var weekChange = function() {
        edisonAPI.intervention.statsBen({
            year: $scope.selectedDate.y,
            group: 'week',
            model: 'ca',
            divider: $scope.selectedDivider,
        }).then(function(resp) {
            var d = resp.data;
            $('#chartContainer3').highcharts(getChart($scope.selectedType, d.title, d.series, d.categories));
        });
    }


    $scope.$watch("selectedType", function()  {
        monthChange();
        yearChange();
        weekChange();
    });


    $scope.$watch("selectedDivider", function()  {
        monthChange();
        yearChange();
        weekChange();
    });

    $scope.$watch("selectedYear", function() {
        yearChange();
        weekChange();

    });
    $scope.$watch("selectedDate", function(curr) {
        if (!curr ||  !curr.m || !curr.y)
            return false;
        $location.search('m', curr.m);
        $location.search('y', curr.y);
        return monthChange(curr);
    });

    if ($location.search().m)  {
        dateSelect.current.m = parseInt($location.search().m)
    }
    if ($location.search().y)  {
        dateSelect.current.y = parseInt($location.search().y)
    }
    _this.dateSelect = dateSelect.list()
    $scope.selectedDate = _.find(dateSelect.list(), dateSelect.current)
}
angular.module('edison').controller('StatsNewController', StatsNewController);
