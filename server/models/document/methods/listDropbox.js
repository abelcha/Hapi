   module.exports = function(schema) {
       schema.statics.listDropbox = function(req, res) {
           return new Promise(function(resolve, reject)  {
               document.list('/SCAN').then(resolve, reject)
           })
       }
   }
