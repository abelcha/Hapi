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
                var inter = core.model()(data);

                if (_.isFunction(core.preSave))
                    core.preSave(data, req.session);
                inter.save().then(function(doc) {
                    edison.event('NEW_' + core.NAME).login(req.session.login).id(data.id).data(data).save();
                    if (_.isFunction(core.postSave))
                        core.postSave(doc, data, req.session);
                    resolve(doc);
                }, mongoError(reject));
            });
        })
    }
 }
