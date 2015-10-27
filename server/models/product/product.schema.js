module.exports = function(db) {

    return new db.Schema({
        pu: {
            type: Number,
            required: true
        },
        title: {
            type: String,
            required: true
        },
        desc: {
            type: String,
            required: true
        },
        ref: {
            type: String,
            required: true
        }
    });

}
