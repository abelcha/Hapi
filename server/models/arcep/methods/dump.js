module.exports = function(schema) {
    schema.statics.dump = function(req, res) {
        return new Promise(function(resolve, reject) {
            var _ = require('lodash')
            require('fs').readFile('config/arcep.json', 'utf8', function(err, data) {
                if (err) {
                    return console.log(err);
                }
                db.model('arcep').remove({}, function() {
                    var tab = JSON.parse(data);
                    tab.forEach(function(e) {
                        var model = db.model('arcep');
                        var x = new model(e);
                        x.save();
                    })
                    resolve("ok");
                })
            })
        })
    }
}
