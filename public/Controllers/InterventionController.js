
app.controller('InterventionController', function($scope, $rootScope, $filter, $http, $location, ngTableParams) {


    this.artisan = artisan;

      $scope.etatInterIcon = {
        INT: {c:'success', i:'check'},
        ENC: {c:'warning', i:'refresh'},
        APR: {c:'default', i:''},
        ANN: {c:'danger', i:'close'},
        DEV: {c:'info', i:'align-justify'}
      }

    var setClientPaymentClass = function(info) {
      var hour = 1000 * 60 * 60;
      var week = hour * 24 * 7;

      var dtInter = Date.parse(info.dateInter);

      info.aVerifier = (info.etat == 'ENC' && (dtInter + hour) < Date.now());
      if (info.pmntCli)
        return ({c: 'success', i:'check'});
      if (info.etat == 'INT') {
        var dateDiff =  Date.now() - dtInter;
        return (dateDiff > (4 * week) ?  {c: 'danger',  i: 'warning'} : 
                dateDiff > (2 * week) ?  {c: 'warning', i: 'question'} : 
                {c: 'warning', i:'circle-thin'} );
      }
      return ({c: 'default', i:''});
    }




    function initDateFilters(e) {
        var limit = Date.now() - $rootScope.getDate().ts;
        var ts = new Date(e.dateAjout).getTime();
        e.hide = ($rootScope.config.selectedDate != 0 && (ts - limit <= 0));
    }

    function initData(inter) {
      inter.hide = false;
      inter.ClientPaymentClass = setClientPaymentClass(inter);
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
        $http.get('/data/interventions/find/' + JSON.stringify(query)).success(function(data) {
            console.timeEnd("load interventions");
            callback(data);

        });
    };
                                // Limit the results to 25 on the first shot
    $scope.getInterventionList({ q: "", limit: 100, sort: "-id"}, function(data) {
        $rootScope.newData = data.map(initData);
        $rootScope.tableParams = new ngTableParams({
            page: 1, // show first page
            count: 100,
            filter: initFilters(),
            sorting:{id:'desc'}
        }, {
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
            }
        });
               // Then get all the inters
         console.time("get interventions data");
        $http.get('/data/interventions/all').success(function(data) {
           console.timeEnd("get interventions data");
            $rootScope.newData = data.map(initData);
            $rootScope.tableParams.reload();
            //$rootScope.tableParams.total(data.length)
          });
        });












var openDialog = function() {
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
   if ($scope.clickedRow === -1)
      return (0);
    console.time("load data");
    $http.get('/data/interventions/findOne/' + JSON.stringify({id:info.id})).success(function(data) {
        console.timeEnd("load data");
        console.log(data);
       // $scope.$apply(function() {
          $scope.clickedRowData = data;
        //}); 
    });
}
    
  $scope.ClickOnRow = function(event, info) {

//console.log($rootScope.newData);
      event.preventDefault();
      event.stopPropagation();
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
    $locationProvider.html5Mode(true).hashPrefix('!')
}])

















