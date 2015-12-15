var StatsNewController = function(MomentIterator, TabContainer, $routeParams, edisonAPI, $rootScope, $scope, $location, LxProgressService, socket) {
    "use strict";
    var _this = this;
    _this.tab = TabContainer.getCurrentTab();
    _this.tab.setTitle('Stats');


    var end = new Date();
    var start = new Date(2013, 8, 1)
    _this.dateSelect = MomentIterator(start, end).range('month').map(function(e) {
        return {
            t: e.format('MMM YYYY'),
            m: e.month() + 1,
            y: e.year(),
        }
    }).reverse()
    var dateTarget = _.pick(_this.dateSelect[0], 'm', 'y');

    _this.yearSelect = MomentIterator(start, end).range('year', {
        format: 'YYYY'
    }).map(function(e) {
        return parseInt(e)
    })

    var getChart = function(type, title, series, categories) {


        return {
            chart: {
                zoomType: 'x',
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
                    //  stacking: 'normal',
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
            setTotal(resp.data);
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

    var setTotal = function(data) {
        $scope.totalYear =   {
            recu: 0,
            potentiel: 0,
        }
        _.times(data.categories.length, function(i) {
            $scope.totalYear[data.series[0].name] += data.series[0].data[i]
            $scope.totalYear[data.series[1].name] += data.series[1].data[i]
        })
    }

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
        monthChange(curr);
        yearChange();
        
    }, true);
    if ($location.search().m)  {
        dateTarget.m = parseInt($location.search().m)
    }
    if ($location.search().y)  {
        dateTarget.y = parseInt($location.search().y)
    }
    $scope.selectedDate = _.find(_this.dateSelect, dateTarget)
    $scope.selectedYear = $scope.selectedDate.y.toString();
}
angular.module('edison').controller('StatsNewController', StatsNewController);
