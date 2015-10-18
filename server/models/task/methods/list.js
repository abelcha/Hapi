module.exports = function(schema) {
    schema.statics.get = function(req, res) {
        return new Promise(function(resolve, reject) {
            db.model('task').find({}).sort('-date').then(function(docs) {
                resolve(docs)
            })
        })
    }

    schema.statics.relevant = function(req, res) {
    	var moment = require('moment')
        return new Promise(function(resolve, reject) {
            db.model('task').find({
                to: req.query.user || req.session.user,
                $or: [{
                    checked: false,
                }, {
                    date: {
                        $gt: moment().startOf('day').toDate()
                    }
                }]
            }).then(function(docs) {
                resolve(docs)
            })
        })
    }
}
