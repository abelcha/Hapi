module.exports = function(schema) {

    schema.statics.archiveScan = function(req, res) {
        return new Promise(function(resolve, reject) {
            var request = require('request');
            var _ = require('lodash');

            request.get('http://electricien13003.com/SCAN/list.php', function(err, resp, locals) {
                locals = _.filter(JSON.parse(locals), function(e) {
                    return e.endsWith('.pdf') && e.length === 23
                })
                request.get('http://electricien13003.com/alvin/dumpScanner.php', function(err, resp, db) {
                    //console.log(locals);
                    db = JSON.parse(db)
                    console.log(db);
                    resolve('ok')
                })
            });

            /* db.model('document').update({
                     link: options.oldID
                 }, {
                     link: options.newID
                 }, {
                     multi: true
                 })
                 .then(function(e) {
                     if (e.nModified > 0) {
                         var x = "/V2/" + options.model + '/';
                         document.move(x + options.oldID, x + options.newID)
                             .then(resolve, reject);
                     }
                 }, reject);*/
        })
    }
}
