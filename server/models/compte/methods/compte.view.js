module.exports = function(schema) {

    schema.statics.view = function(prod, req, res) {
        return new Promise(function(resolve, reject) {
            db.model('compte').findById(prod).then(function(resp) {
                if (!resp)
                    return reject('unknown compte')
                resolve(resp)
            }, reject)
        })
    }

    schema.statics.list = function(req, res) {
        return new Promise(function(resolve, reject) {
            db.model('compte').find().then(resolve, reject)
        })
    }
};
