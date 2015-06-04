var PdfCreator = function(params) {
    if (!(this instanceof PdfCreator)) {
        return new PdfCreator(params);
    }
    var _this = this;
    return new Promise(function(resolve, reject) {
        _this.renderTemplate(params.template, params.args)
            .then(function(renderedTemplate) {
                if (params.html) {
                    resolve(renderedTemplate);
                } else if (params.buffer) {
                    _this.createBuffer(renderedTemplate).then(resolve, reject)
                } else {
                    _this.createFile(renderedTemplate, params.fileName).then(resolve, reject)
                }
            }, reject)
    });
}

PdfCreator.prototype.renderTemplate = function(templateName, args) {
    var fs = require('fs');
    var ejs = require('ejs');
    var fileName = process.cwd() + '/server/pdf/' + templateName + '.html';

    return new Promise(function(resolve, reject) {
        fs.readFile(fileName, 'utf8', function(err, template) {
            if (err) return reject(err);
            resolve(ejs.render(template, args))
        });
    })
}

PdfCreator.prototype.createFile = function(htmlString, fileName)  {
    var pdf = require('html-pdf');

    return new Promise(function(resolve, reject) {
        pdf.create(htmlString).toFile(fileName, function(err, result) {
            if (err) reject(err);
            resolve(result);
        });
    });
}

PdfCreator.prototype.createBuffer = function(htmlString)  {
    var pdf = require('html-pdf');

    return new Promise(function(resolve, reject) {
        pdf.create(htmlString).toBuffer(function(err, buffer) {
            if (err) reject(err);
            resolve(buffer);
        });
    });
}

module.exports = PdfCreator;
