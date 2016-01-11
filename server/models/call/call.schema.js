module.exports = function(db) {

    return new db.Schema({
        io: String,
        archived: {
            type: Boolean,
            default: false
        },
        status: String,
        withoperator: String,
        from: String,
        to: String,
        dest: String,
        date: Date,
        poste:String,
        duration: Number,
        _id: Date
    });

}
