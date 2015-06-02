angular.module("edison").filter('addressPrettify', function() {
  return function(address) {
    return (address.n + " " +
      address.r + " " +
      address.cp + ", " +
      address.v + ", " +
      "France")
  };
});

angular.module("edison").filter('addressXY', function() {
  return function(address) {
    if (!address ||  !address.lt || !address.lg)
      return ("0, 0");
    return (address.lt + ", " + address.lg);
  };
});

angular.module("edison").filter('placeToXY', function() {
  return function(place) {
    var location = place.geometry.location;
    console.log(location)
    return location.lat() + ', ' + location.lng();
  }
});


angular.module("edison").filter('placeToAddress', function() {
  return function(place) {
    var address = function(place) {
      if (place.address_components) {
        var a = place.address_components;
        this.n = a[0] && a[0].short_name;
        this.r = a[1] && a[1].short_name;
        this.cp = a[6] && a[6].short_name;
        this.v = a[2] && a[2].short_name;
      }
      this.lt = place.geometry.location.lat();
      this.lg = place.geometry.location.lng();
    };
    address.prototype.isStreetAddress = (this.n && this.r);
    address.prototype.latLng = this.isStreetAddress ? (this.lt + ', ' + this.lg) : '0, 0'
    
    return new address(place);
  }
});

