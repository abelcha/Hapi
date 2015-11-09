module.exports = function(schema) {

    schema.statics.manage = {
        unique: true,
        findBefore: true,
        method: 'POST',
        fn: function(artisan, req, res) {
            return new Promise(function(resolve, reject) {
                artisan.managed = true;
                artisan.save().then(resolve, reject)
            })
        }
    }

}
