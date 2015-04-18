exports.getOriginalData = function(callbackFunction) {

  var request = require("request")
  var url = "http://electricien13003.com/alvin/test42.php"

  request({
    url: url,
    json: true
  }, function(error, response, body) {

    if (!error && response.statusCode === 200) {
      console.log("gotit");
      callbackFunction(body);
    }
  })
};


exports.translateData = function(data, callback) {

  var stock = [];
  for (key in data) {
    d = data[key];
    var tmp = {
      id: d.id,
      civ: d.civilite,
      nomSociete: d.nom_societe,
      nomRep: d.nom_representant,
      prenomRep: d.prenom_representant,
      categories: [],
      formeJuridique: d.forme_juridique,
      email: d.email,
      tel1: d.tel1,
      tel2: d.tel2,
      archive: (d.archive == 1 ? true : false),
      dateAjout: new Date(d.date_ajout * 1000),
      ajoutePar: d.ajoute_par,
      add: {
        n: d.numero,
        r: d.adresse,
        v: d.ville,
        cp: d.code_postal,
        lt: d.lat,
        lg: d.lng,
      },
      loc: [parseFloat(d.lat), parseFloat(d.lng)]
    };

    var cat = {
      EL: d.electricite,
      PL: d.plomberie,
      CH: d.chauffage,
      CL: d.climatisation,
      SR: d.serrurerie,
      VT: d.vitrerie
    };
    for (k in cat) {
      if (cat[k] == '1') {
        tmp.categories.push(k)
      }
    }
    //console.log(tmp.categories);
    stock.push(tmp);
  }
  callback(stock);
};


exports.dumpData = function(callback) {
  var that = this;
  that.getOriginalData(function(data) {
    that.translateData(data, function(trData) {
      callback(trData);
    });
  });
};
