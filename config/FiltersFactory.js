var ms = require('milliseconds');

FiltersFactory = function(inter) {
    if (!(this instanceof FiltersFactory)) {
        return new FiltersFactory(inter);
    }
    if (inter && typeof inter === 'object') {
        this.inter = inter;
        this.fltr = {};
        this.today = new Date;
        this.today = this.today.setHours(0);
        this.dateInter = (new Date(inter.date.intervention)).getTime();
        this.now = Date.now();
        this.fltr = {};
    }

}

var today = function() {
    var tdy = (new Date()).setHours(0);
    console.log(tdy, new Date(tdy));
    return  tdy
}



FiltersFactory.prototype.get = function(fltr) {
    var _this = this;
    for (var i = 0; i < _this.data.length; ++i) {
        if (_this.data[i][Object.keys(fltr)] === fltr[Object.keys(fltr)])
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

FiltersFactory.prototype.list = function() {
    return this.data;
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
    match: {
        'status': 'ENV',
         'date.intervention': {
            $gt: new Date(Date.now() + ms.hours(1))
        }
    },
    cache: true,
    fn: function() {
        //console.log((new Date(this.inter.date.ajout)).getTime() , (new Date()).setHours(0), (new Date(this.inter.date.ajout)).getTime() > (new Date()).setHours(0));
        return this.inter.status === "ENV" && this.inter.date.intervention >  (Date.now() + ms.hours(1));
    }
}, {
    short_name: 'avr',
    long_name: 'A Vérifier',
    url: 'aVerifier',
    match: {
        status: 'ENV',
        'date.intervention': {
            $lt: new Date(Date.now() + ms.hours(1))
        }
    },
    cache: true,
    fn: function() {
        return this.inter.status === "AVR" ||
            (this.inter.status === "ENV" && this.now > this.dateInter);
    }
}, {
    short_name: 'apr',
    long_name: 'A Programmer',
    url: 'aProgrammer',
    match: {
        'status': 'APR',
        'date.ajout': {
            $gt: new Date(0)
        },
    },
    cache: true,
    fn: function() {
        return this.inter.status === "APR";
    }
}, {
    short_name: 'att',
    long_name: 'Paiement en attente',
    url: 'paiementEnAttente',
    match: {},
    stats: false,
    cache: true,
    fn: function() {
        return this.inter.status === "ATT";

    }
}, {
    short_name: 'atts',
    long_name: 'Paiement SST en attente',
    url: 'paiementArtisanEnAttente',
    match: {},
    stats: false,
    cache: true,
    fn: function() {
        return this.fltr.att &&
            this.inter.reglementSurPlace === true;

    }
}, {
    short_name: 'sarl',
    long_name: 'SST à Relancer',
    url: 'relanceArtisan',
    match: {
        status: 'ATT',
        reglementSurPlace: true,
        'date.intervention': {
            $lt: new Date(Date.now() - ms.weeks(2)),
        }
    },
    stats: true,
    cache: true,
    fn: function() {
        return this.fltr.atts &&
            this.now > this.dateInter + ms.weeks(2);
    }
}, {
    short_name: 'attc',
    long_name: 'Paiement Client en attente',
    url: 'paiementClientEnAttente',
    match: {},
    stats: false,
    cache: true,
    fn: function() {
        return this.fltr.att &&
            this.inter.reglementSurPlace === false;

    }
}, {
    short_name: 'carl',
    long_name: 'Client à Relancer',
    url: 'relanceClient',
    match: {
        status: 'ATT',
        reglementSurPlace: false,
        'date.intervention': {
            $lt: new Date(Date.now() - ms.weeks(2)),
        }
    },
    cache: true,
    fn: function() {
        return this.fltr.attc &&
            this.now > this.dateInter + ms.weeks(3);
    }
}, {
    short_name: 'fact',
    long_name: 'Facture à envoyer',
    url: 'factureaEnvoyer',
    match: {
        'date.intervention': {
            $lt: new Date(Date.now() + ms.hours(1))
        },
        status: 'ENV',
        reglementSurPlace: false
    },
    cache: true,
    fn: function() {
        return this.fltr.avr &&
            this.inter.reglementSurPlace === false;
        !this.inter.date.envoiFacture;
    }
}, {
    short_name: 'sav',
    long_name: 'Tous les S.A.V',
    url: 'serviceApresVente',
    match: {
        sav: {
            $gt: {
                $size: 0
            }
        }
    },
    cache: true,
    fn: function() {
        return this.inter.sav && this.inter.sav.length > 0;
    }
}, {
    short_name: 'savEnc',
    long_name: 'S.A.V En Cours',
    url: 'serviceApresVenteEnCours',
    match: {
        sav: {
            $elemMatch:  {
                status: 'ENV'
            }
        }
    },
    cache: true,
    fn: function() {
        return this.inter.sav && this.inter.sav.length > 0 &&
            this.inter.sav[this.inter.sav.length - 1].status === "ENV"
    }
}, {
    short_name: 'lit',
    long_name: 'Tous les Litige',
    url: 'litiges',
    match: {
        litiges: {
            $elemMatch:  {
                regle: false
            }
        }
    },
    cache: true,
    fn: function() {
        return this.inter.sav && this.inter.sav.length > 0;
    }
}, {
    short_name: 'litEnc',
    long_name: 'Litiges non résolus',
    url: 'litigesEnCours',
    match: {
        litiges: {
            $gt: {
                $size: 0
            }
        }
    },
    cache: true,
    fn: function() {
        return this.inter.litiges && this.inter.litiges.length > 0 &&
            this.inter.litiges[this.inter.litiges.length - 1].regle === false
    }
}]

module.exports = FiltersFactory;
