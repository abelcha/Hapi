var _ = require('lodash');

var internationalize = function(tel) {
  if (tel.length === 10) {
    console.log('TEN')
    return tel.replace(/^0/, '33');
  }
  if (tel.length === 13) {
    return tel.replace(/^00/, '');
  }
  console.log('NOTEN')
  return tel;
}

var request = function(query) {
  var response = _.pick(query, 'status_code', 'description', 'redirect_to');
  this.json(response);
  console.log("-=-=->", query);
  db.model('axialis')(query).save();
  if (response.status_code === 200 && query.id_intervention) {
    var q = {
      id: query.id_intervention,
      appels: {
        $not: {
          $elemMatch: {
            call_id: query.call_id
          }
        }
      }
    }
    db.model('intervention').findOne(q).populate('sst').then(function(resp) {
      if (resp) {
        resp.appels = resp.appels || [];
        resp.appels.push(query);
        resp.save(function(err, resp) {
          console.log("==>", query._type, query._type === 'CALLBACK')
          if (query._type === 'CALLBACK') {
            var template =
              "le client {{id}} ({{client.civilite}} {{client.nom}}) rappel le {{artisan.nomSociete}}"
          } else {
            var template =
              "{{artisan.nomSociete}} appel le client {{id}} ({{client.civilite}} {{client.nom}})"
          }
          edison.event('INTER_CALL_' + query._type)
            .id(resp.id)
            .broadcast(resp.login.ajout)
            .self()
            .icon('phone')
            .color('green')
            .message(_.template(
              "{{artisan.nomSociete}} appel le client {{id}} ({{client.civilite}} {{client.nom}})")(resp))
            .send()
            .save()
        });
        setTimeout(function() {
          edison.event('INTER_CALL_RECORDING')
            .id(resp.id)
            .broadcast(resp.login.ajout)
            .self()
            .icon('phone')
            .color('green')
            .message(_.template(
              "La conversation téléphonique du client {{id}} ({{client.civilite}} {{client.nom}}) a été upload"
            )(resp))
            .send()
            .save()
          db.model('axialis').get.fn(query.call_id);
        }, 25 * 60 * 1000);
      }
    })
  }
}

module.exports = {
  info: function(req, res) {
    if (req.query.api_key !== 'F8v0x13ftadh89rm0e9x18b62ZqgEl47') {
      return res.sendStatus(401)
    }
    db.model('intervention').update({
      "appels.call_id": req.query.call_id
    }, {
      $set: {
        "appels.$.duration": req.query.duree_about,
        "appels.$.status": req.query.status,
      }
    }, function(err, resp) {
      console.log("===>INFO RESP", err, resp)
    })

    res.send('ok')
  },
  callback: function(req, res) {
    var _ = require('lodash');
    var q = req.query;
    if (req.query.api_key !== 'F8v0x13ftadh89rm0e9x18b62ZqgEl47') {
      return res.sendStatus(401)
    }

    if (!req.query.call_origin) {
      return res.json({
        status_code: 401,
        description: 'Invalid Request'
      });
    }

    req.query.call_origin = req.query.call_origin.replace('0033', '0');
    db.model('intervention').findOne({
      $or: [{
        'client.telephone.tel1': req.query.call_origin
      }, {
        'client.telephone.tel2': req.query.call_origin
      }, {
        'client.telephone.tel3': req.query.call_origin
      }],
      status: {
        $in: ['ENC', 'VRF']
      },
      'compta.reglement.recu': false
    }).populate('sst').sort('-id').then(function(resp) {
      if (!resp) {
        return request.bind(res)({
          call_id: req.query.call_id,
          origin: req.query.call_origin,
          _type: 'CALLBACK',
          status_code: 402,
          description: 'partenaire inconnu'
        });
      }
      request.bind(res)({
        call_id: req.query.call_id,
        origin: req.query.call_origin,
        _type: 'CALLBACK',
        status_code: 200,
        description: 'OK',
        id_sst: resp.sst.id,
        id_intervention: resp.id,
        redirect_to: resp.sst.telephone.tel1
      });
    })
  },
  contact: function(req, res) {
    var moment = require('moment');
    var _ = require('lodash');
    var q = req.query;
    console.log('==>', req.query)
    var twoDaysAgo = moment().add(-2, 'days').toDate()
    if (req.query.api_key !== 'F8v0x13ftadh89rm0e9x18b62ZqgEl47') {
      return res.sendStatus(401)
    }
    if (!req.params.id.match(/^\d+$/)) {
      return request.bind(res)({
        call_id: req.query.call_id,
        origin: q.call_origin,
        _type: 'CONTACT',
        status_code: 401,
        description: "Client inconnu"
      });
    }
    q.call_origin = q.call_origin && q.call_origin.replace('330', '0')


    db.model('artisan').findOne({
      $or: [{
        'telephone.tel1': q.call_origin
      }, {
        'telephone.tel2': q.call_origin
      }, {
        'id': parseInt(q.sst_id || 0)
      }]
    }).sort('-id').then(function(doc) {
      if (!doc) {
        return request.bind(res)({
          call_id: req.query.call_id,
          origin: q.call_origin,
          _type: 'CONTACT',
          status_code: 402,
          description: "telephone d'origine inconnu + pas de sst_id"
        });
      }
      if (req.params.id == '0' ||  req.params.id == '29549') {
        return request.bind(res)({
          call_id: req.query.call_id,
          origin: q.call_origin,
          _type: 'CONTACT',
          id_sst: doc.id,
          status_code: 401,
          description: "client inconnu"
        });
      }
      promise = db.model('intervention').findOne({
        id: parseInt(req.params.id),
        status: {
          $in: ['ENC', 'VRF']
        },
        'date.intervention': {
          $gt: twoDaysAgo
        }
      }).then(function(intervention) {
        if (!intervention || !intervention.artisan  || intervention.artisan.id !== doc.id) {
          return request.bind(res)({
            call_id: req.query.call_id,
            origin: q.call_origin,
            id_sst: doc.id,
            _type: 'CONTACT',
            status_code: 403,
            description: "le intervenant n'a pas les droits"
          });
        } else {
          return request.bind(res)({
            call_id: req.query.call_id,
            origin: q.call_origin,
            id_sst: doc.id,
            _type: 'CONTACT',
            status_code: 200,
            description: "OK",
            id_intervention: intervention.id,
            redirect_to: internationalize(intervention.client.telephone.tel1)
          });
        }
      })
    })
  }
}
