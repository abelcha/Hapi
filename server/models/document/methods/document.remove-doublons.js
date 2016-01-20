module.exports = function(schema) {

    schema.statics.removeDoublons = function(req, res) {
        var _ = require('lodash');

        var diffCompare = function(a) {
            return Math.abs(a.diff)
        }

        return new Promise(function(resolve, reject) {
            edison.v1.get("SELECT COUNT(name) AS cnt, name, id FROM  scanner WHERE name != '0' AND name!='' GROUP BY name HAVING COUNT( name) >1", function(err, resp) {
                var _in = _.map(resp, 'name').join("', '")
                _.each(resp.slice(0, 100), function(e) {
                        edison.v1.get("SELECT * FROM scanner WHERE name='" + e.name + "'", function(err, files) {
                            var max = _.max(files, diffCompare);
                            var min = _.min(files, diffCompare);
                            //console.log(max.moved, min.moved);
                            var archived = Number(min.archived == 1 || max.archived == 1);
                            var setMax = "UPDATE scanner SET checked='0', moved='0', archived='0', name='' WHERE id='" + max.id + "'";
                            var setMin = "UPDATE scanner SET checked='1', moved='1', archived='" + archived + "' WHERE id='" + min.id + "'";
                           	edison.v1.set(setMax)
                           	edison.v1.set(setMin)
                        })
                    })
                    /*        		edison.v1.get("SELECT * FROM scanner WHERE name in ('" + _in + "')", function(err, resp) {
                            			console.log(err, resp)
                            		})*/
            })
            resolve('ok')
        }).catch(__catch)
    }
}
