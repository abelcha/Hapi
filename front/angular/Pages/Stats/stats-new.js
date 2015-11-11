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
