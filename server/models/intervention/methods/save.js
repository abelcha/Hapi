module.exports = function(schema) {

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
                        doc[k] = data[k];
                    }
                    doc.save().then(function(result) {
                        resolve(result);
                    }, dbError(reject));
                }, dbError(reject))
            })
        }

        var createInter = function(data) {
            return new Promise(function(resolve, reject) {
                db.model('intervention').getNextID(function(nextID) {
                    data.id = nextID;
                    data._id = nextID;
                    data.login = {
                        ajout: req.session.login
                    }
                    var inter = db.model('intervention')(data);
                    inter.save().then(function(doc) {
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
                    }, dbError(reject))
                })
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
