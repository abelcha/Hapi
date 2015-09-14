module.exports = function(schema) {
    var uuid = require('uuid');
    var moment = require('moment')
    schema.statics.scan = function(req, res) {
        return new Promise(function(resolve, reject) {
            db.model('document')({
                login: req.session.login,
                model: req.body.model,
                type: req.body.type,
                link: req.body.link,
                _id: uuid.v4(),
                virtual:true,
                extension: "pdf",
                name:'SCAN.pdf'
            }).save().then(resolve, reject);
        })
    }
}
