module.exports = function(db) {

    return new db.Schema({
        date: {
            type: Date,
            default: Date.now
        },
        text: {
            type: String,
            required: true
        },
        from: {
            type: String,
            required: true
        },
        to: {
            type: String,
            required: true
        },
        done: Date
    });
}
