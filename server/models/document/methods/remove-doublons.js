

module.exports = function(schema) {

    schema.statics.removeDoublons = function(req, res) {
        var _ = require('lodash');

        return new Promise(function(resolve, reject) {
        	edison.v1.get("SELECT COUNT(name) AS cnt, name FROM  scanner GROUP BY name HAVING COUNT( name) >1", function(err, resp) {
        		console.log(err, _.pluck(resp, 'name'))
        	})
 
        }).catch(__catch)
    }
}
