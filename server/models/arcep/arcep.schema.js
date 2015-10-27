module.exports = function(db) {

    return new db.Schema({
        t: {
            type: String,
            index: true
        },
        e:{
            type:String,
            index:'text'
        }
    });

}
