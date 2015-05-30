module.exports = function(db) {

    return new db.Schema({
        date: {
            type: Date,
            default: Date.now
        },
        origin: Number,
        link: Number,
        id: {
            type: String,
            required: true,
            index: true
        },
        to: {
            type: String,
            required: true,
        },
        login: String,
        text: {
            type: String,
            required: true
        },
        type: {
            type: String,
            default: 'UK',
            index: true
        },
        track: {
            type: Boolean,
            default: true,
            index: true
        },
        status: {
            type: Number,
            default: 0,
            index: true
        }
    });

}
