module.exports = function(db) {

    return new db.Schema({
        io: String,
        status: String,
        withoperator: String,
        from: String,
        to: String,
        dest: String,
        duration: Number,
        _id: Date
    });

}
