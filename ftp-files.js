  var moment = require('moment')
  var date = new Date()//new Date(2015,10, 5, 4);
  var records = moment(date).format('[../ftp/*/recordings/][record-]YYMMDD[*.wav]')
  var xml = moment(date).format('[../ftp/*/calls/]YYMM[/calls-]YYMMDD[*.xml]')
  var glob = require('glob');
  var _ = require('lodash');
  var shell = require('shelljs')
  var md5 = require('md5');
  var fs = require('fs')
  var async = require('async')
  require('./server/shared.js')()
  console.log(xml)


  var parseFile = function(fileName) {
    var XML = require('pixl-xml');

    var content = fs.readFileSync(fileName, 'utf-8');
    try {
      var parsed = XML.parse(content);
    } catch (e) {
      try {
        var parsed = XML.parse(content + '</calls>');
        return parsed;
      } catch (e) {
        console.log(JSON.stringify(e, undefined, 2))
        return 0
      }
    }
  }
  var xmlFiles = glob.sync(xml)
  _.each(xmlFiles, function(e) {
    fs.watchFile(e, {
      interval: 1
    }, (curr, prev) => {


      var getHash = function(call) {
        return call.time + ':0' + (call.to ||  call.from || "").slice(8, 10)
      }

      var filterContent = function(e) {
        return e.withoperator !== 'never'
      }



      /*   var asyncEach = function(e, callback) {
           db.intervention.findOne({
             'date.ajout': {
               $gt: moment().startOf('day').toDate()
             },
             $or: [{
               'client.telephone.tel1': e.to
             }, {
               'client.telephone.tel2': e.to
             }, {
               'client.telephone.tel3': e.to
             }]
           }, function(err, resp) {
             if (resp) {
               resp.calls.push(resp);
               e.archived = true
             }
           })

         }*/

      var insertEach = function(call, callback)  {
        db.model('conversation').update({
          _id: call._id
        }, {
          $set: call
        }, {
          upsert: true
        }).exec(function(err, resp) {
          console.log(err, resp);
          callback(null)
        })
      }

      var mapContent = function(call) {
        if (call.from._Data) {
          call.from = call.from._Data
        }
        if (call.to._Data) {
          call.to = call.to._Data
        }
        call.to = call.to.replace(/^0033/, '0')
        call.from = call.from.replace(/^0033/, '0')
        call.poste = e.split('/')[2];
        call.dest = call.to;
        call.origin = call.from;
        call.from = call.from.slice(0, 10);
        call.to = call.to.slice(0, 10)
        var d = call.duration.split(':').map(_.partial(parseInt, _, 10))
        call.duration = d[0] * 3600 + d[1] * 60 + d[2];
        call._id = moment(getHash(call), "DD/MM/YY HH:mm:ss:SSS").toDate()
        call.date = call._id
        call.archived = false;
        return call
      }


      var content = parseFile(e)
      if (content) {
        var upd = content.call.filter(filterContent).map(mapContent)
        async.eachLimit(upd, 1, insertEach, function(err, resp) {
          console.log('OKOK')
       //   process.exit()
        })
      }
    });
  })
 // shell.exec("sleep 0.01 && echo '' >> ../ftp/harald/calls/1601/calls-160104.xml")
