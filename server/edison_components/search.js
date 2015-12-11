module.exports = function(req, res) {
    var rtn = [];
    var async = require('async');
    var moment = require('moment-timezone')
    var _ = require('lodash');
    var regexpAccents = require('regexp-accents');
    _.templateSettings.interpolate = /{{([\s\S]+?)}}/g;
    var query = req.params.text;

    var createFilter = function(options) {
        return function(cb) {
            if (options.regexp && !query.match(options.regexp)) {
                return cb(null, [])
            }
            db.model(options.model || 'intervention')
                .find(options.query ||  {})
                .sort('-id')
                .limit(req.query.limit)
                .then(function(resp) {
                    var mapFunc = options.mapFunc || function(e) {
                        e.mmt = moment.tz(e.date.intervention, 'Europe/Paris').format("DD/MM")
                        _.set(e, 'artisan.nomSociete', _.get(e, 'artisan.nomSociete', 'A Programmer'))
                        e.artisan.nomSociete = e.artisan.nomSociete ||  'A Programmer'
                        return {
                            link: ['', (options.model ||  'intervention'), e.id].join('/') + (options.link ||  ''),
                            description: (options.pre ||  '#') + _.template(options.template || "{{id}} - {{mmt}} - {{client.civilite}} {{client.nom}} -  {{client.address.cp}} {{client.address.v}}  - {{artisan.nomSociete}} - {{status}} - {{prixAnnonce}} €")(e)
                        }
                    };
                    var rtn = resp.map(mapFunc);
                    cb(null, rtn)
                }, cb);
        }
    }

    var rgx = {
        $regex: regexpAccents(query, true)
    };

    var filters = {
        interventionNom: createFilter({
            title: 'interventionNom',
            query: {
                'client.nom': rgx
            }
        }),
        interventionId: createFilter({
            title: 'interventionID',
            query: {
                id: parseInt(query)
            },
            regexp: new RegExp('^[0-9]+$')
        }),
        interventionTelephone: createFilter({
            title: 'interventionTel',
            query: {
                'date.ajout': {
                    $gt: moment().add(-6, 'month').toDate(),
                },
                $or: [{
                    'client.telephone.tel1': rgx
                }, {
                    'client.telephone.tel2': rgx
                }, {
                    'client.telephone.tel3': rgx
                }]
            },
            regexp: new RegExp('^[0-9]+$'),
            mapFunc: function(inter) {
                var t = inter.client.telephone;
                inter.mmt = moment.tz(inter.date.intervention, 'Europe/Paris').format("DD/MM")
                inter.telMatch = t.tel1.startsWith(query) ? t.tel1 : t.tel2.startsWith(query) ? t.tel2 : t.tel3;
                return {
                    link: '/intervention/' + inter.id,
                    description: _.template("{{id}} - {{mmt}} - ({{telMatch}}) - {{client.civilite}} {{client.nom}} -  {{client.address.cp}} {{client.address.v}} {{prixAnnonce}} €")(inter)
                }
            }
        }),
        interventionCodePostal: createFilter({
            title: 'interventionCP',
            query: {
                'date.ajout': {
                    $gt: moment().add(-2, 'month').toDate(),
                },
                'client.address.cp': rgx
            },
            regexp: new RegExp('^[0-9]+$'),
            template: "{{id}} - {{mmt}} - ({{client.address.cp}}) - {{client.civilite}} {{client.nom}} - {{client.address.v}} {{prixAnnonce}} €"
        }),
        interventionVille: createFilter({
            title: 'interventionVille',
            query: {
                'date.ajout': {
                    $gt: moment().add(-2, 'month').toDate(),
                },
                'client.address.v': rgx
            },
            regexp: new RegExp('^[^0-9]+$'),
            template: "{{id}} - {{mmt}} - ({{client.address.v}}) - {{client.civilite}} {{client.nom}} - {{client.address.cp}} {{prixAnnonce}} €"

        }),
        artisanId: createFilter({
            title: 'ArtisanID',
            model: 'artisan',
            pre: '@',
            link: '/recap',
            query: {
                id: parseInt(query)
            },
            template: "{{id}} ({{nomSociete}}) - {{representant.nom}} - {{address.cp}}",
            regexp: new RegExp('^[0-9]+$')
        }),
        artisanNom: createFilter({
            title: 'ArtisanNom',
            pre: '@',
            model: 'artisan',
            link: '/recap',
            query: {
                $or: [{
                    'representant.nom': rgx
                }, {
                    'nomSociete': rgx
                }]
            },
            template: "{{id}} ({{nomSociete}}) - {{representant.nom}} - {{address.cp}}"

        }),
        artisanVille: createFilter({
            title: 'ArtisanVille',
            pre: '@',
            model: 'artisan',
            link: '/recap',
            query: {
                'date.ajout': {
                    $gt: moment().add(-2, 'month').toDate(),
                },
                'address.v': rgx
            },
            template: "{{id}} ({{address.v}}) - {{nomSociete}} - {{address.cp}}"

        }),
        artisanCP: createFilter({
            title: 'ArtisanCP',
            pre: '@',
            model: 'artisan',
            link: '/recap',
            query: {
                'address.cp': rgx
            },
            template: "{{id}} ({{address.cp}}) - {{nomSociete}} - {{address.v}}"

        }),
        artisanTelephone: createFilter({
            title: 'ArtisanTEL',
            pre: '@',
            model: 'artisan',
            link: '/recap',
            query: {
                $or: [{
                    'telephone.tel1': rgx
                }, {
                    'telephone.tel2': rgx
                }]
            },
            regexp: new RegExp('^[0-9]+$'),
            mapFunc: function(artisan) {
                var t = artisan.telephone;
                artisan.telMatch = t.tel1.startsWith(query) ? t.tel1 : t.tel2.startsWith(query) ? t.tel2 : t.tel3;
                return {
                    link: '/artisan/' + artisan.id + '/recap',
                    description: _.template("@{{id}} ({{address.telMatch}}) - {{nomSociete}} - {{address.cp}} {{address.v}} ")(artisan)
                }
            }
        }),
        devisNom: createFilter({
            title: 'DevisNom',
            model: 'devis',
            pre: "Dev.",
            query: {
                'client.nom': rgx
            }
        }),
        devisId: createFilter({
            title: 'DevisID',
            model: 'devis',
            pre: "Dev.",
            query: {
                id: parseInt(query)
            },
            regexp: new RegExp('^[0-9]+$')
        }),
        devisTelephone: createFilter({
            title: 'DevisTel',
            model: 'devis',
            pre: "Dev.",
            query: {
                'date.ajout': {
                    $gt: moment().add(-6, 'month').toDate(),
                },
                $or: [{
                    'client.telephone.tel1': rgx
                }, {
                    'client.telephone.tel2': rgx
                }, {
                    'client.telephone.tel3': rgx
                }]
            },
            regexp: new RegExp('^[0-9]+$'),
            mapFunc: function(inter) {
                var t = inter.client.telephone;
                inter.telMatch = t.tel1.startsWith(query) ? t.tel1 : t.tel2.startsWith(query) ? t.tel2 : t.tel3;
                return {
                    link: '/devis/' + inter.id,
                    description: _.template("#{{id}} ({{telMatch}}) - {{client.civilite}} {{client.nom}} -  {{client.address.cp}} {{client.address.v}}")(inter)
                }
            }
        }),
        devisCodePostal: createFilter({
            title: 'DevisCP',
            model: 'devis',
            pre: "Dev.",
            query: {
                'date.ajout': {
                    $gt: moment().add(-2, 'month').toDate(),
                },
                'client.address.cp': rgx
            },
            regexp: new RegExp('^[0-9]+$'),
            template: "{{id}} ({{client.address.cp}}) - {{client.civilite}} {{client.nom}} - {{client.address.v}}"
        }),
        devisVille: createFilter({
            title: 'DevisVille',
            query: {
                'date.ajout': {
                    $gt: moment().add(-2, 'month').toDate(),
                },
                'client.address.v': rgx
            },
            regexp: new RegExp('^[^0-9]+$'),
            template: "{{id}} ({{client.address.v}}) - {{client.civilite}} {{client.nom}} - {{client.address.cp}}"

        }),
    }

    console.time(query)

    async.parallel(filters, function(err, result) {
        //console.log('-->', err, '<--', result);
        var rtn = [];
        _.each(result, function(e, k) {
            _.each(e, function(r) {
                r.match = k;
                rtn.push(r)
            })
        })
    console.timeEnd(query)

        res.json(rtn)
    })
}
