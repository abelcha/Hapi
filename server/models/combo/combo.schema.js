module.exports = function(db) {

    return new db.Schema({
        title: {
            type: String,
            required: true
        },
        ref: {
            type: String,
            required: true
        },
        produits: {
            type: Array,
            required: true
        },

        categorie: {
            type: String,
            required: true
        },
        text: {
            type: String,
            required: true
        }
    });

}
