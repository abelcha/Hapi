


app.controller('SideBarController', function($scope, $rootScope, $location) {



  $rootScope.getFilter = function() {
    for (var k in $rootScope.config.interFilters) {
      for (var x in $rootScope.config.interFilters[k].list) {
        e = $rootScope.config.interFilters[k].list[x];
        if (e.id === $rootScope.config.selectedFilter) {
          return (e);
        }
      }
    }
    return (null);
  }
  $scope.changeFilter = function(fltr) {
      $rootScope.config.selectedFilter = fltr;
      var newFilter = $rootScope.getFilter();
      var selectedTelepro =  $rootScope.tableParams.$params.filter.telepro;
      $rootScope.tableParams.$params.filter = newFilter.filter;
      $rootScope.tableParams.$params.filter.hide = false;
      if (typeof selectedTelepro !== "undefined")
        $rootScope.tableParams.$params.filter.telepro = selectedTelepro;
      $rootScope.updateUrl();
  }

});
















app.controller('TabsController', function($scope, $rootScope, $location) {

    $rootScope.updateUrl = function() {
      var url = "";
      if ($rootScope.config.selectedFilter)
        url += $rootScope.getFilter().cleanTitle;
      if ($rootScope.config.selectedTelepro !== -1)
        url += ':' + $rootScope.getTelepro().login;
      if ($rootScope.config.selectedDate)
        url += ':' + $rootScope.getDate().url;
      $location.path("/inters/" + url) ;
      $rootScope.config.pageTitle = url != "" ? url : "Interventions";
      
    };


    $rootScope.getTelepro = function() {
      return ($rootScope.config.telepro[$rootScope.config.selectedTelepro])
    }
    $scope.setTelepro = function(telepro) {

      $rootScope.config.selectedTelepro = telepro;
      if (telepro === -1) {
         delete $rootScope.tableParams.$params.filter.telepro;
      } else {
          $rootScope.tableParams.$params.filter.telepro = $rootScope.getTelepro().login;
      }
      $rootScope.tableParams.reload();
      $rootScope.updateUrl();
    }





    $rootScope.setDate = function(date, reload) {
      $rootScope.config.selectedDate = date;
      $rootScope.updateUrl()
      var limit = Date.now() - $rootScope.config.interDate[date].ts;
      $rootScope.newData.forEach(function(e, i) {
        var ts = new Date(e.dateAjout).getTime();
        e.hide = ($rootScope.config.selectedDate != 0 && (ts - limit <= 0));
      });
      if (reload)
        $rootScope.tableParams.reload();
    }

    $rootScope.getDate = function() {
      return $rootScope.config.interDate[$rootScope.config.selectedDate];
    }
});



















app.controller('InterventionController', function($scope, $rootScope, $filter, $http, $location, ngTableParams) {


    this.artisan = artisan;
                /* ------------------------------*/
                /*        CORE DATA LOADING      */
                /*                               */
                /* ------------------------------*/  

    // The only way to update data


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
      res = $rootScope.getFilter().filter;
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



})
.config(['$locationProvider', function($locationProvider){
    $locationProvider.html5Mode(true).hashPrefix('!')
}])
