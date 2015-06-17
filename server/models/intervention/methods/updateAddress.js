module.exports = function(schema) {

    schema.statics.updateAddress = function(req, res) {
        return new Promise(function(resolve, reject) {
            db.model('devis').find({
                'login.ajout': 'clement_x'
            }).limit(3).then(function(doc) {
                doc.forEach(function(e) {
                    console.log(e.client.address);
                });
            })
            resolve("ok")
        })
    }
}
