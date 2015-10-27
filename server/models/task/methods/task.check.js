module.exports = function(schema) {

    schema.statics.check = {
        unique: true,
        findBefore: true,
        method: 'POST',
        fn: function(task, req, res) {
            return new Promise(function(resolve, reject) {
                task.checked = !task.checked;
                task.done = new Date();
                task.save().then(resolve, reject);
            })
        }
    }
}
