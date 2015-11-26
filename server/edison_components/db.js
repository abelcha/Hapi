module.exports = function() {
    var mongoose = require("mongoose");
    var fs = require('fs');
    var path = require('path');
    var _ = require('lodash');

    mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/EDISON');

    function getDirectories(srcpath) {
        return fs.readdirSync(srcpath).filter(function(file) {
            return fs.statSync(path.join(srcpath, file)).isDirectory();
        });
    }
    var basePath = process.cwd() + '/server/models/'
    getDirectories(basePath).forEach(function(model) {
        var folder = basePath + model;
        var schema = require(folder + '/' + model + '.schema')(mongoose);

        require(folder + '/' + model + '.validator')(schema);

        fs.readdirSync(folder + '/methods').forEach(function(method) {
            if (_.endsWith(method, '.js') && !_.startsWith(method, '-')) {
                require(folder + '/methods/' + method)(schema)
            } else {
                //console.log(method)
            }
        });
        if (model === 'intervention' || model === 'devis' || model === 'artisan') {
            requireLocal('server/core/core.index.js')(model, schema)
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
        },
        prix: function() {
            return {
                $cond: [{
                    $eq: ['$prixFinal', 0]
                }, '$prixAnnonce', '$prixFinal']
            }
        },
        and:function(a, b) {
            return {
                $and:[a, b]
            }
        },
        or:function(a, b) {
            return {
                $or:[a, b]
            }
        },
        cond: function(field, value, rA, rB) {
            return {
                $cond: [{
                    $eq: [field, value]
                }, (rA || 1), (rB || 0)]
            }
        },
        sum:function(field) {
            return {
                $sum:field
            }
        },
        sumCond: function(field, value, rA, rB) {
            return {
                $sum: {
                    $cond: [{
                        $eq: [field, value]
                    }, (rA || 1), (rB || 0)]
                }
            }
        },
        isDefined: function() {
            return {
                $exists: true
            }
        },
        pluck: function(data, value, rangeMax) {
            return _.map(_.range(1, rangeMax), function(day) {
                var fnd = _.find(data, '_id', day)
                return _.round((fnd && fnd[value]) || 0, 2);
            })
        },
        between: function(a, b) {
            return {
                $gt: a,
                $lt: b
            }
        }
    }
    return mongoose;

}
