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
             console.log('save')
             core.model().getNextID(function(nextID) {
                 data.login = {
                     ajout: req.session.login
                 }
                 data.id = nextID;
                 data._id = nextID;
                 var inter = core.model()(data);

                 if (_.isFunction(core.preSave))
                     core.preSave(data, req.session);
                 console.log('save1232')

                 inter.save().then(function(doc) {
                     console.log('savethen')

                     if (_.isFunction(core.postSave))
                         core.postSave(doc, data, req.session);
                    console.log("postSave")
                     resolve(doc);
                 }, mongoError(reject));
             });
         })
     }
 }
