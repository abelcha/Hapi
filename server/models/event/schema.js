module.exports = function(db) {
    return new db.Schema({
        //date

        date: {
            type: Date,
            default: Date.now
        },
        login: String,
        data: {

        },
        id: db.Schema.Types.Mixed,
        //type
        type: String,
    });

}
