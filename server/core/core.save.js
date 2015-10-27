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
             console.log('1')
             core.model().getNextID(function(nextID) {
                 data.login = {
                     ajout: req.session.login
                 }
                 data.id = nextID;
                 data._id = nextID;
                 console.log('2')
                 var inter = core.model()(data);
                 console.log('3')

                 if (_.isFunction(core.preSave))
                     core.preSave(data, req.session);
                 console.log('4')
                 inter.save().then(function(doc) {
                     console.log('5')
                     edison.event('NEW_' + core.NAME).login(req.session.login).id(data.id).data(data).save();
                     console.log('6')
                     if (_.isFunction(core.postSave))
                         core.postSave(doc, data, req.session);
                     console.log('7')
                     resolve(doc);
                 }, mongoError(reject));
             });
         })
     }
 }
