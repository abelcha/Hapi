var GStatsController = function(MomentIterator, TabContainer, $routeParams, edisonAPI, $rootScope, $scope, $location, LxProgressService, socket) {
  "use strict";
  edisonAPI.intervention.gstats().then(function(resp) {
    console.log(resp.data)
    $('#chartContainer').highcharts({
      chart: {
        type: 'column'
      },
      title: {
        text: 'Stacked column chart'
      },
      xAxis: {
        categories:[]
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Total fruit consumption'
        }
      },
      tooltip: {
        pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.percentage:.0f}%)<br/>',
        shared: true
      },
      plotOptions: {
        column: {
          stacking: 'percent'
        }
      },
      series: resp.data.series
    })
    console.log('okok')
  })
}
angular.module('edison').controller('GStatsController', GStatsController);
