module.exports = function(schema) {
    var moment = require('moment')
    var async = require('async')
    var _ = require('lodash')

    var getFunc = function(model) {
        return function(callback) {
            var filename = '/BACKUP/' + moment().format('YYYY-MM-DD') + '/' + model + '.json'
            db.model(model).find().limit(10000).select('-_id -cache').then(function(resp) {
                document.upload({
                    filename: filename,
                    data: JSON.stringify(resp),
                }).then(_.partial(callback, null), callback)
            })
        }
    }

    schema.statics.backup = function(callback) {

        if (!isWorker) {
            return edison.worker.createJob({
                name: 'db',
                model: 'intervention',
                method: 'backup',
                req: _.pick(req, 'query', 'session')
            })
        }

        var models = ['intervention', 'artisan', 'devis', 'product', 'user', 'compte', 'combo'];
        models = _.map(models, getFunc);
        async.parallel(models, function(err, resp) {
            callback(err, resp)
        })
    }

    schema.statics.xsend = function(req, res) {
        var ids = req.query.ids.split(', ')
        ids = _.map(ids, function(e) {
            return parseInt(e);
        })
        ids.push(32064)
        console.log('==>', ids)
        db.model(req.query.model ||  'intervention').find({
            id: {
                $in: ids
            }
        }).then(function(resp) {
            async.eachLimit(resp, 5, function(e, cb)  {
                console.log(e.id, 'OK')
                e.save(cb);
            })
        })
    }
}
