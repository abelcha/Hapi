module.exports = {

  getDirectionPath: function(query, callback) {
    if (!query.origin || !query.destination) {
      console.log('->null callback')
      return callback(null, []);
    }
    npm.googlemaps.directions(query.origin, query.destination, function(err, result) {
      console.log('->getting directions')

      if (!err && result && result.routes && result.routes[0] && result.routes[0].legs && result.routes[0].legs[0]) {
        console.log('->getting directions callback')

        var steps = result.routes[0].legs[0].steps;
        var rtn = steps.map(function(e) {
          return (e.start_location.lat + ', ' + e.start_location.lng);
        });
        callback(null, rtn)
      } else {
        console.log("->err callback")
        callback(err ||  result);
      }
    });
  },

  staticDirections: function(query, res) {
    console.log('map function')
    var directions = this.getDirectionPath(query, function(err, points) {
      console.log('have direction')

      if (err) {
        console.log("have err")
        return res.status(400).send(err);
      }
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

      if (!query.height) {
        var coeff = 1 / (query.width / 1000);
        var height = parseInt(400 * coeff);
        var width = parseInt(query.width * coeff);
      } else {
        var height = parseInt(query.height);
        var width = parseInt(query.width);
      }


      var zoom = query.zoom || 7;
      if (!query.origin) {
        markers = [];
        query.origin = "Montlucon, france";
        zoom = 5
      }
      console.log("getting static map")
      var map = npm.googlemaps.staticMap(query.origin, zoom, width + 'x' + height, query.precision || 4,
        function(err, data) {
          console.log("--> have callback")
          res.writeHead(200, {
            'Content-Type': 'image/png'
          });
          res.end(data, 'binary');
        }, false, 'roadmap', markers, null, paths);
    });
  }
}
