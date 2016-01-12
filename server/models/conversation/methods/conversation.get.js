module.exports = function(schema) {
  schema.statics.get = {
    unique: true,
    findBefore: true,
    method: 'GET',
    fn: function(conversation, req, res) {
      return new Promise(function(resolve, reject) {
        var fs = require('fs');
        var glob = require('glob')
        var path = require('path')
        var moment = require('moment')
        var filepath = path.join(conversation.poste, "recordings");
        var filename = moment(conversation._id).format("[/record-]YYMMDD[-]HHmmss[.wav]")
        var fileRegexp = moment(conversation._id).format("[/record-]YYMMDD[-*.wav]")
        var completePath = path.join(process.env.FTP_PATH, filepath, filename);

        if (fs.existsSync(completePath)) {
          res.sendFile(completePath)
        }
        var files = glob.sync(path.join(process.env.FTP_PATH, filepath, fileRegexp)).map(function(e) {
          return {
            nbr: parseInt(e.slice(-10, -4)),
            file: e
          }
        })

        console.log('-->', files)
      })
    }
  }
}
