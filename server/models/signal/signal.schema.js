module.exports = function(db) {

    return new db.Schema({
        _type: String,
        subType: String,
        level: String,
        service: String,
        nom: String,
    });
}
