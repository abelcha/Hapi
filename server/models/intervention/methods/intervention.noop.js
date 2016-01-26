module.exports = function(schema) {

    schema.statics.noop = {
        unique: true,
        findBefore: true,
        populateArtisan: true,
        method: 'GET',
        fn: function(inter, req, res) {
            return new Promise(function(resolve, reject) {
                inter.save().then(resolve, reject)
            })
        }
    }
}
