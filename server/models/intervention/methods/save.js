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
        var updateInter = function(data) {
            return new Promise(function(resolve, reject) {
                db.model('intervention').findOne({
                    id: data.id
                }).then(function(doc) {
                    if (!doc)
                        reject("Intervention Inconnu");
                    for (k in data) {
                        if (k !== 'status')
                            doc[k] = data[k];
                    }
                    doc.save().then(resolve, dbError(reject));
                }, dbError(reject))
            })
        }

        var createInter = function(data) {
            return new Promise(function(resolve, reject) {
                lock.writeLock(function(release) {
                    db.model('intervention').getNextID(function(nextID) {
                        data.login = {
                            ajout: req.session.login
                        }
                        data.id = nextID;
                        data._id = nextID;
                        var inter = db.model('intervention')(data);
                        inter.save().then(function(doc) {
                            release();
                            resolve(doc);
                            db.model('document').changeLink({
                                oldID: data.tmpID,
                                newID: doc.id,
                                model: 'intervention'
                            });
                            db.model('calls').changeLink({
                                oldID: data.tmpID,
                                newID: doc.id,
                            })
                            if (data.devisOrigine) {
                                db.model('devis').findOne({
                                        id: data.devisOrigine
                                    })
                                    .then(function(devis) {
                                        if (!devis)
                                            return false;
                                        devis.status = "TRA";
                                        devis.transfertId = data.id;
                                        devis.save().then()
                                    })
                            }
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
            var saveData = data.id ? updateInter(data) : createInter(data);
            saveData.then(function(doc) {
                resolve(doc);
            }, reject)
        })
    }
}
