module.exports = function(schema) {

    schema.statics.dump = function(req, res) {
        return new Promise(function(resolve, reject) {
            db.model('user').remove({}, function() {
                edison.config.users.forEach(function(e) {
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
