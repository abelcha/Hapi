module.exports = function(schema) {

    schema.statics.changeLink = function(options) {
        console.log("==>", options)

        return db.model('calls').update({
            origin: options.oldID
        }, {
            origin: options.newID
        }, {
            multi: true
        }).then(function(resp) {
            console.log('lole', resp);
        }, function(resp) {
          console.log("ee", resp)
        })
    }
}
