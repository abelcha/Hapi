module.exports = function(schema) {

  schema.statics.dbDump = function(req, res) {
    if (req.query.key !== 'xftw') {
      return res.status(401).send('NOPE');
    } else {
      var exec = require('child_process').exec;
      exec("node db_dump.js -x", function(error, stdout, stderr) {
        console.log(">>>>>>>>>>>>>>>", error, stdout, stderr);
      });
    }
  }
}
