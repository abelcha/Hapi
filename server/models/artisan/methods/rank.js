module.exports = function(schema) {

  var getNoobs = function() {
    return new Promise(function(resolve, reject) {
      db.model('intervention').aggregate([{
        $match: {
          'artisan.id': {
            $exists: true
          },
          status: {
            $in: ['RGL', 'PAY']
          }
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
      console.log("empty artisan array")
      this.rtn = [];
      this.x = -1;
    }

    if (!docs.length || i === docs.length - 1) {
      console.log("end of shit")
      return cb(this.rtn)
    }
    if (!docs[i].obj.archive && (!req.query.categorie || docs[i].obj.categories.indexOf(req.query.categorie) >= 0)) {
      console.log("artisan " + docs[i].obj.id + " is added")
      if (++this.x > req.query.limit) {
      console.log("check limit")
        return cb(this.rtn)
      }
      if (docs[i].obj.absence && docs[i].obj.absence.start) {
      console.log("useless abesnce check")

      }
      console.log("push artisan " +docs[i].obj.id )

      this.rtn.push({
        disponible: docs[i].obj.disponible,
        distance: docs[i].dis.toFixed(1),
        categories: docs[i].obj.categories,
        address: {
          lt: docs[i].obj.address.lt,
          lg: docs[i].obj.address.lg,
        },
        noob: (noobs.indexOf(docs[i].obj.id) == -1),
        // address: docs[i].obj.add,
        absence: docs[i].obj.absence,
        id: docs[i].obj.id,
        nomSociete: docs[i].obj.nomSociete
      });
    }
      console.log("recursive callback" )

    return mapRank(docs, i + 1, noobs, req, cb)
  }

  schema.statics.rank = function(req, res) {
    var self = this;
    console.log("rank")
    return new Promise(function(resolve, reject) {
      var point = {
        type: "Point",
        coordinates: [parseFloat(req.query.lat), parseFloat(req.query.lng)]
      };
      var options = {
        distanceMultiplier: 0.001,
        maxDistance: (parseFloat(req.query.maxDistance) || 50) / 0.001
      }
    console.log("start geonear")

      db.model('artisan').geoNear(point, options, function(err, docs) {
        if (err)
          return resolve(err);
    console.log("start getnoobs")

        getNoobs().then(function(noobs) {
    console.log("start maprank")

          mapRank(docs, 0, noobs, req, function(rtn) {
    console.log("resolve")

            resolve(rtn);
          })
        });
      });
    })
  }

}
