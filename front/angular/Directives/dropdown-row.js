angular.module('edison').directive('dropdownRow', function(Devis, productsList, edisonAPI, config, $q, $timeout, Intervention) {
    "use strict";

    return {
        restrict: 'E',
        replace: true,
        templateUrl: '/Directives/dropdown-row.html',
        scope: {
            model: "@",
            row: '=',
        },
        link: function(scope, element, attrs) {
            scope._ = _;
            scope.Intervention = Intervention
            scope.Devis = Devis
            scope._model = scope.model || "intervention"

            scope.expendedStyle = {
                height: 0,
                overflow: 'hidden'
            };
            scope.expendedReady = false;
            scope.data = {};
            scope.config = config
            if (scope._model === "intervention") {
                edisonAPI.intervention.get(scope.row.id, {
                    populate: ['sst', 'devisOrigine'].join(',')
                }).then(function(result) {
                    scope.data = result.data;
                    if (scope.data.produits) {
                        scope.produits = new productsList(scope.data.produits);
                    }
                    scope.client = scope.data.client;
                    scope.address = scope.client.address;

                })

            } else if (scope._model === "devis") {
                var pAll = [
                    edisonAPI.devis.get(scope.row.id, {
                        populate: 'transfertId'
                    }),
                ]
                var pThen = function(result) {
                    scope.data = result[0].data;
                    scope.produits = new productsList(scope.data.produits);
                    scope.hist = scope.data.historique
                    scope.client = scope.data.client;
                    scope.address = scope.client.address;
                }
            } else if (scope._model === 'artisan') {




                scope.loadPanel = function(id) {
                    edisonAPI.artisan.getStats(id).then(function(resp) {
                        new Chartist.Pie('.ct-chart', {
                            series: [{
                                value: resp.data.envoye.total,
                                name: 'En cours',
                                className: 'ct-orange',
                                meta: 'Meta One'
                            }, {
                                value: resp.data.annule.total,
                                name: 'annulé',
                                className: 'ct-red',
                                meta: 'Meta One'
                            }, {
                                value: resp.data.paye.total,
                                name: 'payé',
                                className: 'ct-green',
                                meta: 'Meta One'
                            }]
                        }, {
                            total: resp.data.annule.total + resp.data.paye.total + resp.data.envoye.total,
                            donut: true,
                            startAngle: 270,
                            donutWidth: 62,
                        });
                        scope.stats = resp.data
                    })

                }

                scope.loadPanel(scope.row.id)


                pAll = [
                    edisonAPI.artisan.get(scope.row.id),
                    edisonAPI.artisan.getStats(scope.row.id)
                ]
                pThen = function(result) {
                    scope.data = result[0].data;
                    scope.artisan = scope.data;
                    scope.artisan.stats = result[1].data;
                    scope.address = scope.artisan.address
                }
            }

            $q.all(pAll).then(pThen)
            scope.getStaticMap = function() {
                var q = "?format=jpg&width=411&height=210px&precision=0&origin=" + scope.address.lt + ", " + scope.address.lg;
                if (_.get(scope, 'data.artisan.address.lt'))
                    q += "&destination=" + scope.data.artisan.address.lt + ", " + scope.data.artisan.address.lg;
                else
                    q += "&zoom=15";
                return "/api/mapGetStatic" + q;
            }

        }
    };
});
