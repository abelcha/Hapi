module.exports = function(schema) {

    schema.statics.stats = function(req, res) {
        var _ = require('lodash');
        return new Promise(function(resolve, reject) {
            db.model('signalement')
                .aggregate()
                .match({
                    ok: {
                        $ne: true
                    }
                })
                .group({
                    _id: '$service',
                    'level1': db.utils.sumCond('$level', '1'),
                    'level2': db.utils.sumCond('$level', '2'),
                }).exec(function(err, resp) {
                    var rtn = _(resp).groupBy('_id').mapValues('[0]').mapValues(_.partial(_.omit, _, '_id')).value()
                    resolve(rtn)
                })
        })
    }

}
