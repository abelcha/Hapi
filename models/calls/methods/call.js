module.exports = function(schema) {
    schema.statics.add = function(req, res) {
        return new Promise(function(resolve, reject) {
            var params = req.query;
            params.duration = Math.floor((Date.now() - params.date) / 1000);
            params.login = req.session.login;
            db.model('calls')(params)
                .save()
                .then(resolve, reject);
        })
    }
}
