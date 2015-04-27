function gMap(client) {

  var self = this;

  ZOOM_OVERVIEW = 6;
  ZOOM_BASIC = 10;
  ZOOM_MAX = 17;

  ICON_GREY = "/img/map/grey.png";
  ICON_RED = "/img/map/red.png";
  ICON_BLUE = "/img/map/blue.png";
  ICON_GREEN = "/img/map/green.png";

  INFOWINDOW_PRELOADER = '<div id="InfoWindow"><img style="margin-left:23px;width:40px" src="/img/map/preloader.gif"></div>';

  INPUT_CLIENT = document.getElementById('pac-input');
  INPUT_FACTURATION = document.getElementById('facture_geocoder');

  this.directionsDisplay = new google.maps.DirectionsRenderer();
  this.directionsService = new google.maps.DirectionsService();
  this.circles = [];


  this.getMap = function() {
    return (self.map);
  }

  this.createMarker = function(options, visibility) {
    options.map = self.map;
    options.anchorPoint = new google.maps.Point(0, -29);
    var marker = new google.maps.Marker(options);
    marker.setVisible(visibility);
    if (options.onclick) {
      google.maps.event.addListener(marker, 'click', options.onclick);
    } 
    return (marker)
  }


  this.showArtisanRoute = function(newArtisan, client) {
    if (client.address) {
      var request = {
          origin: client.serializeAddress(newArtisan.add),
          destination: client.serializeAddress(client.address),
          travelMode: google.maps.TravelMode.DRIVING
      };
      self.directionsService.route(request, function(response, status) {
      if (status == google.maps.DirectionsStatus.OK) {
          self.directionsDisplay.setMap(self.getMap());
          self.directionsDisplay.setOptions({ preserveViewport: true, suppressMarkers: true });
          self.directionsDisplay.setDirections(response);
      }
      });
    }
  }


  this.drawCircle = function(add, radius, id) {
  
    self.circles[id] = new google.maps.Circle({
      center:new google.maps.LatLng(add.lt,add.lg),
      radius:radius,
      strokeColor:"#2680F3",
      strokeOpacity:0.9,
      strokeWeight:3,
      fillColor:"#2680F3",
      fillOpacity:0.01
    });
    self.circles[id].setMap(self.getMap());
  }

  this.setClientPlace = function(newPlace) {
            
        // If the place has a geometry, then present it on a map.

/*--------------------------- Center Map -----------------------------*/   

      if (newPlace.geometry.viewport) {
        self.map.fitBounds(newPlace.geometry.viewport);
      } else {
        self.map.setCenter(newPlace.geometry.location);
        self.map.setZoom(ZOOM_BASIC);
      }

/*----------------------------- Marker -----------------------------*/   

      if (client.marker) {
        client.marker.setMap(null);
      }

      client.marker = self.createMarker({
        title: 'Client',
        animation: google.maps.Animation.DROP,
        position: newPlace.geometry.location,
        icon: ICON_GREY,
        onclick:function() {
          self.map.setCenter(client.marker.position)
          self.map.setZoom(self.map.getZoom() == ZOOM_MAX ? ZOOM_BASIC : ZOOM_MAX); 
        }
      }, false);


/*--------------------------- InfoWindow ----------------------------*/        

      client.infoWindow = new google.maps.InfoWindow({
        content: INFOWINDOW_PRELOADER,
        pixelOffset: new google.maps.Size(0, 25)
      });

      client.infoWindow.open(self.map, client.marker);
        google.maps.event.addListener(client.infoWindow,'closeclick',function() {
        client.marker.setVisible(true);
      });
/*      window.setTimeout(function() { 
        client.infoWindow.close();
        client.marker.setVisible(true);
      }, 15000);*/

/*-------------------------- Adress Input -----------------------------*/      
    if (newPlace.address_components) {
       client.setAddress(newPlace); 
    } 
      self.map.setZoom(ZOOM_BASIC);
       
  }



/*-----------------------------------------------------------------------------*/
/*-----------------------------------------------------------------------------*/
/*------------------------------- CONSTRUCTOR  --------------------------------*/
/*-----------------------------------------------------------------------------*/
/*-----------------------------------------------------------------------------*/


    // Create the map
    self.map = new google.maps.Map(document.getElementById('map-canvas'), {
      center: new google.maps.LatLng(46.52863469527167,2.43896484375),
      zoom: ZOOM_OVERVIEW,

    });


    // Add input for adress autocomplete
      
    self.map.controls[google.maps.ControlPosition.TOP_LEFT].push(INPUT_CLIENT);
    self.autocomplete = new google.maps.places.Autocomplete(INPUT_CLIENT);
    self.autocomplete.setComponentRestrictions();
    self.autocomplete.bindTo('bounds', self.map);
      
    //When user enters new address
    self.placeChanged = function() {

      place = self.autocomplete.getPlace();
      //if the user hit enter without selecting proposition
      if(typeof place.address_components == 'undefined') {
        // find list of predictions
          new google.maps.places.AutocompleteService().getPlacePredictions({
            input: place.name,
            offset: place.length
          }, function(list, status) {
              // geocode the first proposition    
              new google.maps.Geocoder().geocode({
                address: list[0].description
              }, function(results, status) {
                  // if everything is OK actualise client address
                  if (status == google.maps.GeocoderStatus.OK)
                     self.setClientPlace(results[0]);
              });
          });

      } 
      else {
        // the user have selected a proposition
        self.setClientPlace(place);
        client.getInfoQuartier(place);
      }
    };

  // si une autre personne regle la facture on autocomplete ses coordonnées
  var payeurAutocomplete = new google.maps.places.Autocomplete((INPUT_FACTURATION), {types:['geocode']});
  google.maps.event.addListener(payeurAutocomplete, 'place_changed', function() {
      console.log("payer adress have changed");
  });

};
