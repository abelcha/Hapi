module.exports = function(schema) {

    schema.statics.getFiles = {
        unique: true,
        findBefore: false,
        method: 'GET',
        fn: function(id, req, res) {
            return new Promise(function(resolve, reject) {
                id = parseInt(id);
                if (isNaN(id))
                    return reject("Invalid id")

                db.model('document')
                    .find({
                        model: 'intervention',
                        link: id,
                        deleted: false
                    })
                    .then(resolve, reject)

            })
        }
    }
}
