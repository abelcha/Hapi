
app.controller('InterventionController', function($scope, $rootScope, $filter, $http, $location, ngTableParams) {


    function actualiseViewPort(width) {
      $scope.$apply(function() {
        $scope.bigScreen =  width > 1200;
        $scope.smallScreen = width < 768;
      });
    }

    $(function() {
       actualiseViewPort($(this).width());
    })

    $(window).resize(function(event) {
      actualiseViewPort($(this).width())
    });

    this.artisan = artisan;

      $scope.etatInterIcon = {
        INT: {c:'success', i: 'check'},
        ENC: {c:'warning', i: 'refresh'},
        APR: {c:'default', i: ''},
        ANN: {c:'danger',  i: 'close'},
        DEV: {c:'info',    i: 'align-justify'}
      }

      $scope.etatPmntIcon = {
        OK:   {c: 'success', i: 'check'},
        FCT1:  {c:'info',     i: 'circle-thin'},
        FCT02:  {c:'info',     i: 'question'},
        FCT03:  {c:'primary',  i: 'warning'},
        SP1:  {c: 'warning', i: 'circle-thin'},
        SP02:  {c: 'warning', i: 'question'},
        SP03:  {c: 'danger',  i: 'warning'},
        DEF:  {c: 'default',oi: ''}
      }
 
    var setClientPaymentClass = function(info) {
      var hour = 1000 * 60 * 60;
      var week = hour * 24 * 7;

      var dtInter = Date.parse(info.dateInter);

      info.aVerifier = (info.etat == 'ENC' && (dtInter + hour) < Date.now());
      if (info.pmntCli)
        return ("OK");
      if (info.etat == 'INT') {
        var dateDiff =  Date.now() - dtInter;
        var rtn = info.reglSP ? "SP" : "FCT";
        rtn += (dateDiff > (4 * week) ?  "03" : dateDiff > (2 * week) ? "02" : "1");
        return (rtn);
      }
      return ("DEF");
    }



    function initDateFilters(e) {
        var limit = Date.now() - $rootScope.getDate().ts;
        var ts = new Date(e.dateAjout).getTime();
        e.hide = ($rootScope.config.selectedDate != 0 && (ts - limit <= 0));
    }

    function initData(inter) {
      inter.hide = false;
      inter.ClientPmntClass = setClientPaymentClass(inter);
      inter.SstPmntClass = (inter.pmntSst === null ? "NO" : "OK");
      inter.artisan = inter.sst && artisan[inter.sst] ? artisan[inter.sst].nom : "A Programmer";
      inter.jour = moment(inter.dateAjout).format('ll');
      if (inter.pmntSst)
        inter.jourPmntSst = moment(inter.pmntSst).format('ll');
      if ($rootScope.config.selectedDate)
       initDateFilters(inter);
      return (inter);
    }
    var initFilters = function() {
      fltr = $rootScope.getFilter();
      res = fltr.filter;
      if (fltr.id)
        $('#' + $scope.config.interFilters[fltr.type].title).collapse('show');
      if ($rootScope.config.selectedTelepro !== -1)
        res.telepro = $rootScope.getTelepro().login;
      res.hide = false
      return (res);
    }

    var getData = function() { return ($rootScope.newData); }

    // Make query to server callback the results
    $scope.getInterventionList = function(query, callback) {
      console.time("load interventions");
        $http.get('/api/interventions/find/' + JSON.stringify(query)).success(function(data) {
            console.timeEnd("load interventions");
            callback(data);

        });
    };
                                // Limit the results to 25 on the first shot
    $scope.getInterventionList({ q: "", limit: 100, sort: "-id"}, function(data) {
        $rootScope.newData = data.map(initData);
        $rootScope.tableParams = new ngTableParams({
        page: 1,            // show first page
        filter: initFilters(),
        count: 100          // count per page
    }, {
            groupBy:$rootScope.config.selectedGrouping,
            total: getData().length, // length of data
            getData: function($defer, params) {
                var filteredData = getData();

              // Sort Data
              var orderedData = $filter('filter')(filteredData, params.filter());
                 params.total(orderedData.length);              
                 orderedData = $filter('orderBy')( orderedData, params.orderBy())
                $defer.resolve( orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));

            },
             // No idea why it work
            $scope: {
                $data: {}
            },
            filterDelay:100
    });
               // Then get all the inters
         console.time("get interventions data");
        $http.get('/api/interventions/all').success(function(data) {
           console.timeEnd("get interventions data");
            $rootScope.newData = data.map(initData);
            $rootScope.tableParams.reload();
            //$rootScope.tableParams.total(data.length)
          });
        });







var openDialog = function() {
  $('body>.row').addClass("blurred");
  vex.dialog.open({
    message: 'Enter your username and password:',
    input: "<input name=\"username\" type=\"text\" placeholder=\"Username\" required />\n<input name=\"password\" type=\"password\" placeholder=\"Password\" required />",
    buttons: [
      $.extend({}, vex.dialog.buttons.YES, {
        text: 'Login'
      }), $.extend({}, vex.dialog.buttons.NO, {
        text: 'Back'
      })
    ],
    callback: function(data) {
      $('body>.row').removeClass("blurred");
      modalBox = false;
      if (data === false) {
        return console.log('Cancelled');
      }
      return console.log('Username', data.username, 'Password', data.password);
    }
  });
}



$scope.clickedRowData = {};
$scope.clickedRow = -1;
$scope.rowSelection = [];
$scope.categories= {"PL" : "Plomberie", "EL": "Électricité", "VT" : "Vitrerie", "SR" : "Serrurerie", "CH": "Chauffage"};
//$scope.modeReglement = {'CHQ': }
$scope.isInSelection = function(id) {
  return($scope.rowSelection.indexOf(id) + 1);
}


$scope.addInSelection = function(id) {
         
     $scope.clickedRow = -1;
     if ($scope.isInSelection(id)) {
         $scope.rowSelection.splice($scope.isInSelection(id) - 1, 1);     
    } else {
         $scope.rowSelection.push(id);
    }
};


var openPreview = function(info) {
   $scope.clickedRow = (info.id == $scope.clickedRow) ? -1 : info.id;
    window.setTimeout(function(){
            $("[data-id='" + info.id + "']").next().next().find(".col-md-12").removeClass('hide');
    }, 250);
   if ($scope.clickedRow === -1)
      return (0);
    $http.get('/api/interventions/findOne/' + JSON.stringify({id:info.id})).success(function(data) {
          $scope.clickedRowData = data;
    });

}


    
  $scope.ClickOnRow = function(event, info) {
    if ($rootScope.rightClickedRow !== -1) {
        $rootScope.rightClickedRow = -1;
        return;
    }
    if ($(event.target).is('.modal-win')) {
      return (openDialog());
    }
    if (event.metaKey || event.ctrlKey) {
          return ($scope.addInSelection(info.id));
    } else{
      if ($scope.rowSelection.length == 0) 
        return (openPreview(info))
      $scope.rowSelection = [];
    } 
  };


})

.config(['$locationProvider', function($locationProvider){

  $locationProvider.html5Mode({
     enabled: true,
     requireBase: false
  }).hashPrefix('!')

}])
.run(function($rootScope) {
    $('[ng-app]').on('click', 'a', function() {
        window.location.href = $(this).attr('href');
  });
});














