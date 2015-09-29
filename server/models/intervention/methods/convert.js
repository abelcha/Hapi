module.exports = function(schema) {

    schema.statics.convert = {
        unique: true,
        findBefore: true,
        method: 'GET',
        fn: function(inter, req, res) {
            return new Promise(function(resolve, reject) {
                var V1 = requireLocal('config/_convert_V1');
                console.log(new V1(inter))
                resolve('ok')
            })
        }
    }
}
