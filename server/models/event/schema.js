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
        //type
        type: String,
    });

}
