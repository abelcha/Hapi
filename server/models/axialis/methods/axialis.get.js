 module.exports = function(schema) {

    var getFile = function(filename, callback) {
        var key = requireLocal('config/_keys');
        var JSFtp = require("jsftp");
        var ftp = new JSFtp({
            host: key.axialis.hostname,
            user: key.axialis.username,
            pass: key.axialis.password
        });
        ftp.get(filename, function(err, socket) {
            if (err || !socket) {
                callback(err)
            } else {
                callback(null, socket)
            }
            ftp.raw.quit(function(err, data) {
                if (err) return console.error(err);

                console.log("Bye!");
            });
        })
    }


    schema.statics.ls = function(req, res) {
         var key = requireLocal('config/_keys');
        var JSFtp = require("jsftp");
        var ftp = new JSFtp({
            host: key.axialis.hostname,
            user: key.axialis.username,
            pass: key.axialis.password
        });
        ftp.ls(".", function(err, res) {
            console.log(err, res)
            res.forEach(function(file) {
                console.log(file.name);
            });
        });
    }


    schema.statics.cache = function(req, res) {
        db.model('axialis').get.fn(req.query.id, req, res)
    }

    schema.statics.get = {
        unique: true,
        findBefore: false,
        method: 'GET',
        fn: function(call_id, req, res) {
            var fs = require('fs')
            var uuid = require('uuid')



            var filePath = process.cwd() + '/cache/axialis/' + call_id + '.mp3'

            if (res && fs.existsSync(filePath)) {
                return fs.readFile(filePath, function(err, file) {
                    console.log('CACHED')
                    res.setHeader('Content-disposition', 'attachment; filename=' + call_id + '.mp3');
                    return res.contentType("audio/mpeg").sendFile(filePath)
                })
            }
            console.log('GET')
            getFile(call_id + ".mp3", function(err, socket) {
                if (err) {
                    return res && res.status(404).send('not found');
                }
                console.log('PIPE')
                if (res) {
                    res.contentType("audio/mpeg")
                    res.setHeader('Content-disposition', 'attachment; filename=' + call_id + '.mp3');
                    socket.pipe(res);
                }

                var tmpFilePath = '/tmp/' + uuid.v4()
                var myFile = fs.createWriteStream(tmpFilePath);

                socket.pipe(myFile)
                    .on('finish', function() {
                        console.log('ok')
                        fs.rename(tmpFilePath, filePath, function(err, resp) {
                            console.log(err, resp)
                        })
                    });
                socket.on('error', function(exc) {
                    sys.log("FTP ERROR: " + exc);
                });
            })
        }
    }
 }
