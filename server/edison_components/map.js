module.exports = {

  getDirectionPath: function(query, callback) {
    if (!query.origin || !query.destination) {
      return callback(null, []);
    }
    edison.googleMap.directions(query.origin, query.destination, function(err, result) {

      if (!err && result && result.routes && result.routes[0] && result.routes[0].legs && result.routes[0].legs[0]) {

        var steps = result.routes[0].legs[0].steps;
        var rtn = steps.map(function(e) {
          return (e.start_location.lat + ', ' + e.start_location.lng);
        });
        callback(null, rtn)
      } else {
        callback(err ||  result);
      }
    });
  },
  getDistance: function(req, res) {
    var query = req.query
    var _ = require('lodash')
    edison.googleMap.directions(query.origin, query.destination, function(err, result) {
      res.json({
        distance: _.get(result, 'routes[0].legs[0].distance.text', 0),
        duration: _.get(result, 'routes[0].legs[0].duration.text', 0)
      });
    });
  },

  getStaticDirections: function(req, res) {
    var query = req.query;
    var directions = this.getDirectionPath(query, function(err, points) {

      if (err) {
        return res.status(400).send(err);
      }
      markers = [{
        //'icon': 'http://edsx.herokuapp.com//img/gmap/markers/red.png',
        'location': query.origin
      }, {
        //'icon': 'http://edsx.herokuapp.com//img/gmap/markers/blue.png',
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


      var zoom = query.zoom || 9;
      if (!query.origin) {
        markers = [];
        query.origin = "Montlucon, france";
        zoom = 5
      }
      var map = edison.googleMap.staticMap(query.origin, zoom, width + 'x' + height, query.precision || 4,
        function(err, data) {
          res.writeHead(200, {
            'Content-Type': 'image/png'
          });
          res.end(data, 'binary');
        }, false, 'roadmap', markers, null, paths);
    });
  }
}
