module.exports = function(db) {

    return new db.Schema({
        //date
        date: {
            type: Date,
            default: Date.now
        },
        //login
        login: String,
        //type
        type: String,
    }, {
        strict: false
    });

}
