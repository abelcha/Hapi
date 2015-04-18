module.exports = {

  getDirectionPath: function(query, callback) {
    npm.googlemaps.directions(query.origin, query.destination, function(err, result) {
      if (!err && result && result.routes && result.routes[0] && result.routes[0].legs && result.routes[0].legs[0]) {
        var steps = result.routes[0].legs[0].steps;
        var rtn = steps.map(function(e) {
          return (e.start_location.lat + ', ' + e.start_location.lng);
        });
        callback(null, rtn)
      } else {
        console.log(result, err)
        callback(err || result);
      }
    });
  },

  staticDirections: function(query, res) {

    var directions = this.getDirectionPath(query, function(err, points) {
      if (err) {
        return res.status(400).send(err);
      }
      console.log("rr==>", err)
      markers = [{
        'location': query.origin
      }, {
        'location': query.destination,
        'color': 'red',
        'label': 'A',
        'shadow': 'false',
        'icon': 'http://chart.apis.google.com/chart?chst=d_map_pin_icon&chld=cafe%7C996600'
      }]

      var styles = [{
        "featureType": "road",
        "elementType": "geometry",
        "stylers": [{
          "lightness": 100
        }, {
          "visibility": "simplified"
        }]
      }, {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [{
          "visibility": "on"
        }, {
          "color": "#C6E2FF"
        }]
      }, {
        "featureType": "poi",
        "elementType": "geometry.fill",
        "stylers": [{
          "color": "#C5E3BF"
        }]
      }, {
        "featureType": "road",
        "elementType": "geometry.fill",
        "stylers": [{
          "color": "#D1D1B8"
        }]
      }];


      paths = [{
        'color': '0x0000ff',
        'weight': '5',
        'points': points
      }]

      var map = npm.googlemaps.staticMap(query.origin, 10, '1000x400', function(err, data) {
        require('fs').writeFileSync('test_map.png', data, 'binary');
      }, false, 'roadmap', markers, styles, paths);
      res.sendFile(rootPath + "/test_map.png");
      /*    npm.googlemaps.staticMap(query.address, 15, '500x400', function(err, data) {
            require('fs').writeFileSync('test_map.png', data, 'binary');
          }, false, 'roadmap', markers, styles, paths);
          res.sendFile(rootPath + "/test_map.png");
        }*/

    });
  }
}
