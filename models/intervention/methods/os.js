module.exports = function(schema) {
    var uuid = require('uuid')
    var moment = require('moment');
    moment.locale('fr');

    schema.statics.getOSFile = function(doc) {
        console.log("here2");
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

    /*    schema.statics.test = function(id, req, res) {
            var exec = require('child_process').exec;
            var _this = this;
            return new Promise(function(resolve, reject) {
                _this.os({
                    html: req.query.html,
                    id: id
                }).then(function(result) {
                    var file_uuid = uuid.v4();
                    exec('gs -dBATCH -dNOPAUSE -q -sDEVICE=pdfwrite -sOutputFile=out.pdf foo.pdf lol.pdf && echo "OK"',
                        function(error, stdout, stderr) {
                            console.log(error, stdout, stderr);
                        });
                    console.log(result)

                })
                resolve('ok')
            })
        }
    */
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
