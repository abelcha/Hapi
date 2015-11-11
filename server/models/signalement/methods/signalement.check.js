module.exports = function(schema) {

    schema.statics.check = {
        unique: true,
        findBefore: true,
        method: 'POST',
        fn: function(sign, req, res) {
            return new Promise(function(resolve, reject) {
                sign.ok = !sign.ok ;
                console.log('okok')
                sign.login.done = req.session.login;
                sign.date.done = new Date();
                sign.save().then(function(resp) {
                    console.log(resp.sst_id)
                    db.model('artisan').findOne({
                        id: parseInt(resp.sst_id)
                    }).then(function(sst) {
                        console.log('okok', !!sst)
                        return sst && sst.save().then(function() {
                            resolve(resp)
                        }, reject);
                    })
                }, reject);
            })
        }
    }
}
