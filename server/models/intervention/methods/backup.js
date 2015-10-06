module.exports = function(schema) {
    var moment = require('moment')
    var async = require('async')
    var _ = require('lodash')
    
    var getFunc = function(model) {
        return function(callback) {
            var filename = '/BACKUP/' + moment().format('YYYY-MM-DD') + '/' + model + '.json'
            db.model(model).find().then(function(resp) {
                document.upload({
                    filename: filename,
                    data: JSON.stringify(resp),
                }).then(_.partial(callback, null), callback)
            })
        }
    }

    schema.statics.backup = function(callback) {
        var models = ['intervention', 'artisan', 'devis', 'product', 'user', 'compte', 'combo'];
        models = _.map(models, getFunc);
        async.parallel(models, function(err, resp) {
            callback(err, resp)
        })
    }
}
