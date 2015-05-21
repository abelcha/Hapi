module.exports = function(schema) {
    var uuid = require('uuid')
    var moment = require('moment');
    moment.locale('fr');


    schema.statics.getOS = function(params) {
        return new Promise(function(resolve, reject) {
            db.model('intervention').findOne({
                id: params.id
            }).then(function(doc)  {
                if (!doc) reject("not found")
                edison.pdf({
                    html: params.html,
                    template: 'os',
                    args: {
                        os: doc.numOs,
                        data: doc,
                        date: moment().format('LL'),
                        logo: edison.logo,
                    },
                    buffer: params.buffer,
                    fileName: "/tmp/" + uuid.v4() + ".pdf"
                }).then(function(buffer) {
                    resolve(buffer);
                })
            });
        })
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
