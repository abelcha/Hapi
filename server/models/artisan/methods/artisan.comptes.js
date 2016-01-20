module.exports = function(schema) {
    var getMonthRange = function(m, y) {
        var date = new Date(y, m);
        return {
            $gte: new Date(date.getFullYear(), date.getMonth(), 1, -1),
            $lt: new Date(date.getFullYear(), date.getMonth() + 1, 1)
        }
    }

    var artisanMap = function(e) {
        var _padStart = require('lodash/padStart')
        var config = requireLocal('config/dataList.js');
        return [
            '401401' + _padStart(e._id, 5, '0'),
            config.formeJuridique[e.formeJuridique].long_name,
            e.nomSociete,
            e.address.n,
            e.address.r,
            e.address.v,
            e.address.cp
        ]
    }

    schema.statics.comptes = function(req, res) {
        var moment = require('moment')
        var _this = this;
        return new Promise(function(resolve, reject) {
            if (req.query.download) {
                res.contentType('text/csv');
                res.setHeader('Content-disposition', 'attachment; filename=' + "ComptesArtisans" + moment().format('LL') + ".txt");
            }
            db.model('artisan').find({})
                .select('formeJuridique nomSociete address')
                .stream()
                .on('data', function(e) {
                    res.write(artisanMap(e).join(';') + "\r\n")
                })
                .on('end', function() {
                    res.end()
                })
        });
    };
}
