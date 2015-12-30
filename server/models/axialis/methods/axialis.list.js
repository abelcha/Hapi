module.exports = function(schema) {
    schema.statics.xlist = function(req, res) {
        return new Promise(function(resolve, reject) {
            db.model('axialis').find(req.query).select('-__v').sort('-date').then(resolve, reject)
        });

    };

    schema.statics.get = {
        unique: true,
        findBefore: false,
        
        method: 'GET',
        fn: function(call_id, req, res) {
            /* var ftp = require('ftp-get')
             console.log('here')
             ftp.get("ftp://edison:%2F%408.r2DmXcZwvdKs@ftp.axialys.net/17261081.mp3", function(err, resp) {
                 res.contentType("audio/mpeg");
                 res.setHeader('Content-disposition', 'attachment; filename=lol.mp3');
                 res.write(new Buffer(resp, "binary"));
                 res.end()
             })*/
            return res.status(404).send('nop')
            var async = require('async')
            var JSFtp = require("jsftp");
            var fs = require('fs')
            var streamToBuffer = require('stream-to-buffer')
            console.log('new ftp')
            var ftp = new JSFtp({
                host: "ftp.axialys.net",
                user: "edison", // defaults to "anonymous" 
                pass: "/@8.r2DmXcZwvdKs" // defaults to "@anonymous" 
            });

            var getFile = function(filename, callback) {
                var pathname = process.cwd() + '/cache/' + filename

                /*        fs.readFile(pathname, function(err, file) {
                            if (fs.existsSync(pathname)) {
                                console.log('CACHED')
                                return callback(null, pathname)
                            }
                        })*/
                ftp.get(filename, function(err, socket) {
                    if (err || !socket) {
                        return callback(err)
                    }
                    var myFile = fs.createWriteStream(process.cwd() + '/cache/' + call_id + '.mp3');
                    socket.pipe(myFile);
                    return callback(null, socket)

                })
            }
            console.log('getfile')
            getFile(call_id + ".mp3", function(err, resp) {
                if (err) {
                    return res.status(404).send('not found');
                }
                if (typeof resp === 'string') {
                    return res.sendFile(resp)
                }
                console.log('got response')
                    /*  resp.on('end', function() {
                          res.end({"status":"Completed"});
                      });*/
                    /*resp.on('data', function() {
                        console.log('-->', 'data')
                    })*/
                var myFile = fs.createWriteStream(process.cwd() + '/cache/' + call_id + '.mp3');

                resp.pipe(res);

                /*streamToBuffer(resp, function(err, buffer) {
                    res.contentType("audio/mpeg");
                    console.log('sendinf buffer')
                    res.send(buffer);
                })*/
                resp.on('error', function(exc) {
                    sys.log("FTP ERROR: " + exc);
                });
            })


            /*            return new Promise(function(resolve, reject) {
                            console.log('GET', call_id)

                            try {

                                ftp.get(call_id + ".mp3", function(err, resp) {
                                    var str = "";
                                    if (err) {
                                        return ftp.get(call_id + ".wav", function(err, socket2) {

                                            if (err) {
                                                return resolve('')
                                            }
                                            streamToBuffer(socket2, function(err, buffer2) {

                                                var gspeech = require('gspeech-api');
                                                var fs = require('fs');
                                                var uuid = require('uuid');
                                                var id = uuid.v4();
                                                fs.writeFileSync("/tmp/" + id + '.wav', buffer2)
                                                    
                                                res.contentType("audio/wav");
                                                res.send(buffer2);
                                            })
                                            socket.resume();
                                        })
                                    }
                                    streamToBuffer(socket, function(err, buffer) {
                                        res.contentType("audio/mpeg");
                                        res.send(buffer);
                                    })
                                    socket.resume();
                                });
                            } catch (e) {
                                reject('pas de fichier')
                            }*/

            /* ftp.ls(".", function(err, res) {
                 console.log(err, res)
                 res.forEach(function(file) {
                     console.log(file.name);
                 });
             });*/
        }
    }
}
