module.exports = function(schema) {

    schema.statics.changeLink = function(options) {
        return new Promise(function(resolve, reject) {
            db.model('document').update({
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
                }, reject);
        })
    }
}
