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
    schema.statics.save = function(req, res) {

        var updateDevis = function(data) {
            return new Promise(function(resolve, reject) {
                db.model('devis').findOne({
                    id: data.id
                }).then(function(doc) {
                    if (!doc)
                        reject("Devis Inconnu");
                    for (k in data) {
                        doc[k] = data[k];
                    }
                    doc.historique = [];
                    doc.save().then(resolve, dbError(reject));
                }, dbError(reject))
            })
        }

        var createDevis = function(data) {
            return new Promise(function(resolve, reject) {
                lock.writeLock(function(release) {
                    db.model('devis').getNextID(function(nextID) {
                        data.login = {
                            ajout: req.session.login
                        }
                        data.id = nextID;
                        data._id = nextID;
                        var devis = db.model('devis')(data);
                        devis.save().then(function(doc) {
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
            var saveData = data.id ? updateDevis(data) : createDevis(data);
            saveData.then(function(doc) {
                resolve(doc);
            }, reject)
        })
    }
}
