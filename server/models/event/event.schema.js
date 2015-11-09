module.exports = function(db) {
    return new db.Schema({
        date: {
            type: Date,
            default: Date.now
        },
        login: String,
        data: {

        },
        service: String,
        dest: String,
        color: String,
        self: Boolean,
        message: String,
        id: Number,
        type: String,
    });

}
