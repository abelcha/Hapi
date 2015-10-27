module.exports = function(schema) {

    schema.statics.scanMoulinette = function(req, res) {
        return new Promise(function(resolve, reject) {
            document.list('/SCAN').then(function(resp) {
                resolve('ok')
            }, reject)  
        })
    }
}
