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
            var data = req.body
            core.model().findOne({
                id: data.id
            }).then(function(doc) {
                if (!doc)
                   return reject("ERROR => unkown " + core.name + " '" + id + "'");

                if (_.isFunction(core.preUpdate))
                    core.preUpdate(doc, data, req.session);

                for (k in data) {
                    if (!(_.contains(['id', '_id', '__v', 'status'], k))) {
                        doc[k] = data[k];
                    }
                }

                doc.save().then(function(resp) {
                    try {

                        if (_.isFunction(core.postUpdate)) {
                            core.postUpdate(resp, data, req.session);
                        }
                        return resolve(resp);
                    } catch (e) {
                       console.log(e.stack)
                    }
                }, mongoError(reject))
            }, mongoError(reject))
        })
    }
}
