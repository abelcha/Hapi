module.exports = function(schema) {

    schema.statics.view = function(prod, req, res) {
        return new Promise(function(resolve, reject) {
            db.model('combo').findById(prod).then(function(resp) {
                if (!resp)
                    return reject('unknown product')
                resolve(resp)
            }, reject)
        })
    }

    schema.statics.list = function(req, res) {
        return new Promise(function(resolve, reject) {
            db.model('combo').find().then(resolve, reject)
        })
    }
};
