module.exports = function(db) {

    return new db.Schema({
        _id: {
            type: Number,
            required: true,
            default: Date.now,
        },
        d: {
            type: Date,
            default: Date.now,
            required: true
        },
        v:{
            
        }
    });

}
