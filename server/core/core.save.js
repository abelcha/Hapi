 module.exports = function(core) {
    var _ = require('lodash')

    function mongoError(reject) {
        return function(err) {
            var str = String(err)
            str = str.replaceAll('Path', 'Le champ')
            str = str.replaceAll('is required', 'est requis')
            str = str.replaceAll('ValidationError', 'Erreur')
            reject(str);
        }
    }

    return function(req, res) {
        return new Promise(function(resolve, reject) {
            data = req.body;
            core.model().getNextID(data, function(nextID) {
                if (!data.login || !data.login.ajout) {
                    data.login = {
                        ajout: req.session.login
                    }
                }
                data.id = nextID;
                data._id = nextID;

                var doc = core.model()(data);


                var preSave = core.preSave || function(data, session, callback) {
                    return callback(null, data);
                }
                preSave(data, req.session, function(err, resp) {
                    if (err) {
                        return reject(err);
                    }
                    doc.save(function(err, resp) {
                        if (err) {
                            return mongoError(reject)(err);
                        }
                        edison.event('NEW_' + core.NAME).login(req.session.login).id(data.id).data(data).save();
                        if (_.isFunction(core.postSave))
                            core.postSave(resp, data, req.session);
                        resolve(resp);
                    });

                })

            });
        })
    }
 }
