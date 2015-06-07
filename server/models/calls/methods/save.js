module.exports = function(schema) {
    schema.statics.save = function(req, res) {
        return new Promise(function(resolve, reject) {
            var params = req.body;
            params.duration = Math.floor((Date.now() - params.date) / 1000);
            params.login = req.session.login;
            db.model('calls')(params)
                .save()
                .then(resolve, reject);
        })
    }
}
