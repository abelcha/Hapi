App.controller('DashboardController', ['$scope', 'colors', 'flotOptions', function($scope, colors, flotOptions) {
  'use strict';
  // KNOB Charts
  // ----------------------------------- 

  $scope.knobLoaderData1 = 75;
  $scope.knobLoaderOptions1 = {
      width: '80%', // responsive
      displayInput: true,
      inputColor : colors.byName('gray-dark'),
      fgColor: colors.byName('info'),
      bgColor: colors.byName('inverse'),
      readOnly : true,
      lineCap : 'round',
      thickness : 0.1
    };

  $scope.knobLoaderData2 = 50;
  $scope.knobLoaderOptions2 = {
      width: '80%', // responsive
      displayInput: true,
      fgColor: colors.byName('inverse'),
      readOnly : true,
      lineCap : 'round',
      thickness : 0.1
    };


  // Dashboard charts
  // ----------------------------------- 

  // Spline chart
  $scope.splineChartOpts = angular.extend({}, flotOptions['spline'], { yaxis: {max: 115} });
  $scope.areaSplineSeries = [true, true];
  // Line chart
  $scope.chartOpts = angular.extend({}, flotOptions['default'], {
    points: {
      show: true,
      radius: 1
    },
    series: {
      lines: {
        show: true,
        fill: 1,
        fillColor: { colors: [ { opacity: 0.4 }, { opacity: 0.4 } ] }
      }
    },
    yaxis: {max: 50}
  });
  $scope.lineChartSeries = [false, true, true];


  // Sparkline
  // ----------------------------------- 
  
  $scope.sparkValues = [2,3,4,6,6,5,6,7,8,9,10];
  $scope.sparkOptions = {
    barColor:      colors.byName('gray'),
    height:        50,
    barWidth:      10,
    barSpacing:    4,
    chartRangeMin: 0
  };

}]);