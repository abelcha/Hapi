var app = angular.module('InterventionApp', ['ngTable','truncate', 'ngTouch']).
  controller('InterventionController', function($scope, $filter, $http, $location, ngTableParams) {
    this.artisan = artisan;
                /* ------------------------------*/
                /*        CORE DATA LOADING      */
                /*                               */
                /* ------------------------------*/  

    // The only way to update data
    var getData = function() { return ($scope.newData); }

    // Make query to server callback the results
    $scope.getInterventionList = function(query, callback) {
      console.time("load interventions");
        $http.get('/data/interventions/find/' + JSON.stringify(query)).success(function(data) {
            console.timeEnd("load interventions");
            callback(data);

        });
    };
     
          // Then get all the inters
    $scope.reloadInterventions = function($scope, $http, query) {
      $scope.getInterventionList(query, function(data) {
          $scope.newData = data;
          $scope.tableParams.reload();
          $scope.tableParams.total(data.length)
        });
    }

                                                    // Limit the results to 25 on the first shot
    $scope.getInterventionList({ q: "", limit: 100, sort: "-numOs"}, function(data) {
        $scope.newData = data;
        $scope.tableParams = new ngTableParams({
            page: 1, // show first page
            count: 100,
            filter: {}
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
            $scope.newData = data;
            $scope.tableParams.reload();
            $scope.tableParams.total(data.length)
          });
        });

        /* --------------------- */
        /*     BOOTSTRAP THEME   */
        /* --------------------- */ 


    // Ugly hack to refresh theme on select
    $scope.changeTheme = function(theme) {
     changeTheme(theme)
    }

    $scope.themes = ["ben", "cerulean", "cosmo","classic", "cyborg", "darkly", "flatly", "journal", "lumen", "paper", "readable", "sandstone", "simplex", "slate", "spacelab", "superhero", "united", "yeti"];


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


          /* -------------------------------------------------------------*/
          /* ----------------            FILTERS           ---------------*/
          /* ----------------                              ---------------*/
          /* -------------------------------------------------------------*/  

    $scope.updateUrl = function() {
      $location.path("/interventions" + 
                  "/" + ($scope.selectedTelepro !== -1 ? $scope.telepro[$scope.selectedTelepro].url : "All") +
                  "/" +($scope.selectedDate ?  $scope.interDate[$scope.selectedDate].url : "All"));


    };


                /* ------------------------------*/
                /*        SELECTED FILTER        */
                /*    Left Filter categories     */
                /* ------------------------------*/  

    // date => 0 -> ajd / 1 => semaine / 2 => mois / 3 => ALL


    // type : {0: Inteventions, 1:devis, 3:relances}
    $scope.interFilters = [{
                title:"Interventions", 
                icon:'truck',
                list: [
                      {id:0, title:"Toutes les Interventions",  cleanTitle:'All', filter: {}},
                      {id:1, title:"Interventions en Cours", cleanTitle:'En_Cours', filter: {etat:"ENC"}},
                      {id:2, title:"Interventions à Prog.", cleanTitle:'A_Programmer', filter: {etat:"APR"}},
                      {id:3, title:"Interventions Annulés", cleanTitle:'Annules', filter: {etat:"ANN"}},
                      {id:4, title:"Interventions Confirmés", cleanTitle:'Confirmer', filter: {etat:"INT"}},
                      {id:5, title:"A Vérifié", cleanTitle:'aVerifier', filter: {etat:"INT"}}, // et pas payé
                ]},{
                 title:"Devis", 
                 icon:'building-o',
                 list: [
                      {id:6,title:"Tous les Devis", cleanTitle:'DevisEnCours', filter: {etat:"DEV"}},
                      {id:7,title:"Devis en cours", cleanTitle:'DevisEnCours', filter: {etat:"DEV"}},
                      {id:8, title:"Devis Acceptés", cleanTitle:'DevisAccepte'},
                ]},{
                  title:"Relances",
                  icon:'bell',
                  list: [
                      {id:9, title:"Relances Clients", cleanTitle:'RelancesClients'},
                      {id:10, title:"Relances Artisan", cleanTitle:'RelancesArtisan'}
                ]}
    ];


    $scope.selectedFilter = 0;
    $scope.getFilter = function(callback) {
      $scope.interFilters.forEach(function(e, i) {
          e.list.forEach(function(e, i){
              if ($scope.selectedFilter == e.id)
                callback(e);
          })
      })
      return (null);
    }
    $scope.changeFilter = function(fltr) {
        $scope.selectedFilter = fltr;
        $scope.getFilter(function(newFilter) {
          $scope.tableParams.$params.filter = newFilter.filter;
          $scope.updateUrl();
          $location.hash(newFilter.cleanTitle);
        })

    }

                /* ------------------------------*/
                /*        TELEPRO FILTER         */
                /*   filter by telepro / number  */
                /* ------------------------------*/  



    $scope.selectedTelepro = -1;
    $scope.setTelepro = function(telepro) {

      if (telepro === -1) {
         delete $scope.tableParams.$params.filter.telepro;
      } else {
          $scope.tableParams.$params.filter.telepro = $scope.telepro[telepro].login;
      }
      $scope.selectedTelepro = telepro;
      $scope.updateUrl();
    }

    $scope.countTelepro = function(telepro) {
        // copy of telepro
        var tmp =  JSON.parse(JSON.stringify($scope.tableParams.$params.filter));
        tmp.ajoutePar = telepro.login;
        $http.get('/data/interventions/count/' + JSON.stringify( {q : tmp } )).success(function(data) {
           telepro.count = data; 
           $scope.nbrDisplayed += data;
        });
    };
    $scope.nbrDisplayed = 0;
    $scope.telepro = [
      {name:"Benjamin", login:"boukris_b"},
      {name:"Tayeb", login:"tayeb"},
      {name:"Harald", login:"harald"},
      {name:"Jeremie", login:"jeremie"},
      {name:"Eliran", login:"eliran"},
      {name:"Thomas", login:"thomas"},
    ];


    $scope.interDate = [
      {cleanTitle:"All",    fr:"Toutes", url:"_"},
      {cleanTitle:"Today",  fr:"Jour", url:"Today"},
      {cleanTitle:"Week",   fr:"Semaine", url:"Week"},
      {cleanTitle:"Month",  fr:"Mois", url:"Month"},
    ]
    $scope.setDate = function(date) {

    }


                /* ------------------------------*/
                /*     SHIFT SELECTION           */
                /*    select multiple row        */
                /* ------------------------------*/  




                /* ------------------------------*/
                /*      MULTIPLE SELECTION       */
                /*   select multiple row         */
                /* ------------------------------*/  

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

    // document.addEventListener("dblclick", function(e){
    //   //If it's a row
    //  if (isDescendant(document.getElementById('tbody-list'), e.toElement)) {
    //     // We get the closest tr ID
    //     var cell = getClosestParent('TR', e.toElement);
    //     alert("Ouvre la fiche " + cell.dataset.id)
    //  }
    // });



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



        $scope.etatInterIcon = {
          INT: {c:'success', i:'check'},
          ENC: {c:'warning', i:'refresh'},
          APR: {c:'default', i:''},
          ANN: {c:'danger', i:'close'},
          DEV: {c:'info', i:'align-justify'}
        }

      $scope.getClientPaymentClass = function(info) {
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



      $scope.toggleSidebar = function(i) {
        if ($('.side-menu').css('margin-left') == "0px") {
           $(".side-menu>div>ul>li:not(.toggleButton)").css("visibility", "hidden")
           $('.side-body').css('margin-left', "63px");
           $('.side-menu').css('margin-left', "-160px");

        }
        else {
           $('.side-body').css('margin-left', "220px");
           $('.side-menu').css('margin-left', "0px");
           $(".side-menu>div>ul>li:not(.toggleButton)").css("visibility", "visible")
        }
        $('.fa-bars.fa-2x').toggleClass('fa-rotate-270');
      }


}).config(['$locationProvider', function($locationProvider){
    $locationProvider.html5Mode(true).hashPrefix('!');
}]);;