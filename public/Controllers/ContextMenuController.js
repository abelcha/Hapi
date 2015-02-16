
app.controller('ContextMenuController', function($scope, $rootScope) {

  $rootScope.rightClickedRow = -1;

  $scope.contextMenu  = [
                          {id:0, display:false, title: "Liste Inters SST" },
                          {id:1, display:false, title: "Voir la fiche SST" },
                          {id:2, display:true, title: "Appeler SST" },
                          {id:3, display:true, title: "Envoyer SMS" },
                          {id:4, display:true, title: "Appeler Client" },
                          {id:5, display:false, title: "Envoyer SMS Client" },
                          {id:6, display:false, title: "Annuler L'inter" },
                          {id:7, display:false, title: "Confirmer l'inter" },
                          {id:8, display:false, title: "Envoyer l'inter" }
                        ];

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
      $scope.contextMenu.map(function(e){ e.display = false; return (e)});
      $scope.contextMenu[3].display = true;
    };

  $rootScope.RightClickOnRow = function(e, info) {
           filterMenuList(e, info);
           $rootScope.rightClickedRow = info.id;
           $('#contextMenu').css("left", e.pageX + "px").css("top",  (e.pageY) + "px")
   /*       contextStyle.left = e.clientX + "px";     //
          contextStyle.top = e.clientY + "px";      // We show the context menu
        //  resetSelectedRowColor();                  // Reset the row color
          // Select the closest Parent TD*/
          //selectedRow = getClosestParent('TD', e.toElement)
          // Set row color to blue
          //selectedRow.parentNode.style.backgroundColor = "rgba(33, 150, 243, 0.12)";
           // Refresh the context menu
/*          $scope.refreshContextMenu();
        } else {
          // Hide the context menu and hide color anyway
          contextStyle.display = "none";
          resetSelectedRowColor();
        }*/
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