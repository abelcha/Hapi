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



                /* ------------------------------*/
                /*          ROW PREVIEW          */
                /*    edisonpro like preview     */
                /* ------------------------------*/  




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

