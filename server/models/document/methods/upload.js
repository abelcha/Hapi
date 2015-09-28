module.exports = function(schema) {
    var moment = require('moment');
    schema.statics.upload = function(req, res) {
        return new Promise(function(resolve, reject) {
            if (!req.files || !req.files.file || !req.files.file.buffer || !req.files.file.extension) {
                return reject("Invalid File");
            }
            if (req.files.file.size > 5000000)
                return reject("File is too big");
            // var name = moment().format(req.session.login + ' - ' + 'YYYY-MM-DD-HH-mm-ss[.pdf]')
            console.log('here');
            document.upload({
                filename: '/V2_PRODUCTION/' + req.body.link + '/' + req.files.file.originalname,
                data: req.files.file.buffer,
            }).then(function(resp) {
                resolve('ok');
            }, reject);
            /*document.upload({
              login: req.session.login,
              name: req.files.file.originalname,
              model: req.body.model,
              type: req.body.type,
              link: req.body.link,
              data: req.files.file.buffer,
              extension: req.files.file.extension
            }).then(function(params) {
              db.model('document')(params).save().then(resolve, reject);
            }, reject);*/
        })
    }
}
