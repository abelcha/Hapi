module.exports = function(schema) {

    schema.statics.view = function(prod, req, res) {
        return new Promise(function(resolve, reject) {
            db.model('product').findById(prod).then(function(resp) {
                if (!resp)
                    return reject('unknown product')
                resolve(resp)
            }, reject)
        })
    }

    schema.statics.list = function(req, res) {
        return new Promise(function(resolve, reject) {
            db.model('product').find().then(resolve, reject)
        })
    }
};
