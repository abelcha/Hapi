var uuid = require('uuid');
var key = requireLocal('config/_keys');
var _ = require('lodash')
var Dropbox = function() {
    var DropboxAPI = require("dropbox")
    this.client = new DropboxAPI.Client({
        token: key.dropbox
    });
    var dbox = require("dbox")
    this.dbox = dbox.app({}).client(key.dropbox);
}
Dropbox.prototype.getFilename = function(p) {
    return '/V2/' + p.model + '/' + p.link + '/' + p._id + '.' + p.extension;
};

Dropbox.prototype.get = function(filePath, cb) {
    this.client.readFile(filePath, {
        buffer: true
    }, cb)

}

Dropbox.prototype.download = function(file_id) {
    var _this = this;
    return new Promise(function(resolve, reject) {
        db.model('document').findOne({
            _id: file_id
        }).then(function(doc) {
            if (!doc)
                return reject("Document not found");
            _this.client.readFile(doc.filename, {
                buffer: doc.isBinary
            }, function(error, data) {
                if (error)
                    return reject(error);
                var rtn = doc.toObject();
                rtn.data = data;
                return resolve(rtn);
            });
        }, reject)
    })
}

Dropbox.prototype.list = function(dir) {
    var _this = this;
    return new Promise(function(resolve, reject) {
        _this.client.readdir(dir, function(error, entries) {
            if (error) {
                return reject(error);
            }
            resolve(entries)
        });
    })
}

Dropbox.prototype.move = function(from, to) {
    var _this = this;
    return new Promise(function(resolve, reject) {
        _this.client.move(from, to, function(err, stats) {
            if (err)
                reject(err);
            resolve(stats);
        })

    })
}

Dropbox.prototype.copy = function(from, to) {
    var _this = this;
    return new Promise(function(resolve, reject) {
        _this.client.copy(from, to, function(err, stats) {
            if (err)
                reject(err);
            resolve(stats);
        })

    })
}

Dropbox.prototype.stack = function(buffer, filename, login) {
    var moment = require('moment');
    var folder = envProd ? '/PrintQueue/' : '/PrintQueueDev/'
    return this.upload({
        filename: folder + [moment().format('L').replace(/\D/g, '-'), filename, login].join(' - ') + '.pdf',
        data: buffer
    })
}

Dropbox.prototype.upload = function(params) {
    var _this = this;
    return new Promise(function(resolve, reject) {
        params._id = uuid.v4();
        params.filename = params.filename || _this.getFilename(params);
        _this.client.writeFile(params.filename, params.data, function(error, stat) {
            if (error)
                return reject(error);
            return resolve(params);
        });
    })

}
module.exports = Dropbox;
