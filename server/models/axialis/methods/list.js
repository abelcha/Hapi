module.exports = function(schema) {
    schema.statics.xlist = function(req, res) {
        return new Promise(function(resolve, reject) {
            db.model('axialis').find(req.query).select('-__v').sort('-date').then(resolve, reject)
        });

    };
}
