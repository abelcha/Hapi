module.exports = function(schema) {
    var _ = require('lodash');
    schema.virtual('envois').get(function() {
        return _.get(this, 'historique.length', 0);
    });

}
