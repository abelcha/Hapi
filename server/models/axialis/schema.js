module.exports = function(db) {

    return new db.Schema({
        id_call: String,
        id_sst: Number,
        id_intervention: Number,
        status_code: Number,
        redirect_to: String,
        date: {
            type: Date,
            default: Date.now
        },
        _type: String, //CONTACT/CALLBACK
    });

}
