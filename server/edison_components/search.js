module.exports = function(req, res) {
    var rtn = [];
    var async = require('async');
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
                        //console.log(options.pre ||  '#')
                        _.set(e, 'artisan.nomSociete', _.get(e, 'artisan.nomSociete', 'A Programmer'))
                        e.artisan.nomSociete = e.artisan.nomSociete ||  'A Programmer'
                        return {
                            link: ['', (options.model ||  'intervention'), e.id].join('/') + (options.link ||  ''),
                            description: (options.pre ||  '#') + _.template(options.template || "{{id}} - {{client.civilite}} {{client.nom}} -  {{client.address.cp}} {{client.address.v}}  - {{artisan.nomSociete}} - {{status}}")(e)
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
            query: {
                'client.nom': rgx
            }
        }),
        interventionId: createFilter({
            query: {
                id: parseInt(query)
            },
            regexp: new RegExp('^[0-9]+$')
        }),
        interventionTelephone: createFilter({
            query: {
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
                    link: '/intervention/' + inter.id,
                    description: _.template("{{id}} ({{telMatch}}) - {{client.civilite}} {{client.nom}} -  {{client.address.cp}} {{client.address.v}}")(inter)
                }
            }
        }),
        interventionCodePostal: createFilter({
            query: {
                'client.address.cp': rgx
            },
            regexp: new RegExp('^[0-9]+$'),
            template: "{{id}} ({{client.address.cp}}) - {{client.civilite}} {{client.nom}} - {{client.address.v}}"
        }),
        interventionVille: createFilter({
            query: {
                'client.address.v': rgx
            },
            regexp: new RegExp('^[^0-9]+$'),
            template: "{{id}} ({{client.address.v}}) - {{client.civilite}} {{client.nom}} - {{client.address.cp}}"

        }),

        artisanNom: createFilter({
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
            pre: '@',
            model: 'artisan',
            link: '/recap',
            query: {
                'address.v': rgx
            },
            template: "{{id}} ({{address.v}}) - {{nomSociete}} - {{address.cp}}"

        }),
        artisanCP: createFilter({
            pre: '@',
            model: 'artisan',
            link: '/recap',
            query: {
                'address.cp': rgx
            },
            template: "{{id}} ({{address.cp}}) - {{nomSociete}} - {{address.v}}"

        }),
        artisanTelephone: createFilter({
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
                    link: '/artisanvention/' + artisan.id,
                    description: _.template("@{{id}} ({{address.telMatch}}) - {{nomSociete}} - {{address.cp}} {{address.v}} ")(artisan)
                }
            }
        }),
        devisNom: createFilter({
            model: 'devis',
            pre: "Dev.",
            query: {
                'client.nom': rgx
            }
        }),
        devisId: createFilter({
            model: 'devis',
            pre: "Dev.",
            query: {
                id: parseInt(query)
            },
            regexp: new RegExp('^[0-9]+$')
        }),
        devisTelephone: createFilter({
            model: 'devis',
            pre: "Dev.",
            query: {
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
            model: 'devis',
            pre: "Dev.",
            query: {
                'client.address.cp': rgx
            },
            regexp: new RegExp('^[0-9]+$'),
            template: "{{id}} ({{client.address.cp}}) - {{client.civilite}} {{client.nom}} - {{client.address.v}}"
        }),
        devisVille: createFilter({
            query: {
                'client.address.v': rgx
            },
            regexp: new RegExp('^[^0-9]+$'),
            template: "{{id}} ({{client.address.v}}) - {{client.civilite}} {{client.nom}} - {{client.address.cp}}"

        }),
    }

    async.parallel(filters, function(err, result) {
        //console.log('-->', err, '<--', result);
        var rtn = [];
        _.each(result, function(e, k) {
            _.each(e, function(r) {
                r.match = k;
                rtn.push(r)
            })
        })
        res.json(rtn)
    })
}
