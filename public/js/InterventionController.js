


app.controller('SideBarController', function($scope, $rootScope, $location) {

  $scope.toggleSidebar = function(i) {
    var offset = (typeof i !== 'undefined' ? 77 : 0); 
    if (i == 0 || $('.side-menu').css('margin-left') == "0px") {
       $(".side-menu>div>ul>li:not(.toggleButton)").css("visibility", "hidden")
       $('.side-body').css('margin-left', (  34 - offset) +"px");
       $('.side-menu').css('margin-left', (-186 - offset) + "px");

    }
    else {
       $('.side-body').css('margin-left', (offset ? 0 :220) + "px");
       $('.side-menu').css('margin-left', "0px");
       $(".side-menu>div>ul>li:not(.toggleButton)").css("visibility", "visible")
    }
    $('.fa-bars.fa-2x').toggleClass('fa-rotate-270');
  }

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
      if ($scope.selectedDate)
        url += ':' + getDate().url;
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


    var getDaysInMillisec = function(dayNbr) {
      var d = new Date;
      var hoursToday = (d.getHours() * 3600000) + (d.getMinutes() * 60000);
      console.log(hoursToday)
      var day = 1000 * 60 * 60 * 24;
      return (dayNbr * day + hoursToday)
    }

    $scope.selectedDate = 0;
    $scope.interDate = [
      {cleanTitle:"All",    fr:"Toutes", url:"ALL",   ts:0},
      {cleanTitle:"Today",  fr:"Jour", url:"Today",   ts:getDaysInMillisec(0)},
      {cleanTitle:"Week",   fr:"Semaine", url:"Week", ts:getDaysInMillisec(7)},
      {cleanTitle:"Month",  fr:"Mois", url:"Month",   ts:getDaysInMillisec(28)},
    ]

    $scope.setDate= function(date) {
      $scope.selectedDate = date;
      $rootScope.updateUrl()
      var limit = Date.now() - $scope.interDate[date].ts;
      $rootScope.newData.forEach(function(e, i) {
        var ts = new Date(e.dateAjout).getTime();
        e.hide = ($scope.selectedDate != 0 && (ts - limit <= 0));
      });
      $rootScope.tableParams.reload();
    }

    var getDate = function() {
      return $scope.interDate[$scope.selectedDate];
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



    function initData(inter) {
      inter.hide = false;
      inter.ClientPaymentClass = setClientPaymentClass(inter);
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
               console.log($rootScope.tableParams);
         console.time("get interventions data");
        $http.get('/data/interventions/all').success(function(data) {
           console.timeEnd("get interventions data");
            $rootScope.newData = data.map(initData);
            $rootScope.tableParams.reload();
            //$rootScope.tableParams.total(data.length)
          });
        });


        /* --------------------- */
        /*   CLICK CONTEXT MENU  */
        /* --------------------- */ 

    $scope.contextMenu  = [{display:true, title: "Liste Inters SST", only:1},
                          {display:true, title: "Voir la fiche SST", only:1},
                          {display:true, title: "Appeler SST", only:1},
                          {display:true, title: "Envoyer SMS", only:1},
                          {display:true, title: "Appeler Client", only:2},
                          {display:true, title: "Envoyer SMS Client", only:2},
                          {display:true, title: "Annuler L'inter", only:0},
                          {display:true, title: "Confirmer l'inter", only:0},
                          {display:true, title: "Envoyer l'inter", only:0}];


    function getClickedElementType() {
      // Self Explaining
      if (selectedRow.getAttribute('data-title') == "'Client'")
        return (2);
      else if (selectedRow.getAttribute('data-title') == "'Artisan'")
        return (1);
      else
        return (0)
    }

    $scope.refreshContextMenu = function() {
      // We want this to apply to angular scope
      $scope.$apply(function() {
        // Get the clicked Element Type (1 -> artisan  |  2 -> client | 3 -> else)
          var elementType = getClickedElementType();
              for (key in $scope.contextMenu) {
                // Is true if the context menu line correspond to the TD clicked
                   $scope.contextMenu[key].display = elementType == $scope.contextMenu[key].only;
              }
        });
    }



$scope.multipleSelection = false;
$scope.rowSelection = [];

$scope.addInSelection = function(id) {
         
     $scope.clickedRow = -1;

     if ($scope.isInSelection(id)) {
         $scope.rowSelection.splice($scope.isInSelection(id) - 1, 1);     
    } else {
         $scope.rowSelection.push(id);
    }
  //  console.log($scope.rowSelection);
};



$scope.isInSelection = function(id) {
  return($scope.rowSelection.indexOf(id) + 1);
}

    $scope.ClickOnRow = function(event, id) {
      console.log($rootScope.tableParams);
      event.preventDefault();
      event.stopPropagation();
    if (event.metaKey || event.ctrlKey) {
            return ($scope.addInSelection(id));
    } else{
      if ($scope.rowSelection.length == 0)
         $scope.clickedRow = $scope.rowIsClicked(id) ? -1 : id;
      $scope.rowSelection = [];
    } 
      //console.log(id);
   /*   
   */
    };
                /* ------------------------------*/
                /*          ROW PREVIEW          */
                /*    edisonpro like preview     */
                /* ------------------------------*/  


    $scope.clickedRow = -1;
    $scope.rowIsClicked = function(id) {
    //  console.log(id + " == " + this.clickedRow);
      return ($scope.clickedRow == id);
    };



    $scope.hideSidebar = function() {
      alert("hide");
    }

                /* --------------*/
                /* Mouses Events */
                /* --------------*/

    var contextStyle = document.getElementById('context-menu').style;
    var selectedRow = null;

    function isDescendant(parent, child) {
         var node = child.parentNode;
         while (node != null) {
             if (node == parent) {
                 return true;
             }
             node = node.parentNode;
         }
         return false;
    }

    function getClosestParent(tag, node) {
      while (node.tagName !== tag) {
        node = node.parentNode;
      }
      return (node);
    }

    function resetSelectedRowColor(){
          if (selectedRow != null) {
            selectedRow.parentNode.style.backgroundColor = "";
            selectedRow = null;
        }
    }

    document.addEventListener("dblclick", function(e){
      //If it's a row
     if (isDescendant(document.getElementById('tbody-list'), e.toElement)) {
        // We get the closest tr ID
        var cell = getClosestParent('TR', e.toElement);
        alert("Ouvre la fiche " + cell.dataset.id)
     }
    });



    // document.addEventListener("scroll", function(){
    //   var newPadding =  (document.body.scrollTop > 0 ? document.body.scrollTop : 0); 
    //     document.getElementById('sidebar').style.paddingTop = newPadding * 2 + "px";
    // });



    document.addEventListener("mousedown", function(e){
      // If it's a right click And the element clicked is in the table
        if (e.which === 3 && isDescendant(document.getElementById('tbody-list'), e.toElement)){

          contextStyle.left = e.clientX + "px";     //
          contextStyle.top = e.clientY + "px";      // We show the context menu
          contextStyle.display = "block";           //
          resetSelectedRowColor();                  // Reset the row color
          // Select the closest Parent TD
          selectedRow = getClosestParent('TD', e.toElement)
          // Set row color to blue
          selectedRow.parentNode.style.backgroundColor = "rgba(33, 150, 243, 0.12)";
           // Refresh the context menu
          $scope.refreshContextMenu();
        } else {
          // Hide the context menu and hide color anyway
          contextStyle.display = "none";
          resetSelectedRowColor();
      }
  });


                /* ------------------------------*/
                /*          BUTTONS              */
                /*    graphical img based on     */
                /* ------------------------------*/  









  //responsivité
  $scope.wResize = function() {
      var wSize = $(window).width();
       if (wSize < 480)
         $scope.rowPriority = 4;
       else if (wSize < 768)
        $scope.rowPriority = 3;
      else if (wSize < 992)
         $scope.rowPriority = 2;
      else if (wSize < 1200)
          $scope.rowPriority = 1;
      else
          $scope.rowPriority = 0;
  };

  $( window ).resize(function() {

    $scope.wResize();
    console.log($scope.rowPriority);
  });
  $scope.wResize();


})
.config(['$locationProvider', function($locationProvider){
    $locationProvider.html5Mode(true).hashPrefix('!')
}])
