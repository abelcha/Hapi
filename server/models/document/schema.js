module.exports = function(db) {

    return new db.Schema({
        date: {
            type: Date,
            default: Date.now
        },
        name: String,
        model: String,
        type: String,
        _id: String,
        link: Number,
        extension: String,
        deleted: {
            type: Boolean,
            default: false
        },
        virtual: Boolean,
        login: {
            type: String,
            default: 'Inconnu'
        }
    })
}
