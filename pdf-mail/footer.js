module.exports = {
	tel: '09.72.40.42.42',
	fax: '09.72.39.33.46',
	address: {
		r: '32 rue Fernand Pelloutier',
		cp: 92110,
		v: 'Clichy'
	},
	SIRET: '753 805 035 00064',
	APE: '4321A',
	TVA: 'FR88753805035',

	full: function() {
		return 'Tél. ' +this.tel+ ' - Fax. ' +this.fax+
		' - Siège social : S.A.R.L EDISON SERVICES - ' +this.address.r+ ' ' +this.address.cp+ ' ' +this.address.v+
		' - SIRET : ' +this.SIRET+ ' - ' +this.APE+ ' - ' +this.TVA+ ' - au capital de 4 000 €'
	}
}
