module.exports = function() {
    var mongoose = require("mongoose");
    var fs = require('fs');
    var path = require('path');

    mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/EDISON');

    function getDirectories(srcpath) {
        return fs.readdirSync(srcpath).filter(function(file) {
            return fs.statSync(path.join(srcpath, file)).isDirectory();
        });
    }
    var basePath = process.cwd() + '/server/models/'
    getDirectories(basePath).forEach(function(model) {
        var folder = basePath + '/' + model;
        var schema = require(folder + '/schema')(mongoose);

        require(folder + '/validator')(schema);

        fs.readdirSync(folder + '/methods').forEach(function(method) {
            if (method.endsWith('.js') && !method.startsWith('-')) {
                require(folder + '/methods/' + method)(schema)
            } else {
                //console.log(method)
            }
        });
        if (model === 'intervention' || model === 'devis' || model === 'artisan') {
            requireLocal('server/core')(model, schema)
        }
        var model = mongoose.model(model, schema);

    })

    mongoose.utils = {
        round: function(field) {
            return {
                $divide: [{
                        $subtract: [{
                            $multiply: [field, 100]
                        }, {
                            $mod: [{
                                $multiply: [field, 100]
                            }, 1]
                        }]
                    },
                    100
                ]
            }
        }
    }
    return mongoose;

}
