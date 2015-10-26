module.exports = function(schema) {

    schema.statics.stats = function(req, res) {
        var _ = require('lodash');
        return new Promise(function(resolve, reject) {
            db.model('signalement')
                .aggregate()
                .match({})
                .group({
                    _id: '$service',
                    'ok': db.utils.sumCond('$ok', true),
                    'nok': db.utils.sumCond('$ok', true, 0, 1),
                }).exec(function(err, resp) {
                    var rtn = _(resp).groupBy('_id').value()
                    console.log(rtn)
                    resolve('ok')
                })
        })
    }

}
