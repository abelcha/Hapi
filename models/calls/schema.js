module.exports = function(db) {

    return new db.Schema({
        date: {
            type: Date,
            default: Date.now()
        },
        login: String,
        duration: Number,
        link: Number,
        origin: Number,
        to: String,
        description: String,
        response: Boolean
    });

}
