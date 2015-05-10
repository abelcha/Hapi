module.exports = function(schema) {

  var getNoobs = function() {
    return new Promise(function(resolve, reject) {
      edison.db.model.intervention.aggregate([{
        $match: {
          'artisan.id': {
            $exists: true
          },
          status: 'INT'
        }
      }, {
        $group: {
          nbr: {
            $sum: 1
          },
          _id: '$artisan.id'
        }
      }]).exec(function(err, doc) {
        var rtn = [];
        doc.forEach(function(e) {
          if (e.nbr > 5)
            rtn.push(e._id);
        })
        resolve(rtn);
      })
    })
  }

  var mapRank = function(docs, i, noobs, req, cb) {
    if (i === 0) {
      this.rtn = [];
      this.x = -1;
    }

    if (!docs.length || i === docs.length - 1) {
      return cb(this.rtn)
    }
    if (!req.query.categorie || docs[i].obj.categories.indexOf(req.query.categorie) >= 0) {
      if (++this.x > req.query.limit) {
        return cb(this.rtn)
      }

      this.rtn.push({
        distance: docs[i].dis.toFixed(1),
        categories: docs[i].obj.categories,
        address: {
          lt: docs[i].obj.address.lt,
          lg: docs[i].obj.address.lg,
        },
        noob: (noobs.indexOf(docs[i].obj.id) == -1),
        // address: docs[i].obj.add,
        id: docs[i].obj.id,
        nomSociete: docs[i].obj.nomSociete
      });
    }
    return mapRank(docs, i + 1, noobs, req, cb)
  }

  schema.statics.rank = function(req, res) {
    console.time("rank")
    var self = this;
    return new Promise(function(resolve, reject) {
      var point = {
        type: "Point",
        coordinates: [parseFloat(req.query.lat), parseFloat(req.query.lng)]
      };
      var options = {
        distanceMultiplier: 0.001,
         maxDistance: (parseFloat(req.query.maxDistance) || 50) / 0.001
      }
      edison.db.model.artisan.geoNear(point, options, function(err, docs) {
        console.log(docs.length)
        if (err)
          return resolve(err);
        docs = JSON.parse(JSON.stringify(docs));
        getNoobs().then(function(noobs) {
          mapRank(docs, 0, noobs, req, function(rtn) {
            console.timeEnd("rank")
            resolve(rtn);
          })
        });
      });
    })
  }

}
