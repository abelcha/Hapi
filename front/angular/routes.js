var getDevisList = function(edisonAPI) {
    "use strict";
    return edisonAPI.devis.list({
        cache: true
    });
};

var getArtisanList = function(edisonAPI) {
    "use strict";
    return edisonAPI.artisan.list({
        cache: true
    });
};

var getInterList = function(edisonAPI) {
    "use strict";
    return edisonAPI.intervention.list({
        cache: true
    });
};
var getArtisanList = function(edisonAPI) {
    "use strict";
    return edisonAPI.artisan.list({
        cache: true
    });
};


var getArtisan = function($route, $q, edisonAPI) {
    "use strict";
    var id = $route.current.params.id;
    if (id.length > 10) {
        return edisonAPI.artisan.getTmp(id);
    } else {
        return edisonAPI.artisan.get(id);
    }
}

var getIntervention = function($route, $q, edisonAPI) {
    "use strict";
    var id = $route.current.params.id;
    if ($route.current.params.d) {
        return edisonAPI.devis.get($route.current.params.d, {
            select: 'date login produits tva client prixAnnonce categorie -_id'
        });
    } else if (id.length > 10) {
        return edisonAPI.intervention.getTmp(id);
    } else {
        return edisonAPI.intervention.get(id, {
            populate: 'sst'
        });
    }
};

var getDevis = function($route, $q, edisonAPI) {
    "use strict";
    var id = $route.current.params.id;
    if ($route.current.params.i) {
        return edisonAPI.intervention.get($route.current.params.i, {
            select: 'client categorie tva -_id'
        });
    } else if (id.length > 10) {
        return edisonAPI.devis.getTmp(id);
    } else {
        return edisonAPI.devis.get(id);
    }
};

angular.module('edison').config(function($routeProvider, $locationProvider) {
    "use strict";
    $routeProvider
        .when('/', {
            redirectTo: '/intervention/list',
        })
        .when('/intervention/list', {
            templateUrl: "Pages/ListeInterventions/listeInterventions.html",
            controller: "ListeInterventionController",
            controllerAs: 'vm',
            reloadOnSearch: false

        })
        .when('/intervention/list/:fltr', {
            templateUrl: "Pages/ListeInterventions/listeInterventions.html",
            controller: "ListeInterventionController",
            controllerAs: 'vm',
            reloadOnSearch: false

        })
        .when('/intervention', {
            redirectTo: function(routeParams, path, params) {
                var url = params.devis ? "?d=" + params.devis : "";
                return '/intervention/' + Date.now() + url;
            }
        })
        .when('/intervention/:id', {
            templateUrl: "Pages/Intervention/intervention.html",
            controller: "InterventionController",
            controllerAs: "vm",
            reloadOnSearch: false,
            resolve: {
                interventionPrm: getIntervention,
            }
        })
        .when('/devis/list', {
            templateUrl: "Pages/ListeDevis/listeDevis.html",
            controller: "ListeDevisController",
            controllerAs: 'vm',
            reloadOnSearch: false

        })
        .when('/devis/list/:fltr', {
            templateUrl: "Pages/ListeDevis/listeDevis.html",
            controller: "ListeDevisController",
            controllerAs: "vm",
            reloadOnSearch: false

        })
        .when('/devis', {
            redirectTo: function(routeParams, path, params) {
                var url = params.i ? "?i=" + params.i : "";
                return '/devis/' + Date.now() + url;
            }
        })
        .when('/devis/:id', {
            templateUrl: "Pages/Intervention/devis.html",
            controller: "DevisController",
            controllerAs: "vm",
            resolve: {
                devisPrm: getDevis,
            }
        })
        .when('/artisan/contact', {
            templateUrl: "Pages/ListeArtisan/contactArtisan.html",
            controller: "ContactArtisanController",
            controllerAs: 'vm',
            reloadOnSearch: false
        })
        .when('/artisan/:sstid/recap', {
            templateUrl: "Pages/ListeArtisan/contactArtisan.html",
            controller: "ContactArtisanController",
            controllerAs: 'vm',
            reloadOnSearch: false

        })
        .when('/artisan/list', {
            templateUrl: "Pages/ListeArtisan/listeArtisan.html",
            controller: "ListeArtisanController",
            controllerAs: 'vm',
            reloadOnSearch: false

        })
        .when('/artisan/list/:fltr', {
            templateUrl: "Pages/ListeArtisan/listeArtisan.html",
            controller: "ListeArtisanController",
            controllerAs: "vm",
            reloadOnSearch: false

        })
        .when('/artisan', {
            redirectTo: function() {
                return '/artisan/' + Date.now();
            }
        })
        .when('/artisan/:id', {
            templateUrl: "Pages/Artisan/artisan.html",
            controller: "ArtisanController",
            controllerAs: "vm",
            resolve: {
                artisanPrm: getArtisan,
            }
        })
        .when('/dashboard', {
            controller: 'DashboardController',
            templateUrl: "Pages/Dashboard/dashboard.html",
        })
        .when('/search/:query', {
            templateUrl: "Pages/Search/search.html",
            controller: "SearchController",
            controllerAs: "vm",
        })
        .when('/compta/lpa', {
            templateUrl: "Pages/LPA/LPA.html",
            controller: "LpaController",
            controllerAs: "vm",
        })
        .when('/compta/avoirs', {
            templateUrl: "Pages/Avoirs/avoirs.html",
            controller: "avoirsController",
            controllerAs: "vm",
        })
        .when('/compta/archivesPaiement', {
            templateUrl: "Pages/Archives/archives.html",
            controller: "archivesPaiementController",
            controllerAs: "vm",
        })
        .when('/compta/archivesReglement', {
            templateUrl: "Pages/Archives/archives.html",
            controller: "archivesReglementController",
            controllerAs: "vm",
        })
        .when('/tools/telephoneMatch', {
            templateUrl: "Pages/Tools/telephoneMatch.html",
            controller: "telephoneMatch",
            controllerAs: "vm",
        })
        .when('/tools/editProducts', {
            templateUrl: "Pages/Tools/edit-products.html",
            controller: "editProducts",
            controllerAs: "vm",
        })
        .when('/tools/editComptes', {
            templateUrl: "Pages/Tools/edit-comptes.html",
            controller: "editComptes",
            controllerAs: "vm",
        })
        .when('/tools/editCombos', {
            templateUrl: "Pages/Tools/edit-combos.html",
            controller: "editCombos",
            controllerAs: "vm",
        })
        .when('/tools/editUsers', {
            templateUrl: "Pages/Tools/edit-users.html",
            controller: "editUsers",
            controllerAs: "vm",
        })
        .when('/tools/commissions', {
            templateUrl: "Pages/Tools/commissions.html",
            controller: "CommissionsController",
            controllerAs: "vm",
        })
        .when('/stats/:type', {
            templateUrl: "Pages/Stats/stats.html",
            controller: "StatsController",
            controllerAs: 'vm',
            reloadOnSearch: false
        })
        .otherwise({
            redirectTo: '/dashboard'
        });
    // use the HTML5 History API
    $locationProvider.html5Mode(true);
});
