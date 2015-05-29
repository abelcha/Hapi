module.exports = function(schema) {
    var uuid = require('uuid')
    var moment = require('moment');
    moment.locale('fr');

    schema.statics.getOSFile = function(doc) {
        return edison.pdf({
            html: false,
            template: 'os',
            args: {
                os: doc.numOs,
                data: doc,
                date: moment().format('LL'),
                logo: edison.logo,
            },
            buffer: true,
            mail:true,
        })
    }


    schema.statics.getOS = function(id) {
        db.model('intervention').findOne({
            id: id
        }).then(function(doc)  {
            if (!doc)
                return Promise.reject("not found")
            return getOSFile(doc, params)
        });
    };


    schema.statics.osPreview = function(id, req, res) {
        if (!req.query.html)
            res.contentType("application/pdf")
        return this.getOS({
            html: req.query.html,
            buffer: true,
            id: id
        })
    }
}
