module.exports = function(schema) {

    schema.statics.comment = {
        unique: true,
        findBefore: true,
        method: 'POST',
        fn: function(artisan, req, res) {
            return new Promise(function(resolve, reject) {
                artisan.comments.push({
                    text: req.body.text,
                    login: req.session.login,
                    date: Date.now()
                })
                artisan.save().then(resolve, reject)
            })
        }
    }
}
