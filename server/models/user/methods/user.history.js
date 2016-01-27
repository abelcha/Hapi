module.exports = function(schema) {
    var moment = require('moment')
    schema.statics.history = {
        unique: true,
        findBefore: true,
        method: 'GET',
        fn: function(user, req, res) {
            console.log('here')
            console.log({
                    $lt: moment().toDate(),
                    $gt: moment().add(-24, 'hours').toDate()
                })
            db.model('event').find({
                date: {
                    $lt: moment().toDate(),
                    $gt: moment().add(-24, 'hours').toDate()
                },
                login: user.login
            }, function(err, resp) {
                console.log(err, resp);
                res.json(resp)
            })
        }
    }
}
