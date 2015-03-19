function Client() {

  var self = this;

  this.serializeAddress = function(address) {
    return (address.n + " " + 
            address.r + " " + 
            address.cp + ", " + 
            address.v + ", " +
            "France")
  }

  this.placeGetAddress = function(place) {
   address = {};
    if (place && place.address_components)
      address = {
          n: place.address_components[0].short_name,
          r: place.address_components[1].short_name, 
          cp:place.address_components[6].short_name, 
          v: place.address_components[2].short_name,
          lt: place.geometry.location.k,
          lg: place.geometry.location.D
      };
    return address;
  }

  this.setAddress = function(newPlace) {

  	self.address = self.placeGetAddress(newPlace);
  	
  }


  this.getInfoQuartier = function(place) {
    $.ajax({
      url: '/crowling/quartier',
      type: 'GET',
      data: {search: place.formatted_address, lat:place.geometry.location.k, lng:place.geometry.location.D},
    })
    .done(function(data) {

      self.infoClient = "Revenu Moyen :" + data.revenuMoyen + "€<br>" +
                    "Taux Chomage :" + data.tauxChomage + "€<br>" +
                    "Age Moyen    :" + data.ageMoyen + "<br>";
      $('#InfoWindow').html(self.infoClient);
    })
    .fail(function(data) {
      $('#InfoWindow').html("Erreur : Impossible de charger les donées");
    });
  }

}