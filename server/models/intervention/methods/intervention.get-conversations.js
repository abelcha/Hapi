module.exports = function(schema) {

    schema.statics.getConversations = {
        unique: true,
        findBefore: true,
        method: 'GET',
        fn: function(intervention, req, res) {
           	return new Promise(function(resolve, reject) {
           	
           		resolve(intervention)
           	
           	})
        }
    }
}
