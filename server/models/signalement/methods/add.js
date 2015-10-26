module.exports = function(schema) {
    schema.statics.add = function(req, res) {
        return new Promise(function(resolve, reject)  {
            var params = db.model('signalement')(req.body);
            params.login.ajout = req.session.login;
            params.date.ajout = req.session.date;
            params.save().then(resolve, reject)
        })
    }
    
    schema.statics.view = function(req, res) {
        return new Promise(function(resolve, reject) {
            db.model('signalement').find().then(resolve, reject);
        })
    }
}
