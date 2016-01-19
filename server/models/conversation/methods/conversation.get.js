module.exports = function(schema) {
  schema.statics.get = {
    unique: true,
    findBefore: true,
    method: 'GET',
    fn: function(conversation, req, res) {
      try {

        var vopPostes = {
          '0972403794 Front-office - Sylvain': 'tayeb',
          '0972540801 Back-office - Maxime': 'maxime',
          '0972475214 Back-office - Adrien': 'anthony',
          '0972441663 Front-office - Benjamin': 'benjamin',
          '0972432279 Front-office - Laurent': 'laurent',
          '0972539775 Back-office - Superviseur': 'supervisor',
          '0972459659 Front-office - Fabien': 'harald',
          '0972484983 Back-office - Sebastien':'gregory'
        }

        console.log('A')
        var fs = require('fs');
        var glob = require('glob')
        var path = require('path')
        var _ = require('lodash')
        var moment = require('moment')
        var getDuration = require('get-audio-duration');
        var exec = require('child_process').exec;
        console.log('B')

        Date.prototype.unix = function() {
          return Math.round(this.getTime() / 1000)
        }
        console.log('C')
        console.log('====>', conversation)

        var poste = conversation.status === 'transfered' ? vopPostes[conversation.dest] : conversation.poste;
        console.log('-->', poste)
        var filepath = path.join(poste, "recordings");
        var filename = moment(conversation._id).format("[/record-]YYMMDD[-]HHmmss[.wav]")
        var fileRegexp = moment(conversation._id).format("[/record-]YYMMDD[-*.wav]")
        var cacheFilePath = process.env.CACHE_PATH + '/conversation/' + moment(conversation.date).format('YYMMDD-HHmmssSSS') + '.wav'
        var nbr = parseInt(filename.slice(-10, -4))
        var completePath = path.join(process.env.FTP_PATH, filepath, filename);
        //res.setHeader('Content-disposition', 'attachment; filename=' + conversation._id + '.mp3');
        console.log('HERE')
        if (fs.existsSync(cacheFilePath)) {
          console.log('CACHE', cacheFilePath)
          return res.sendFile(cacheFilePath);
        }
        if (fs.existsSync(completePath)) {
          console.log('MATCH')
          return res.sendFile(completePath)
        }
        console.log('FIND')

        var files = glob.sync(path.join(process.env.FTP_PATH, filepath, fileRegexp))
          .map(function(e) {
            return {
              nbr: parseInt(e.slice(-10, -4)),
              file_date: moment(e.slice(-17, -4), "YYMMDD-HHmmss").toDate(),
              path: e
            }
          }).sort(function(a, b) {
            return a.nbr - b.nbr
          })
        console.log("length=>", path.join(process.env.FTP_PATH, filepath, fileRegexp))
        var closestIndex = _.findIndex(files, function(e) {
          return e.nbr > nbr
        })
        if (closestIndex < 0) {
          return res.status(404).send('not found')
        }
        console.log('CLOSEST INDEX=>', closestIndex)
        var closest = _.merge(files[closestIndex - 1], conversation.toObject());
        console.log('CLOSEST=>', closest)
        var overlaps = _.merge(files[closestIndex], conversation.toObject());
        console.log('CLOSEST=>', overlaps)


        getDuration(closest.path).then(function(duration) {
          if (closest.date.unix() - closest.file_date.unix() < duration) {

            var command = [
              "ffmpeg",
              "-y",
              "-ss", closest.date.unix() - closest.file_date.unix(),
              "-t", closest.duration,
              "-i", closest.path,
              cacheFilePath
            ]
            exec(command.join(' '), function(error, stdout, stderr) {
              console.log("WWW", error, stdout, stderr)

              return res.sendFile(cacheFilePath)
            });
          } else {
            //si la duree du fichier  - offset < duration
            getDuration(overlaps.path).then(function(overlapsDuration) {
              var startOffset = overlaps.date.unix() - overlaps.file_date.unix();
              console.log(startOffset + overlaps.duration, overlapsDuration)
              if (startOffset + overlaps.duration > 10) {
                var command = [
                  "ffmpeg",
                  "-y",
                  "-ss", 0,
                  "-t", overlaps.duration,
                  "-i", overlaps.path,
                  cacheFilePath
                ]
                exec(command.join(' '), function(error, stdout, stderr) {
                  console.log(error, stderr, stdout)
                  return res.sendFile(cacheFilePath)
                });
                //console.log(overlaps)
              } else {
                res.status(404).send('NOT FOUND')
              }
            })
          }
        })
      } catch (err) {
        console.log('ERR', e)
      }
    }
  }
}
