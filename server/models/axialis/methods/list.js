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
            return new Promise(function(resolve, reject) {

                var JSFtp = require("jsftp");
                var mp3 = require('mp3-parser');
                var streamToBuffer = require('stream-to-buffer')
                var ftp = new JSFtp({
                    host: "ftp.axialys.net",
                    user: "edison", // defaults to "anonymous" 
                    pass: "/@8.r2DmXcZwvdKs" // defaults to "@anonymous" 
                });

                ftp.get(call_id + ".mp3", function(err, socket) {
                    var str = "";
                    if (err)
                        return resolve(err);
                    streamToBuffer(socket, function(err, buffer) {
                    	res.contentType("audio/mpeg");
                    	res.send(buffer);
                    })

                    /*
                                        socket.on("data", function(d) {
                                            str += d.toString();
                                        })
                                        socket.on("close", function(hadErr) {
                                            if (hadErr)
                                                console.error('There was an error retrieving the file.');
                                        });*/
                    socket.resume();
                });
                /* ftp.ls(".", function(err, res) {
                     console.log(err, res)
                     res.forEach(function(file) {
                         console.log(file.name);
                     });
                 });*/
            })
        }
    }
}
