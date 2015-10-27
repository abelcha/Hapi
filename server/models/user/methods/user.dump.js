module.exports = function(schema) {
    var users = requireLocal('config/_users');
    schema.statics.dump = function(req, res) {
        return new Promise(function(resolve, reject) {
            db.model('user').remove({}, function() {
                users.forEach(function(e) {
                    e._id = e.login;
                    var model = db.model('user')
                    var user = new model(e)
                    user.save()
                });
                return resolve("ok")
            });
        });

    };
}
