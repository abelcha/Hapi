module.exports = function(schema) {
    schema.pre('save', function(next) {
        this.client.nom = this.client.nom.toUpperCase()
        this.client.prenom = this.client.prenom.toUpperCase()
        this.client.email = this.client.email.toUpperCase()
        this.client.address.n = this.client.address.n.toUpperCase()
        this.client.address.r = this.client.address.r.toUpperCase()
        this.client.address.v = this.client.address.v.toUpperCase()
    	next();
    });

}
