module.exports = function(schema) {

    schema.statics.changeLink = function(options) {
        return db.model('calls').update({
            origin: options.oldID
        }, {
            origin: options.newID
        }, {
            multi: true
        })
    }
}
