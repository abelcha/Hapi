module.exports = function(schema) {
    schema.statics.refresh = function(req, res) {
       console.log('REFRESH ok')
    };
}
