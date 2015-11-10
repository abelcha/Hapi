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

    var monthChange = function(curr) {

        edisonAPI.intervention.statsBen(curr).then(function(resp) {
            console.log('==>', resp.data)
            $('#chartContainer').highcharts({
                chart: {
                    type: 'column'
                },
                title: {
                    text: resp.data.title
                },
                xAxis: {
                    categories: resp.data.categories
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: 'Chiffre'
                    },
                    stackLabels: {
                        enabled: false,
                        style: {
                            fontWeight: 'bold',
                            color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
                        }
                    }
                },
                tooltip: {
                    formatter: function() {
                        return '<b>' + this.x + '</b><br/>' +
                            this.series.name + ': ' + this.y + '<br/>' +
                            'Total: ' + this.point.stackTotal;
                    }
                },
                plotOptions: {
                    animation: false,
                    column: {
                        pointPadding: 0,
                        groupPadding:0.04,
                        borderWidth: 0,
                        animation: false,
                        stacking: 'normal',
                        dataLabels: {
                            enabled: false,
                            color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
                            style: {
                                textShadow: '0 0 3px black'
                            }
                        }
                    }
                },
                series: resp.data.series
            });
        });
    }


    $scope.$watch("selectedYear", yearChange);
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
