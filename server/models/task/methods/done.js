module.exports = function(schema) {

    schema.statics.done = {
        unique: true,
        findBefore: true,
        method: 'GET',
        fn: function(task, req, res) {
            return new Promise(function(resolve, reject) {
                task.done = new Date();
                task.save().then(resolve, reject);
            })
        }
    }
}
