module.exports = function(schema) {
    var ReadWriteLock = require('rwlock');
    var lock = new ReadWriteLock();

    function dbError(reject) {
        return function(err) {
            var str = String(err).split('Path').join('Le champs');
            str = str.split('is required').join('est requis');
            str = str.split('ValidationError').join('Erreur');
            str = str.split('.,').join("\r\n\r\n");
            reject(str);
        }
    }
    schema.statics.__save = function(req, res) {

        var updateArtisan = function(data) {
            return new Promise(function(resolve, reject) {
                db.model('artisan').findOne({
                    id: data.id
                }).then(function(doc) {
                    if (!doc)
                        reject("Artisan Inconnu");
                    for (k in data) {
                        doc[k] = data[k];
                    }
                    doc.save().then(resolve, dbError(reject));
                }, dbError(reject))
            })
        }

        var createArtisan = function(data) {
            return new Promise(function(resolve, reject) {
                lock.writeLock(function(release) {
                    db.model('artisan').getNextID(function(nextID) {
                        data.login = {
                            ajout: req.session.login
                        }
                        data.id = nextID;
                        data._id = nextID;
                        var artisan = db.model('artisan')(data);
                        artisan.save().then(function(doc) {
                            release();
                            resolve(doc);
                        }, function(err) {
                            release();
                            dbError(reject)(err)
                        });
                    });
                });
            })
        }


        var data = req.body
        return new Promise(function(resolve, reject) {
            var saveData = data.id ? updateArtisan(data) : createArtisan(data);
            saveData.then(function(doc) {
                resolve(doc);
            }, reject)
        })
    }
}
