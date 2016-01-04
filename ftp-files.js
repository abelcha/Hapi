  var watch = require('gulp-watch')
  var moment = require('moment')
  var toWatch = ['/home/abel/ftp/supervisor/calls/1601/calls-160104.xml',
    '/home/abel/ftp/supervisor/recording/record-160104-142715.wav'
  ]
  var records = moment().format('[/home/abel/ftp/supervisor/recordings/][record-]YYMMDD*')
  var xml = moment().format('[/home/abel/ftp/supervisor/recordings/][record-]YYMMDD*')
  console.log(records)
    //  var x  =moment().format('/home/abel/ftp/supervisor/calls/1601/*')
    /*  watch(, function(a, b) {
        console.log(a, b)
      })
    */
