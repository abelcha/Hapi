var express = require('express');
var app = express();
var PDF = require('./PDF.js')
var tests = require('./testCases.js')
var _ = require('lodash');
var fs = require("fs");

app.use(express.static(__dirname + '/img'));

app.get('/full', function(req, res) {
    var r = PDF().html();
    res.send(r);
})

String.prototype.replaceAll = function(target, replacement) {
    return this.split(target).join(replacement);
}

app.get('/os', function(req, res) {
    var os = {
        "_id": 22595,
        "cache": {
            "f": {
                "i_all": 1
            },
            "t": "benjamin_b",
            "id": 22595,
            "ai": 1595,
            "s": 4,
            "c": 3,
            "n": "M. GUERRY BERNARD",
            "a": "CORDONNERIE MULTISERVICES",
            "pa": 150,
            "da": 64956534,
            "di": 65140000,
            "ad": "83980, LE LAVANDOU"
        },
        "id": 22595,
        "causeAnnulation": "PB_RES",
        "categorie": "SR",
        "description": "REMPLACEMENT SERRURE PORTE GARRAGE",
        "tva": 10,
        "coutFourniture": 0,
        "enDemarchage": false,
        "aDemarcher": true,
        "reglementSurPlace": true,
        "prixFinal": 150,
        "prixAnnonce": 150,
        "modeReglement": "CH",
        "fourniture": [],
        "produits": [],
        "remarque": "Le client descend spécialement ce jour là.\r\n150 euros Main d'Oeuvre\r\n+ 169.10 euros si remplacement de serrure\r\n",
        "descriptionTags": [],
        "sst": {
            "id": 1595,
            "nomSociete": "CORDONNERIE MULTISERVICES"
        },
        "savEnCours": true,
        "litigesEnCours": true,
        "litiges": [],
        "sav": [],
        "client": {
            "civilite": "M.",
            "prenom": "BERNARD",
            "nom": "GUERRY",
            "email": "",
            "location": [
                43.138,
                6.36844
            ],
            "address": {
                "n": "0",
                "r": "CAVALIERE",
                "v": "LE LAVANDOU",
                "cp": "83980",
                "lt": 43.138,
                "lg": 6.36844
            },
            "telephone": {
                "tel1": "0680701008",
                "tel2": "0689697330",
                "origine": "0689697330"
            }
        },
        "historique": [],
        "comments": [],
        "date": {
            "intervention": "2015-06-24T10:00:00.000Z",
            "annulation": "2015-06-22T07:02:14.000Z",
            "ajout": "2015-06-22T07:02:14.000Z"
        },
        "login": {
            "ajout": "benjamin_b",
            "annulation": "benjamin_b"
        },
        "status": "ANN"
    }
    var pdf = PDF('intervention', os)
    pdf.getOS(req.query.html, function(err, buff) {
        if (!req.query.html)
            res.contentType('application/pdf')
        res.send(buff)
    })
})

app.get('/combo/:model', function(req, res) {

    var combos = {
        facture: [{
            model: 'letter',
            options: tests['letter'][0]
        }, {
            model: 'blank',
            options: {}
        }, {
            model: 'facture',
            options: tests['facture'][0]
        }, {
            model: 'conditions',
            options: {}
        }],
        devis: [{
            model: 'facture',
            options: _.merge(tests['facture'][2], {
                type: 'devis'
            })
        }, {
            model: 'conditions',
            options: {}
        }, ],
        facturier: [{
            model: 'facturier',
            options: tests['facturier'][0]
        }, {
            model: 'conditions',
            options: {}
        }, {
            model: 'attestation',
            options: tests['facturier'][0]
        }],

        deviseur: [{
            model: 'facturier',
            options: tests['facturier'][0]
        }, {
            model: 'conditions',
            options: {}
        }]
    }

    if (!combos[req.params.model])
        return res.send('unkown combo')
    var r = new PDF(combos[req.params.model], req.query.time ? parseInt(req.query.time) : 0)
    if (!req.query.html) {
        r.toBuffer(function(err, resp) {
            if (err)
                return res.status(401).send(err);
            res.contentType('application/pdf')
            res.send(resp);
        })
    } else {
        require("fs").writeFileSync('./cmd', "curl  http://edsx-dev.herokuapp.com/api/intervention/renderPDF?x=true&html=" +
            encodeURIComponent(r.html().replace(/\s{2,}/g, ' ')).replaceAll('(', '').replaceAll(')', '').replaceAll("'", ""))
        console.log('done')
        res.send(r.html())
    }
})

app.get('/notice', function(req, res) {
    fs.readFile(__dirname + '/template/notice.html', "utf-8", function(err, data) {
        if (err)
            res.send(err)

        var css = fs.readFileSync([__dirname, 'style.css'].join('/'), 'utf8');
        css = '<style type="text/css">' + css + '</style>';

        if (req.query.html)
            return res.send(css + data);

        html2pdf.create(css + data).toBuffer(function(err, buffer) {
            res.contentType('application/pdf');
            res.send(buffer)
        })
    })
})

app.get('/:model/:testCase', function(req, res) {

    var textCase = (tests[req.params.model] && tests[req.params.model][parseInt(req.params.testCase)]) || {}

    var pdf = new PDF(req.params.model, textCase, req.query.time ? parseInt(req.query.time) : 0)

    if (!req.query.html) {
        pdf.buffer(function(err, resp) {
            if (err)
                return res.status(401).send(err);
            res.contentType('application/pdf')
            res.send(resp);
        })
    } else {
        res.send(pdf.getHTML())
    }
});



var server = app.listen(3000, function() {
    var host = server.address().address;
    var port = server.address().port;
    console.log('okok')
});
