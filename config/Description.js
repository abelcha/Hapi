var Description = function(inter) {
    this.inter = inter;
    this.desc = inter.description
}

var rmve = function(str, a) {
    return str.split(a).join('');
}

var strip = function(s) {
    s = rmve(s, 'DE')
    s = rmve(s, "D'")
    s = rmve(s, 'AU')
    s = rmve(s, 'A')
    return s;
}

Description.prototype.change = function() {
    var _this = this;
/*    if (this.selected && this.selected.name) {
        this.saved.push(this.selected.name);
    }
    var res = _.map(this.saved, _.trim).join(' + ')
    window.setTimeout(function() {
        console.log('-->', res)
        _this.inter.description = res;
    }, 1000)*/
}

Description.prototype.search = function(str) {
    var _ = require('lodash');
    var resemblance = require('resemblance');
    var tab = str.split('+')
    this.saved = tab.slice(0, -1)
    str = tab.pop()
    var list = _(this.data).map(function(e) {
            var res = 1 - resemblance.compareStrings(strip(e), str)
            return {
                match: res,
                name: e
            }
            // return _.deburr(e).startsWith(str.toUppercase())
        }).sortBy('match').slice(0, 10).value()
        /*    console.log("--------------------")
            _.each(list, function(e) {
                console.log(e)
            })*/
    return list;
}

Description.prototype.data = [
    "ATTESTATION DE RECHERCHE DE FUITE",
    "CHANGEMENT DE BARILLET",
    "CHANGEMENT DE GROUPE DE SÉCURITÉ",
    "CHANGEMENT DE MÉCANISME WC",
    "CHANGEMENT DE SERRURE",
    "CHANGEMENT GROUPE DE SECURITÉ",
    "CHANGEMENT MECANISME CHASSE D'EAU",
    "CHANGEMENT SERRURE BOITE AU LETTRE",
    "CHANGEMENT SERRURE",
    "DEBOUCHAGE BAIGNOIRE",
    "DEBOUCHAGE CAMION",
    "DEBOUCHAGE CANALISATION",
    "DEBOUCHAGE CANALISATION DOUCHE",
    "DEBOUCHAGE CANALISATION CUISINE",
    "DEBOUCHAGE CANALISATION EVIER",
    "DEBOUCHAGE CANALISATION MACHINE A LAVER",
    "DEBOUCHAGE CANALISATION WC",
    "DEBOUCHAGE CANALISATION",
    "DEBOUCHAGE DOUCHE",
    "DEBOUCHAGE EVIER CUISINE",
    "DEBOUCHAGE EVIER",
    "DEBOUCHAGE LAVABO",
    "DEBOUCHAGE SANI BROYEUR",
    "DEBOUCHAGE TOILETTE",
    "DEBOUCHAGE WC",
    "DEVIS ELECTRIQUE",
    "DEVIS REMPLACEMENT DE VITRAGE",
    "DEVIS SERRURERIE",
    "DIAGNOSTIC DE PANNE ELECTRIQUE",
    "DIAGNOSTIC ELECTRIQUE",
    "ENTRETIEN CHAUDIÈRE GAZ",
    "FORFAIT BOITE AU LETTRE",
    "FUITE BALLON",
    "FUITE DERRIERE WC",
    "FUITE MECANISME CHASSE D'EAU",
    "FUITE RADIATEUR",
    "FUITE SOUS BAIGNOIRE",
    "FUITE SOUS CHAUFFE EAU",
    "FUITE SOUS EVIER",
    "FUITE SOUS LA DOUCHE",
    "FUITE SOUS LAVABO",
    "FUITE SOUS WC",
    "FUITE TUYAUTERIE CUIVRE",
    "FUITE WC",
    "OUVERTURE + REMPLACEMENT",
    "OUVERTURE DE COFFRE",
    "OUVERTURE DE PORTE + CHANGEMENT DE BARILLET",
    "OUVERTURE DE PORTE + CHANGEMENT DE CYLINDRE",
    "OUVERTURE DE PORTE + REMPLACEMENT",
    "OUVERTURE DE PORTE CLAQUÉ",
    "OUVERTURE DE PORTE DE CAVE",
    "OUVERTURE DE PORTE DE GARAGE",
    "OUVERTURE DE PORTE FERMÉE",
    "OUVERTURE DE PORTE GARAGE",
    "OUVERTURE DE PORTE",
    "RECHERCHE DE FUITE + DEVIS DE TRAVAUX",
    "RECHERCHE DE FUITE + RÉPARATION SI POSSIBLE",
    "RECHERCHE DE FUITE GENERALE",
    "RECHERCHE DE FUITE SALLE DE BAIN",
    "RECHERCHE DE FUITE SOUS BAIGNOIRE",
    "RECHERCHE DE FUITE SOUS LA DOUCHE",
    "RECHERCHE DE FUITE",
    "RECHERCHE DE PANNE + MISE EN SERVICE",
    "RECHERCHE DE PANNE BALLON D'EAU CHAUDE",
    "RECHERCHE DE PANNE BALLON",
    "RECHERCHE DE PANNE CHAUDIERE GAZ",
    "RECHERCHE DE PANNE CHAUDIERE GAZ",
    "RECHERCHE DE PANNE CHAUDIERE",
    "RECHERCHE DE PANNE CHAUDIÈRE GAZ",
    "RECHERCHE DE PANNE CHAUDIÈRE",
    "RECHERCHE DE PANNE CHAUFFE EAU ELECTRIQUE",
    "RECHERCHE DE PANNE CHAUFFE EAU GAZ",
    "RECHERCHE DE PANNE CHAUFFE EAU",
    "RECHERCHE DE PANNE ELELECTRIQUE + MISE EN SERVICE",
    "RECHERCHE DE PANNE ÉLECTRIQUE",
    "RECHERCHE DE PANNE",
    "REMPLACEMENT BALLON 200L",
    "REMPLACEMENT BALLON 300L",
    "REMPLACEMENT BALLON",
    "REMPLACEMENT BARILLET",
    "REMPLACEMENT CHAUFFE EAU 200L",
    "REMPLACEMENT CYLINDRE EUROPEEN",
    "REMPLACEMENT CYLINDRE",
    "REMPLACEMENT DE BARILLET",
    "REMPLACEMENT DE CYLINDRE",
    "REMPLACEMENT DE SERRURE",
    "REMPLACEMENT DE VITRAGE",
    "REMPLACEMENT DOUBLE VITRAGE",
    "REMPLACEMENT GROUPE DE SÉCURITÉ",
    "REMPLACEMENT MECANISME DE CHASSE D'EAU",
    "REMPLACEMENT MECANISME",
    "REMPLACEMENT MITIGEUR",
    "REMPLACEMENT MÉCANISME DE CHASSE",
    "REMPLACEMENT SERRURE BOITE AUX LETTRES",
    "REMPLACEMENT SERRURE",
    "REMPLACEMENT SIMPLE VITRAGE",
    "REMPLACEMENT VITRAGE",
    "REMPLACEMENT WC",
    "REPARATION DE FUITE SOUS EVIER",
    "REPARATION DE FUITE",
    "REPARATION DE SERRURE",
    "REPARATION MECANISME CHASSE D'EAU",
    "REPARATION SERRURE 3 POINTS",
    "REPARATION SERRURE",
    "RÉPARATION DE FUITE SOUS ÉVIER",
    "RÉPARATION DE FUITE SUR TUYAUTERIE EN CUIVRE",
    "RÉPARATION DE FUITE WC",
    "RÉPARATION DE FUITE",
    "RÉPARATION FUITE SOUS ÉVIER",
    "RÉPARATION SUR SERRURE DE PORTE",
    "TRAVAUX DE PLOMBERIE",
    "TRAVAUX ELECTRIQUE",
]

module.exports = Description;
