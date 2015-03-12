function ActualisePlaces(value, id)
{
    $('#' + id).val(value ? value.long_name : '');
}

var map;
var input = document.getElementById('pac-input');
var geocoder = new google.maps.Geocoder();
var directionsDisplay = new google.maps.DirectionsRenderer();
var directionsService = new google.maps.DirectionsService();
var ClientAddress;
var ClientMarker;
var ZOOM_DEFAULT = 10;

var GreyIcon = "http://electricien13003.com/alvin/img/Abel-Grey2.png";
var RedIcon = "http://electricien13003.com/alvin/img/Abel-Red2.png";
var BlueIcon = "http://electricien13003.com/alvin/img/Abel-Blue3.png";
var GreenIcon = "http://electricien13003.com/alvin/img/Abel-Green3.png";

function PlaceDisplayAction(place)
{
    if (!place.geometry)
      return (0);

    // If the place has a geometry, then present it on a map.
    if (place.geometry.viewport) {
      map.fitBounds(place.geometry.viewport);
    } else {
      map.setCenter(place.geometry.location);
      map.setZoom(17);  // Why 17? Because it looks good.
    }
      if (ClientMarker)
         ClientMarker.setMap(null);
      ClientMarker = new google.maps.Marker({
      map: map,
      title:'search',
      animation: google.maps.Animation.DROP,
      icon:GreyIcon,
      anchorPoint: new google.maps.Point(0, -29)
    });
    ClientMarker.setPosition(place.geometry.location);
    ClientMarker.setVisible(true);



    google.maps.event.addListener(ClientMarker, 'click', function() 
    {
        map.setCenter(new google.maps.LatLng(ClientMarker.position.k, ClientMarker.position.B));
        var NewZoom = (map.getZoom() == 17 ? ZOOM_DEFAULT : 17);
        map.setZoom(NewZoom); 
    });

    var address = '';
    if (place.address_components) {
      address = [
        (place.address_components[0] && place.address_components[0].short_name || ''),
        (place.address_components[1] && place.address_components[1].short_name || ''),
        (place.address_components[2] && place.address_components[2].short_name || '')
      ].join(' ');
       ClientAddress = address;      
/*      if (place.address_components[4])
      {*/
        console.log(place);
        ActualisePlaces(place.address_components[6], 'cp');
        ActualisePlaces(place.address_components[0], 'numero');
        ActualisePlaces(place.address_components[1], 'rue');
        ActualisePlaces(place.address_components[2], 'ville');
/*        $('#lat').val(place.geometry.location.k);
        $('#lng').val(place.geometry.location.B);*/

     // }
    }
    map.setZoom(ZOOM_DEFAULT);
}


function GetGeocoderGeometry(address, length, CallbackFunction)
{
          autocompleteService = new google.maps.places.AutocompleteService();
          autocompleteService.getPlacePredictions( {'input': address , 'offset': length},
              function listentoresult(list, status)
              {
                 geocoder.geocode( { 'address': list[0].description}, 
                    function(results, status) 
                    {
                          if (status == google.maps.GeocoderStatus.OK)
                            CallbackFunction(results[0]);
                    });
              });
}

function CreateMap()
{

  var mapOptions = {
    center: new google.maps.LatLng(46.52863469527167,2.43896484375),
    zoom: 6
  };
  map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

 var h = $('#MapDiv').width();
  $('#map-canvas').css('width', h);
  $('#map-canvas').css('height', h * 0.55);

}

function initialize()
{
    CreateMap();
    var autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.setComponentRestrictions();
    autocomplete.bindTo('bounds', map);

    var infowindow = new google.maps.InfoWindow();

      google.maps.event.addListener(autocomplete, 'place_changed', function() {
      place = autocomplete.getPlace();
      if(typeof place.address_components == 'undefined')
          GetGeocoderGeometry(place.name, place.length, function(place)
          {
              PlaceDisplayAction(place);
          });
        
      else
        PlaceDisplayAction(place);
  });



      initialize2();
}

google.maps.event.addDomListener(window, 'load', initialize);




var placeSearch, autocomplete2;

function initialize2() {
  // Create the autocomplete object, restricting the search
  // to geographical location types.
  autocomplete2 = new google.maps.places.Autocomplete(
      /** @type {HTMLInputElement} */(document.getElementById('facture_geocoder')),
      { types: ['geocode'] });
  // When the user selects an address from the dropdown,
  // populate the address fields in the form.
  google.maps.event.addListener(autocomplete2, 'place_changed', function() {
    fillInAddress();
  });
}

function fillInAddress()
{
  var place = autocomplete2.getPlace();
  ActualisePlaces(place.address_components[6], 'cp_facture');
  ActualisePlaces(place.address_components[0], 'numero_facture');
  ActualisePlaces(place.address_components[1], 'adresse_facture');
  ActualisePlaces(place.address_components[2], 'ville_facture');
}

function geolocate() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var geolocation = new google.maps.LatLng(
          position.coords.latitude, position.coords.longitude);
      autocomplete.setBounds(new google.maps.LatLngBounds(geolocation,
          geolocation));
    });
  }
}

