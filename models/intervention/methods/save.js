module.exports = function(schema) {

    function dbError(reject) {
        return function(err) {
            var str = String(err).split('Path').join('Le champs');
            str = str.split('is required').join('est requis');
            str = str.split('.,').join("\r\n\r\n");
            reject(str);
        }
    }

    var updateInter = function(data, options) {
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

    var createInter = function(data, options) {
        return new Promise(function(resolve, reject) {
            var inter = db.model('intervention')(data);
            inter.save().then(function(doc) {
                resolve(doc);
                db.model('document').changeLink({
                        oldID: data.tmpID,
                        newID: doc.id,
                        model: 'intervention'
                    })
                    .then(console.log, console.log);
            }, dbError(reject))
        })
    }

    var envoiInter = function(doc, data) {
        console.log(doc.id, doc.artisan);
        db.model('sms').send({
            to: '0633138868',
            text: "Sms d'envoi OS destiné à " + data.artisan.nomSociete + ' (' + data.artisan.telephone.tel1 + ')',
            link: doc.id,
            type: 'OS'
        }).then(console.log, console.log)

        db.model('intervention').getOS({
            id: doc.id,
            buffer:true
        }).then(function(buffer) {
            mail.sendOS(buffer, data).then(console.log, console.log)
        })
    }


    schema.statics.save = function(req, res) {
        var data = JSON.parse(req.query.data);
        var options = JSON.parse(req.query.options);

        if (options.envoi == true) {
            data.date.envoi = new Date();
            data.status = 'ENV'
        }
        if (options.verification == true) {
            data.date.verification = new Date();
            data.status = 'ATT';
        }
        if (options.annulation == true) {
            data.status = 'ANN';
        }
        return new Promise(function(resolve, reject) {
            var saveData = data.id ? updateInter(data, options) : createInter(data, options);
            saveData.then(function(doc) {
                db.model('intervention').cacheActualise(doc.id);
                if (options.envoi) {
                    envoiInter(doc, data)
                }
                resolve(String(doc.id));
            }, reject)
        })
    }
}
