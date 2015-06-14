module.exports = function(schema) {
    var upper = function(str) {
        return str ? str.toUpperCase() : str;
    }

    schema.pre('save', function(next) {
        this.client.nom = upper(this.client.nom)
        this.client.prenom = upper(this.client.prenom)
        this.client.email = upper(this.client.email)
        this.client.address.n = upper(this.client.address.n)
        this.client.address.r = upper(this.client.address.r)
        this.client.address.v = upper(this.client.address.v)
        next();
    });

}
