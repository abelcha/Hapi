module.exports = function(schema) {
  var moment = require('moment')
  var async = require('async')
  var _ = require('lodash')


  var getTotal = function(e) {
    var pf = (e.compta.reglement.montant || e.compta.paiement.base ||  e.prixFinal);

    if ((new Date(e.date.ajout)).getFullYear() >= 2016 && e.facture && e.facture.payeur === 'GRN' && e.login.ajout ===
      'harald_x') {
      return _.round(pf * 0.02, 2);
    } else if ((new Date(e.date.ajout)).getFullYear() >= 2016 && e.categorie === 'VT' && (e.login.ajout ===
        'maxime_s' || e.login.ajout === 'gregoire_e')) {
      return _.round(pf * 0.005, 2);
    } else {
      return e.categorie === 'VT' ? 1.5 : _.round(pf * 0.01, 2);
    }

  }

  var xcalc = function(e) {
    // harald - Grand Compte - 1 janvier 2016 => 2%
    // gregoire/maxime - Vitrerie - => 0.5%

    var pf = (e.compta.reglement.montant || e.compta.paiement.base ||  e.prixFinal);


    return {
      cat: e.categorie,
      date: e.date.ajout,
      pf: pf,
      id: e.id,
      com: e.categorie === 'VT' ? "" : "1%",
      total: getTotal(e)
    }
  }


  var createInvoice = function(rtn, user, res) {
    var fs = require('fs');
    var Invoice = require('com-ninja');
    var input = {

      currencyFormat: "%d€",
      invoice_number: "e.id",
      date_now: moment().format('LLL'),
      from_name: 'EDISON-SERVICES',
      client_name: user.login,

      items: _.map(rtn, function(e) {
        return {
          id: e.id,
          cat: e.cat,
          date: moment(e.date).format('L'),
          montant: e.pf,
          com: e.com,
          total: e.total,
        }
      })
    }

    input._montant = _.round(_.reduce(rtn, function(total, n) {
      return total + n.pf;
    }, 0), 2)

    input._total = _.round(_.reduce(rtn, function(total, n) {
      return total + n.total;
    }, 0), 2)




    var invoice = new Invoice();
    invoice.generatePDFStream(input).pipe(res);
  }



  var getComs = function(options, callback) {
    var getMonthRange = function(m, y) {
      var date = new Date(y, m);
      return {
        $gte: new Date(date.getFullYear(), date.getMonth(), 1, -1),
        $lt: new Date(date.getFullYear(), date.getMonth() + 1, 1)
      }
    }
    var dateRange = getMonthRange(options.m - 1, options.y)
    var paiementLimit = moment(dateRange.$gte).add(4, 'month').toDate()
    console.log(paiementLimit)
    return db.model('intervention').find({
        'date.ajout': dateRange,
        'login.ajout': options.l,
        'compta.paiement.effectue': true,
        'compta.paiement.date': {
          $lt: paiementLimit
        },
      }).select('id date.ajout categorie compta facture login prixFinal').sort("id")
      .exec(callback)
  }


  schema.statics.commissionsTabs = function(req, res) {

    return new Promise(function(resolve, reject) {
      var user = _.find(edison.users.data, 'login', req.query.l) ||  req.session;
      getComs(req.query, function(err, resp) {
        var rtn = _.map(resp, xcalc)
        return createInvoice(rtn, user, res)
      })
    })
  }

  schema.statics.commissions = function(req, res) {
    return new Promise(function(resolve, reject) {
      getComs(req.query, function(err, resp) {
        //   console.log(resp)
        resolve(resp);
      })
    })
  }
}
