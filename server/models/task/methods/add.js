module.exports = function(schema) {
    schema.statics.add = function(req, res) {
        db.model('sms')(params).save().then(Promise.resolve, Promise.reject);
    }
}
