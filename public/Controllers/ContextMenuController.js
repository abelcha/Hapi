
app.controller('ContextMenuController', function($scope, $rootScope, $http) {

  $rootScope.rightClickedRow = -1;


  $scope.contextMenu  = [
                          {id:0, display:true, title: "Fiche d'intervention"},
                          {id:1, display:true, title: "Liste Inters SST"},
                          {id:2, display:true, title: "Voir la fiche SST"},
                          {id:3, display:false, title: "Appeler SST"},
                          {id:4, display:false, title: "Envoyer SMS"},
                          {id:5, display:false, title: "Appeler Client"},
                          {id:6, display:false, title: "Envoyer SMS Client"},
                          {id:7, display:false, title: "Annuler L'inter"},
                          {id:8, display:false, title: "Confirmer l'inter"},
                          {id:9, display:false, title: "Envoyer l'inter"}    
                        ];

    $scope.contextClick = function(id, e) {

    $http.get('/api/interventions/findOne/' + JSON.stringify({id:$rootScope.rightClickedRow}))
          .success(function(data) {
          if (id == 0) 
          {
            if (e.metaKey)
              window.open('/inter/id=' + data.id);
            else
              alert("fiche inter");
          //  alert(1);
          }


    });
      $rootScope.rightClickedRow = -1;
    };

    var getElementType = function(e) {
      var target;
      for (var i = 0; i < 5; i++) {
        if (e.path[i].tagName === "TD")
          break;
      };
      return (e.path);
    }

    var filterMenuList = function(element, info) {
      var type = getElementType(element);
      console.log(type);
      //$scope.contextMenu.map(function(e){ e.display = true; return (e)});
     // $scope.contextMenu[3].display = true;
    };

  $rootScope.RightClickOnRow = function(e, info) {
           filterMenuList(e, info);
           $rootScope.rightClickedRow = info.id;
           $('#contextMenu').css("left", e.pageX + "px").css("top",  (e.pageY) + "px")

}

});

app.directive('ngRightClick', function($parse) {
    return function(scope, element, attrs) {
        var fn = $parse(attrs.ngRightClick);
        element.bind('contextmenu', function(event) {
            scope.$apply(function() {
                event.preventDefault();
                fn(scope, {$event:event});
            });
        });
    };
});