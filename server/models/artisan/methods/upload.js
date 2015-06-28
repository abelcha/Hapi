module.exports = function(schema) {
    schema.statics.upload = {
        unique: true,
        findBefore: true,
        method: "POST",
        fn: function(inter, req, res) {
            return new Promise(function(resolve, reject) {
                if (!req.files || !req.files.file || !req.files.file.buffer || !req.files.file.extension) {
                    return reject("Invalid File");
                }
                if (req.files.file.size > 5000000)
                    return reject("File is too big");
                var fileName = ["/V2/artisan", inter.id, [req.body.name, req.files.file.extension].join('.')].join('/')
                document.upload({
                    filename: fileName,
                    data: req.files.file.buffer
                }).then(function(params) {
                    inter.document[req.body.name] = {
                        file: req.body.name,
                        extension: '.' + req.files.file.extension,
                        date: Date.now(),
                        login: req.session.login
                    };
                    inter.save().then(resolve, reject)
                }, reject);
            });

        }
    }

}
