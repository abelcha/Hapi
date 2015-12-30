 module.exports = function(schema) {

    schema.statics.get = {
        unique: true,
        findBefore: false,
        method: 'GET',
        fn: function(call_id, req, res) {
            var fs = require('fs')
            var uuid = require('uuid')
            var key = requireLocal('config/_keys');

            var getFile = function(filename, callback) {
                var JSFtp = require("jsftp");
                var ftp = new JSFtp({
                    host: key.axialis.hostname,
                    user: key.axialis.username,
                    pass: key.axialis.password
                });

                ftp.get(filename, function(err, socket) {
                    if (err || !socket) {
                        return callback(err)
                    }
                    return callback(null, socket)

                })
            }

            var filePath = process.cwd() + '/cache/' + call_id + '.mp3'

            if (fs.existsSync(filePath)) {
                return fs.readFile(filePath, function(err, file) {
                    console.log('CACHED')
                    return res.contentType("audio/mpeg").sendFile(filePath)
                })
            }
            getFile(call_id + ".mp3", function(err, socket) {
                if (err) {
                    return res.status(404).send('not found');
                }
                socket.pipe(res.contentType("audio/mpeg"));

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
