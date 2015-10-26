module.exports = function(schema) {

    schema.statics.absence = {
        unique: true,
        findBefore: true,
        method: 'POST',
        fn: function(artisan, req, res) {
            return new Promise(function(resolve, reject) {
                console.log(req.body);
                artisan.absence = ({
                    start: req.body.start,
                    end: req.body.end,
                    login: req.session.login,
                    date: Date.now()
                })
                artisan.save().then(resolve, reject)
            })
        }
    }
}
