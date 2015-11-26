module.exports = function(core) {
    var _ = require('lodash');

    function mongoError(reject) {
        return function(err) {
            var str = String(err)
            str = str.replaceAll('Path', 'Le champ')
            str = str.replaceAll('is required', 'est requis')
            str = str.replaceAll('ValidationError', 'Erreur')
            reject(str);
        }
    }


    return function(id, req, res) {
        return new Promise(function(resolve, reject) {
            var _new = req.body
            core.model().findOne({
                id: _new.id
            }).then(function(_old) {
                if (!_old)
                    return reject("ERROR => unkown " + core.name + " '" + id + "'");

                var preUpdate = core.preUpdate || function(_old, _new, session, callback) {
                    return callback(null, _new);
                }
                try {
                    preUpdate(_old, _new, req.session, function(err, nwData) {
                        if (err) {
                            return reject(err);
                        }
                        for (k in nwData) {
                            if (!(_.contains(['id', '_id', '__v'], k))) {
                                _old[k] = nwData[k];
                            }
                        }

                        _old.save(function(err, resp) {
                            if (err) {
                                return mongoError(reject)(err);
                            }
                            edison.event('UPDATE_' + core.NAME).id(id).login(req.session.login).data({
                                old: nwData,
                                nw: _old
                            })
                            if (_.isFunction(core.postUpdate)) {
                                core.postUpdate(resp, nwData, req.session);
                            }
                            resolve(resp);
                        });

                    })
                } catch (e) {
                    __catch(e)
                }

            })




        })
    }
}
