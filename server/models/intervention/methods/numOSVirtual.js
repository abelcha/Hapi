module.exports = function(schema) {
    schema.virtual('numOS').get(function() {
        return "0".repeat(6 - String(this.id).length) + this.id;
    });

}
