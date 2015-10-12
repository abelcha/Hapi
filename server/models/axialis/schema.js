module.exports = function(db) {

    return new db.Schema({
        _id: String,
        id_sst: Number,
        id_intervention: Number,
        status_code: Number,
        date: {
            type: Date,
            default: Date.now
        },
        _type: String, //CONTACT/CALLBACK
    });

}
