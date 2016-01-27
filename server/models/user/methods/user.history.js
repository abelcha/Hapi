module.exports = function(schema) {
    var moment = require('moment')
    schema.statics.history = {
        unique: true,
        findBefore: true,
        method: 'GET',
        fn: function(user, req, res) {
            if (!req.session.root) {
                res.json([])
            }
            console.log('here')
            db.model('event').find({
                date: {
                    $lt: moment().toDate(),
                    $gt: moment().startOf('day').toDate()
                },
                login: user.login
            }, function(err, resp) {
                console.log(err, resp);
                res.json(resp)
            })
        }
    }
}
