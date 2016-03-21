var fs = require('fs');
var _ = require('lodash');
var moment = require('moment-timezone');
moment.locale('fr');
var barcode = require('./barcode.js');
var frenchNumber = require('./french-number.js');
var html2pdf = require('html-pdf-wth-rendering');
var Validate = require('validate-arguments');

setTimeout(function() {
    _.templateSettings.interpolate = /{{([\s\S]+?)}}/g;
}, 1000)

var lsplit = function(str, len) {
    var rtn = [];
    var arr = str.split(' ');
    var tmp = "";
    arr.forEach(function(e) {
        if (tmp.length + e.length > len) {
            rtn.push(tmp);
            tmp = "";
        }
        tmp += e + " "
    })
    if (tmp !== "") {
        rtn.push(tmp)
    }
    return rtn
}

var MULTI_PDF = function(params, renderingTime) {
    var templates = ""
    this.renderingTime = renderingTime || 200
    _.each(params, function(e) {
        var pdf = new PDF(e.model, e.options)
        templates += pdf.getHTML();
    })
    this._html = templates
}



MULTI_PDF.prototype.html = function() {
    return this._html
}
MULTI_PDF.prototype.toBuffer = function(cb) {
    html2pdf.create(this._html, {
        format: 'A4',
        renderingTime: this.renderingTime,
        timeout:60000,
    }).toBuffer(cb)
}

MULTI_PDF.prototype.toFile = function(filename, cb) {
    html2pdf.create(filename, this._html, {
        format: 'A4',
        timeout:60000,
        renderingTime: this.renderingTime
    }).toBuffer(cb)
}


var PDF = function(model, options, renderingTime) {
    if (!(this instanceof PDF))
        return new PDF(model, options)
    if (model instanceof Array) {
        return new MULTI_PDF(model, options);
    }
    this.model = model
    this.renderingTime = renderingTime || 200
    this.options = JSON.parse(JSON.stringify(options));
    var logo = require(__dirname + '/logo.js')
    var footer = require(__dirname + '/footer.js')
    this.options.logo = logo.v2;
    this.options.logo_old = logo.v1
    this.options.footer = footer.full();
    if (!this.options.id) {
        this.options.id = _.random(1000, 3000)
    }
    if (!_.get(this.options, 'sst.id')) {
        this.options.sst = {
            id: _.random(1000, 3000)
        }
    }
    if (!this.models[model]) {
        throw "model " + model + " doesn exist"
    }
    /* if (this.models[this.model].params) {
         var validate = this.isValid();

         if (!validate.isValid()) {
             throw validate.errorString();
             return null
         }

     }*/
    if (this.models[model].pre)
        this.models[model].pre.bind(this)();
}

PDF.prototype.getOS = function(html, cb) {
    if (typeof html === 'function') {
        cb = html;
    }
    var request = require('request').defaults({
        encoding: null
    });
    var url = 'https://maps.googleapis.com/maps/api/staticmap?format=jpg&zoom=13&size=330x273&markers=' +
        this.options.client.address.lt + ', ' + this.options.client.address.lg
    var _this = this;
    request.get(url, function(error, response, body) {

        _this.options.map = new Buffer(body).toString('base64')
        if (html)
            return cb(null, _this.getHTML())
        _this.buffer(cb)
    });

}

PDF.prototype.globCSS = '<style type="text/css">' + fs.readFileSync([__dirname, 'style.css'].join('/'), 'utf8'); + '</style>';

PDF.prototype.globHTML = function(html) {
    return '<!doctype html><html lang="fr"><meta charset="utf-8"><body>' + html + '</body></html>'
}

PDF.prototype.getTemplate = function() {

    return this.globCSS + fs.readFileSync([__dirname, 'template', this.model + '.html'].join('/'), 'utf8')
}

PDF.prototype.getHTML = function() {
    var _this = this;
    var template = this.getTemplate();
    var rtn = _.template(template)(_this.options);
    return _this.globHTML(rtn).replace(/\s{2,}/g, ' ');
}

PDF.prototype.buffer = function(cb) {
    var html = this.getHTML();
    html2pdf.create(this.getHTML(), {
        format: 'A4',
        quality: "75",
        timeout:60000,
        phantomArgs: ["--ignore-ssl-errors=true"],
        renderingTime: this.renderingTime
    }).toBuffer(cb)
}


PDF.prototype.toFile = function(filename, cb) {
    var html = this.getHTML();
    html2pdf.create(filename, this.getHTML(), {
        format: 'A4',
        timeout:60000,
        quality: "75",
        phantomArgs: ["--ignore-ssl-errors=true"],
        renderingTime: this.renderingTime
    }).toFile(cb)
}


PDF.prototype.upperCaseEverything = function(options) {
    return 0
        /*    var _this = this;
            var obj = options || this.options;
            _.each(obj, function(e, k) {
                if (typeof e === 'string') {
                    obj[k] = e.toUpperCase();
                } else if (typeof e === 'object') {
                    _this.upperCaseEverything(e);
                }
            })*/

}

var telephonify = function(tel, separator) {
    return tel && tel.match(/.{1,2}/g).join(separator ||  ' ')
}

var numberFormat = function(nbr) {
    return _.round(nbr, 2).toFixed(2).replace('.', ',')
}

PDF.prototype.models = {
    "notice-vigilance": {
        pre: function() {
            this.options.qrcode = '<img src="data:image/bmp;base64,' + barcode[_.random(9)] + '"/>';
        }
    },
    injonction: {
        pre: function() {
            this.options.datePlain = moment().format('LL')
        }
    },
    conditions: {},
    recouvrement: {
        pre: function() {
            this.options.datePlain = moment().format('LL')
            var lateDay = moment().diff(moment(this.options.date.intervention), 'days')
            this.options.prixFinalTTC = this.options.prixFinal * (1 + (this.options.tva / 100))
            this.options.interets = (0.1099 * this.options.prixFinalTTC) / 365 * lateDay
            this.options.total = 36 + 40 + this.options.prixFinalTTC + this.options.interets
            this.options.qrcode = '<img src="data:image/bmp;base64,' + barcode[_.random(9)] + '"/>';
            this.options.os = _.padLeft(this.options.id, 6, '0')

        }
    },
    letter: {
        params: {
            address: {
                n: 'string',
                r: 'string',
                v: 'string',
                cp: 'string',
            },
            dest: {
                nom: 'string',
                // prenom: 'string',
            },
            title: 'string',
            text: 'string'
        },
        pre: function() {
            this.options.qrcodeText1 = this.options.qrcodeText1 ||  "";
            this.options.qrcodeText2 = this.options.qrcodeText2 ||  "";

            if (this.options.factureQrCode) {
                this.options.qrcodeText1 = "N°" + this.options.id;
                this.options.qrcodeText2 = "f4r12dw - " + (this.options.dest.nom || "").slice(0, 12) + " - " + moment(this.options.date.intervention).format('YYYYMMDD')
            }

            this.options.prenom = (this.options.prenom ||  "").toUpperCase()
            this.options.dest.civilite = (this.options.dest.civilite ||  "").toUpperCase()
            this.options.dest.prenom = (this.options.dest.prenom ||  "").toUpperCase()
            this.options.dest.nom = (this.options.dest.nom ||  "").toUpperCase()
            this.options.address.r = (this.options.address.r ||  "").toUpperCase()
            this.options.address.v = (this.options.address.v ||  "").toUpperCase()
            this.options.address.cp = (this.options.address.cp ||  "").toUpperCase()
            this.options.address.n = (this.options.address.n ||  "").toUpperCase()
            this.options.datePlain = moment(this.options.date).format('LL')
            this.options.qrcode = '<img src="data:image/bmp;base64,' + barcode[_.random(9)] + '"/>';
        }
    },
    'sst-letter': {
        pre: function() {
            this.options.datePlain = moment(this.options.date).format('LL')
            this.options.qrcode = '<img src="data:image/bmp;base64,' + barcode[_.random(9)] + '"/>';
        }
    },
    intervention: {
        params: {
            client: 'object',
            prixAnnonce: 'number',
            id: 'number',
            date: 'object',
            description: 'string',
            remarque: 'string'
        },
        pre: function() {
            //this.options.client.telephone.tel1 = telephonify(this.options.telephone)
            if (this.options.newOs) {
                this.options.tels = '09.701.702.01';
            } else {
                var tels = []
                if (this.options.client.telephone.tel1)
                    tels.push(this.options.client.telephone.tel1)

                if (this.options.client.telephone.tel2)
                    tels.push(this.options.client.telephone.tel2)

                if (this.options.client.telephone.tel3)
                    tels.push(this.options.client.telephone.tel3)
                this.options.tels = tels.join(' - ');
            }


            var precision = [];
            if (this.options.client.address.batiment) {
                precision.push('bat. ' + this.options.client.address.batiment)
            }
            if (this.options.client.address.etage) {
                precision.push('etage ' + this.options.client.address.etage)
            }
            if (this.options.client.address.code) {
                precision.push('code ' + this.options.client.address.code)
            }
            if (precision.length) {
                this.options.precisions = ('(' + precision.join(' - ') + ')');
            } else {
                this.options.precisions = ''
            }
            if (!this.options.reglementSurPlace) {
                this.options.mr = 'Pas de reglements à récuperer'
            } else {
                var x = this.options.modeReglement;
                if (x === 'CH')
                    this.options.mr = 'Chèque à recuperer';
                else if (x === 'CA')
                    this.options.mr = 'Especes à recuperer';
                else if (x === 'CB')
                    this.options.mr = 'Paiement par CB';
                else
                    this.options.mr = ''
            }
            var dp = moment().format('dddd D MMMM YYYY');
            this.options.dateSlash = moment().format('DD/MM/YYYY');

            this.options.datePlain = dp[0].toUpperCase() + dp.slice(1);

            this.options.barcode = '<img src="data:image/bmp;base64,' + barcode[_.random(9)] + '"/>';

            var mmt = moment.tz(this.options.date.intervention, "Europe/Paris");
            var mmt2 = moment(this.options.date.intervention);

            this.options.date = mmt.format('dddd D MMMM YYYY');
            this.options.heure = mmt.format('H:mm');

        }
    },
    recap: {
        params: {
            representant: {
                civilite: 'string',
                nom: 'string',
                prenom: 'string',
            },
            address: {
                n: 'string',
                r: 'string',
                v: 'string',
                cp: 'string',
            },
            mode: 'string',
            total: 'number',
            interventions: 'array',
            id: 'number'
        },
        pre: function() {
            this.options.format = numberFormat
            this.upperCaseEverything()
            var mmt = moment();
            this.options.qrcode = '<img src="data:image/bmp;base64,' + barcode[_.random(9)] + '"/>';
            var mmt = moment.tz("Europe/Paris");
            this.options.datePlain = moment().format('DD/MM/YYYY')
            this.options.prixPlain = frenchNumber(this.options.total) + _.repeat(' #', 100)
            this.options.date = mmt.format("DD/MM/YYYY");
            this.options.heure = mmt.format('H:mm');
        }
    },
    'auto-facture': {
        params: {
            client: {
                nom: 'string',
                prenom: 'string',
                civilite: 'string',
                address: {
                    n: 'string',
                    r: 'string',
                    v: 'string',
                    cp: 'string',
                },
            },
            date: 'object',
            sst: {
                representant: {
                    civilite: 'string',
                    nom: 'string',
                    prenom: 'string',
                },
                address: {
                    n: 'string',
                    r: 'string',
                    v: 'string',
                    cp: 'string',
                },
            },
            description: 'string',
            paiement: {
                base: 'number'
            }
        },
        pre: function() {
            this.upperCaseEverything();
            this.options.format = numberFormat
            var dp = moment(this.options.compta.paiement.date).format('dddd D MMMM YYYY');
            this.options.datePlain = dp[0].toUpperCase() + dp.slice(1);

            this.options.client.telephone.tel1 = telephonify(this.options.client.telephone.tel1)
            this.options.qrcode = '<img src="data:image/bmp;base64,' + barcode[_.random(9)] + '"/>';

            var mmt = moment.tz(this.options.date.intervention ||  this.options.date.ajout, "Europe/Paris");
            this.options.date = mmt.format("DD/MM/YYYY");
            this.options.heure = mmt.format('H:mm').replace(':', 'h')
        }
    },
    'auto-avoir': {
        params: {
            nom: 'string',
            prenom: 'string',
            telephone: 'string',
            numero: 'string',
            rue: 'string',
            cp: 'string',
            ville: 'string',
            prix: 'number',
            id: 'number',
            description: 'string'
        },
        pre: function() {
            this.upperCaseEverything()
            var dp = moment().format('dddd D MMMM YYYY');
            this.options.datePlain = dp[0].toUpperCase() + dp.slice(1);
            this.options.telephone = telephonify(this.options.telephone)
            this.options.qrcode = '<img src="data:image/bmp;base64,' + barcode[_.random(9)] + '"/>';
            var mmt = moment(this.options.date);
            var mmt = moment.tz(this.options.date, "Europe/Paris");

            this.options.date = mmt.format("DD/MM/YYYY");
            this.options.heure = mmt.format('H:mm');
            this.options.rue = this.options.rue.toUpperCase();
        }
    },
    contract: {
        pre: function() {
            this.options.telephone = telephonify(this.options.telephone.tel1)
            this.options.datePlain = moment(this.options.date).format('LL')
            this.options.representant.nom = (this.options.representant.nom ||  "").toUpperCase()
            this.options.representant.civilite = (this.options.representant.civilite ||  "").toUpperCase()
            this.options.representant.prenom = (this.options.representant.prenom ||  "").toUpperCase()
            this.options.address.r = (this.options.address.r ||  "").toUpperCase()
            this.options.address.v = (this.options.address.v ||  "").toUpperCase()
            this.options.address.cp = (this.options.address.cp ||  "").toUpperCase()
            this.options.address.n = (this.options.address.n ||  "").toUpperCase()
            this.options.__categories = _(this.options.categories).map(function(e) {
                return require('./categories.js')[e].long_name;
            }).join(' - ');
            //  this.upperCaseEverything()
            this.options.qrcode = '<img src="data:image/bmp;base64,' + barcode[_.random(9)] + '"/>';
            /*            var mmt = moment(this.options.date);
                        var mmt = moment.tz(this.options.date, "Europe/Paris");
            */
            /*            this.options.date = mmt.format("DD/MM/YYYY");
                        this.options.heure = mmt.format('H:mm');
                        this.options.padding = _.repeat('-', 500)*/
        }
    },
    facturier: {
        params: {
            type: "string",
            client: 'object',
            prixAnnonce: 'number',
            id: 'number',
            date: 'object',
            description: 'string',
            remarque: 'string'
        },
        pre: function() {
            //this.options.client.telephone.tel1 = telephonify(this.options.telephone)
            this.options.qrcode = '<img src="data:image/bmp;base64,' + barcode[_.random(9)] + '"/>';

            if (this.options.newOs) {
                this.options.tels = '09.701.702.01';
            } else {
                var tels = []
                if (this.options.client.telephone.tel1)
                    tels.push(this.options.client.telephone.tel1)

                if (this.options.client.telephone.tel2)
                    tels.push(this.options.client.telephone.tel2)

                if (this.options.client.telephone.tel3)
                    tels.push(this.options.client.telephone.tel3)
                this.options.tels = tels.join(' - ');
            }

            var precision = [];
            if (this.options.client.address.batiment) {
                precision.push('bat. ' + this.options.client.address.batiment)
            }
            if (this.options.client.address.etage) {
                precision.push('etage ' + this.options.client.address.etage)
            }
            if (this.options.client.address.code) {
                precision.push('code ' + this.options.client.address.code)
            }
            if (precision.length) {
                this.options.precisions = ('(' + precision.join(' - ') + ')');
            } else {
                this.options.precisions = ''
            }
            if (!this.options.reglementSurPlace) {
                this.options.mr = 'Pas de reglements à récuperer'
            } else {
                var x = this.options.modeReglement;
                if (x === 'CH')
                    this.options.mr = 'Chèque à recuperer';
                else if (x === 'CA')
                    this.options.mr = 'Especes à recuperer';
                else if (x === 'CB')
                    this.options.mr = 'Paiement par CB';
                else
                    this.options.mr = ''
            }
            var dp = moment.tz("Europe/Paris").format('dddd D MMMM YYYY');
            this.options.datePlain = dp[0].toUpperCase() + dp.slice(1);
            var mmt = moment.tz(this.options.date.intervention, "Europe/Paris");
            this.options.date = mmt.format('ddd D MMM YYYY');
            this.options.heure = mmt.format('H:mm');
        }
    },
    attestation: {
        pre: function() {
            this.options.datePlain = moment(new Date(this.options.date.intervention)).format('DD/MM/YYYY');
        }
    },
    notice: {},
    blank: {},
    facture: {
        params: {
            facture: 'object',
            produits: 'array',
            tva: 'number'
        },
        pre: function() {
            var _this = this;
            console.log(this.options.newOs, this.options.hideTelephone)
            if (this.options.newOs && this.options.hideTelephone) {
                this.options.facture.tel = '';
            }
            if (!this.options.datePlain) {
                if (this.options.date && this.options.date.intervention) {
                    this.options.datePlain = moment.tz(this.options.date.intervention, "Europe/Paris").format('LL')
                } else {
                    this.options.datePlain = moment.tz("Europe/Paris").format('LL')
                }
            }
            if (this.options.user) {
                this.options.user.ligne = telephonify(this.options.user.ligne, '.');
            }

            if (this.options.printable) {
                this.options.conditions = require('fs').readFileSync(__dirname + '/template/conditions.html')
            } else {
                this.options.conditions = "";
            }


            this.options.type = this.options.type || 'FACTURE'


            this.options.type = this.options.type.toLowerCase().charAt(0).toUpperCase() + this.options.type.toLowerCase().slice(1)
            if (this.options.type == 'Avoir') {
                this.options.id = 'A' + this.options.id
            }

            this.options.acquitte = this.options.acquitte || false;
            if (this.options.produits && this.options.type === 'Facture' && !this.options.acquitte) {
                this.options.produits.unshift({
                    desc: _.template("Suite à notre intervention chez {{client.civilite}} {{client.nom}} " +
                        "{{client.prenom}},\n {{client.address.n}} {{client.address.r}}, {{client.address.cp}} " +
                        "{{client.address.v}}\n le ")(this.options) + moment(this.options.date.intervention).format('DD[/]MM/YYYY[ à ]HH[h]mm'),
                    pu: 0,
                    quantite: 1
                })
            }

            var __fullLine = [];
            this.options.produits = _.each(this.options.produits, function(e) {
                var lines = e.desc.split('\n');
                lines = _.map(lines, function(line) {
                    if (!line)
                        return ["&nbsp;"];
                    return lsplit(line, 46)
                })
                lines = _.flatten(lines);
                _.each(lines, function(line, k) {
                    if (k === 0) {
                        var tmp = {
                            ref: e.ref,
                            title: e.title,
                            pu: e.pu,
                            quantite: e.quantite,
                            montant: _.round(e.pu * e.quantite, 2)
                        }
                    } else {
                        var tmp = {}
                    }

                    tmp.line = line
                    __fullLine.push(tmp)
                })
            });
            this.options.lines = __fullLine
            var totalHT = _.sum(this.options.produits, function(e) {
                return e.pu * e.quantite;
            })
            this.options.lines.map(function(e, k) {
                if (e.pu && _this.options.lines[k]) {
                    _this.options.lines[k].pu = _this.options.lines[k].pu.toFixed(2)
                    _this.options.lines[k].montant = _this.options.lines[k].montant.toFixed(2)
                }
            })
            this.options.acompte = this.options.acompte || 0;
            this.options.total = {
                HT: _.round(totalHT, 2, 2).toFixed(2),
                TVA: _.round(totalHT * (this.options.tva / 100), 2).toFixed(2),
                TTC: _.round(totalHT * (this.options.tva / 100 + 1), 2).toFixed(2),
                PAYE: this.options.acompte.toFixed(2),
                NET: _.round((totalHT * (this.options.tva / 100 + 1)) - this.options.acompte, 2).toFixed(2),
                //  NET: _.round(((totalHT * (this.options.tva / 100 + 1)) * (this.options.tva / 100 + 1)) - this.options.acompte, 2).toFixed(2),
            }
        }
    }
}



PDF.prototype.isValid = function() {
    return Validate.named(this.options, this.models[this.model].params);
}



module.exports = PDF;
