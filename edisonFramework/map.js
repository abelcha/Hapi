module.exports = {

  getDirectionPath: function(query, callback) {
    if (!query.origin || !query.destination) {
      return callback(null, []);
    }
    npm.googlemaps.directions(query.origin, query.destination, function(err, result) {
      if (!err && result && result.routes && result.routes[0] && result.routes[0].legs && result.routes[0].legs[0]) {
        var steps = result.routes[0].legs[0].steps;
        var rtn = steps.map(function(e) {
          return (e.start_location.lat + ', ' + e.start_location.lng);
        });
        callback(null, rtn)
      } else {
        console.log(result, err)
        callback(err ||  result);
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
        'color': 'blue',
      }]

      paths = [{
        'color': '0x0000ff',
        'weight': '5',
        'points': points
      }]


      var coeff = 1 / (query.width / 1000);
      var height = parseInt(400 * coeff);
      var width = parseInt(query.width * coeff);

      console.log(query.width, height, width);

      var zoom = query.zoom || 7;
      if (!query.origin) {
        markers = [];
        query.origin = "Montlucon, france";
        zoom = 5
      }

      var options = {
        zoom: zoom,
        width: width + 'x' + height
      }
      var map = npm.googlemaps.staticMap(query.origin, zoom, width + 'x' + height, 4,
        function(err, data) {
          res.writeHead(200, {
            'Content-Type': 'image/png'
          });
          res.end(data, 'binary');
        }, false, 'roadmap', markers, null, paths);
    });
  }
}
