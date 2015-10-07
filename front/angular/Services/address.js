angular.module('edison').factory('Address', function() {
    "use strict";

    var Address = function(place, copyContructor) {
        console.log('-->', copyContructor)
        if (place.lat && place.lng) {
            this.lt = place.lat;
            this.lg = place.lng;
        } else if (copyContructor) {
            this.getAddressProprieties(place);
            this.streetAddress = true;
        } else if (this.isStreetAddress(place)) {
            this.getPlaceProprieties(place);
        } else if (this.isLocalityAddress(place)) {
            this.getPlaceLocalityProprieties(place);
        }
        if (place.geometry) {
            this.lt = place.geometry.location.lat();
            this.lg = place.geometry.location.lng();
        }
        this.latLng = this.lt + ', ' + this.lg;
    };

    Address.prototype.getPlaceLocalityProprieties = function(place) {
        var a = place.address_components;
        this.cp = a[1] && a[1].short_name;
        this.v = a[0] && a[0].short_name;
    }

    Address.prototype.getPlaceProprieties = function(place) {
        var a = place.address_components;
        this.n = a[0] && a[0].short_name;
        this.r = a[1] && a[1].short_name;
        this.cp = a[6] && a[6].short_name;
        this.v = a[2] && a[2].short_name;
    }

    Address.prototype.getAddressProprieties = function(address) { 
        this.n = address.n;
        this.r = address.r;
        this.cp = address.cp;
        this.v = address.v;
        this.lt = address.lt;
        this.lg = address.lg;
        this.code = address.code;
        this.etage = address.etage;
        this.batiment = address.batiment;
    }

    Address.prototype.isLocalityAddress = function(place) {
        this.localityAddress = (place.types.indexOf("locality") >= 0);
        return this.localityAddress;
    }

    Address.prototype.isStreetAddress = function(place) {
        var noStreet = ["locality", "country", "postal_code", "route", "sublocality"];
        this.streetAddress = (noStreet.indexOf(place.types[0]) < 0);
        return (this.streetAddress);
    }

    Address.prototype.toString = function() {
        return (this.n + " " + this.r + " " + this.cp + ", " + this.v + ", France")
    }

    return (function(place, copyContructor) {
        return new Address(place, copyContructor);
    })
});
