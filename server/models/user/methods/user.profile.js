module.exports = function(schema) {
  schema.statics.profile = {
    unique: true,
    findBefore: true,
    method: 'GET',
    fn: function(user, req, res) {
      var fs = require('fs');
      //    console.log('here', user);

      if (fs.existsSync(process.cwd() + '/front/assets/img/profile/' + user.login + '.png')) {
        res.sendFile(process.cwd() + '/front/assets/img/profile/' + user.login + '.png');
      } else {
        res.sendFile(process.cwd() + '/front/assets/img/profile/default.jpg');
      }
    }
  }
}
