module.exports = function(db) {

    return new db.Schema({
        login: {
            ajout: String,
            done: String
        },
        date: {
            ajout: Date,
            done: Date
        },
        inter_id: {
            type: Number,
            ref: 'intervention'
        },
        sst_id: {
            type: Number,
            ref: 'artisan'
        },
        sst_nom: String,
        _type: String,
        subType: String,
        level: String,
        service: String,
        nom: String,
        ok: {
            type: Boolean,
            default: false
        }
    });
}
