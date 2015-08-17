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
            if (method.endsWith('.js')) {
                require(folder + '/methods/' + method)(schema)
            }
        });
        console.log(model)
        var model = mongoose.model(model, schema);

    })
/*
    basePath = basePath + '/' + "event"
    getDirectories(basePath).forEach(function(model) {
        if (model !== "methods") {
            var folder = basePath + '/' + model;
            var schema = require(folder + '/schema')(mongoose);

            require(folder + '/validator')(schema);

            fs.readdirSync(folder + '/methods').forEach(function(method) {
                if (method.endsWith('.js')) {
                    require(folder + '/methods/' + method)(schema)
                }
            });
            console.log(model)
            var model = mongoose.model(model, schema);
        }
    });*/
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
