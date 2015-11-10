module.exports = function(schema) {

    schema.statics.check = {
        unique: true,
        findBefore: true,
        method: 'POST',
        fn: function(sign, req, res) {
            return new Promise(function(resolve, reject) {
                sign.ok = true;
                sign.login.done = req.session.login;
                sign.date.done = new Date();
                sign.save().then(function(resp) {
                    db.model('artisan').findOne({
                        id: resp.sst_id
                    }).then(function(sst) {
                        console.log('-->', !!sst)
                        return sst && sst.save().then(resolve, reject);
                    })
                }, reject);
            })
        }
    }
}
