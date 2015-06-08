FiltersFactory = function(inter) {
    if (!(this instanceof FiltersFactory)) {
        return new FiltersFactory(inter);
    }
    if (inter && typeof inter === 'object') {
        this.inter = inter;
        this.fltr = {};
        this.ms = require('milliseconds');
        this.today = new Date;
        this.today = this.today.setHours(0);
        this.dateInter = (new Date(inter.date.intervention)).getTime();
        this.now = Date.now();
        this.fltr = {};
    }

}


FiltersFactory.prototype.get = function(fltr) {
    var _this = this;
    for (var i = 0; i < _this.data.length; ++i) {
        if (_this.data[i].url === fltr)
            return _this.data[i];
    }
    return null;
}

FiltersFactory.prototype.create = function() {
    var _this = this;
    for (var i = 0; i < _this.data.length; ++i) {
        if (_this.data[i].cache === true && _this.data[i].fn.bind(_this)() === true) {
            _this.fltr[_this.data[i].short_name] = 1;
        }
    }
    if (this.inter.date.ajout > _this.today) {
        _this.fltr.d = {
            t: 1
        }
    }
    return _this.fltr;
}

FiltersFactory.prototype.data = [{
    short_name: 'all',
    long_name: 'Toutes les Inters',
    url: '',
    cache: false,
    match: {},
    fn: function() {
        return true;
    }
}, {
    short_name: 'env',
    long_name: 'Envoyé',
    url: 'envoye',
    match: {},
    cache: true,
    fn: function() {
        return this.inter.status === "ENV";
    }
}, {
    short_name: 'avr',
    long_name: 'A Vérifier',
    url: 'aVerifier',
    match: {},
    cache: true,
    fn: function() {
        return this.inter.status === "AVR" ||
            (this.inter.status === "ENV" && this.now > this.dateInter);
    }
}, {
    short_name: 'apr',
    long_name: 'A Programmer',
    url: 'aProgrammer',
    match: {},
    cache: true,
    fn: function() {
        return this.inter.status === "APR";
    }
}, {
    short_name: 'att',
    long_name: 'Paiement SST en attente',
    url: 'paiementArtisanEnAttente',
    match: {},
    cache: true,
    fn: function() {
        return this.inter.status === "ATT";

    }
}, {
    short_name: 'atts',
    long_name: 'Paiement SST en attente',
    url: 'paiementArtisanEnAttente',
    match: {},
    cache: true,
    fn: function() {
        return this.fltr.att &&
            this.inter.reglementSurPlace === true;

    }
}, {
    short_name: 'sarl',
    long_name: 'SST à Relancer',
    url: 'relanceArtisan',
    match: {},
    cache: true,
    fn: function() {
        return this.fltr.atts &&
            this.now > this.dateInter + this.ms.weeks(2);
    }
}, {
    short_name: 'attc',
    long_name: 'Paiement Client en attente',
    url: 'paiementClientEnAttente',
    match: {},
    cache: true,
    fn: function() {
        return this.fltr.att &&
            this.inter.reglementSurPlace === false;

    }
}, {
    short_name: 'carl',
    long_name: 'Client à Relancer',
    url: 'relanceClient',
    match: {},
    cache: true,
    fn: function() {
        return this.fltr.attc &&
            this.now > this.dateInter + this.ms.weeks(3);
    }
}, {
    short_name: 'fact',
    long_name: 'Facture à envoyer',
    url: 'factureaEnvoyer',
    match: {},
    cache: true,
    fn: function() {
        return this.fltr.avr &&
            this.inter.reglementSurPlace === false;
            !this.inter.date.envoiFacture;
    }
}]

module.exports = FiltersFactory;
