module.exports = function(schema) {
    schema.statics.search = {
        unique: true,
        findBefore: false,
        method: 'GET',
        fn: function(tel, req, res) {
            var reg = '^' + tel.substr(0, 6) + "";
            return new Promise(function(resolve, reject) {
                db.model("arcep").find({
                    e: {
                        $regex: reg
                    }
                }).then(function(doc) {
                    //console.log("==>", doc)
                    if (!doc || !doc.length)
                        return reject(doc);
                    return resolve(doc)
                }, reject)
            })
        }
    }
}
