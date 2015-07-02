module.exports = function(schema) {
    schema.virtual('subStatus').get(function() {
        var d = this.document;
        if (this.status === "POT" && d.contrat && d.cni && d.kbis) {
            return 'HOT';
        }
        if (this.nbrIntervention < 5 && this.nbrIntervention > 0) {
        	return "NEW";
        }
        if (this.nbrIntervention > 15) {
        	return "REGULIER";
        }

    })
}
