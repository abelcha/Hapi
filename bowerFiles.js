var fs = require("fs");
var files = [
    'bower_components/jquery/dist/jquery.min.js',
    'bower_components/slimScroll/jquery.slimScroll.min.js',
    'bower_components/angular/angular.min.js',
    'bower_components/angular-route/angular-route.min.js',
    'bower_components/angular-resource/angular-resource.min.js',
    'bower_components/angular-animate/angular-animate.min.js',
    'bower_components/angular-aria/angular-aria.min.js',
    'bower_components/angular-slimscroll/angular-slimscroll.js',
    'bower_components/angular-material/angular-material.js',
    'bower_components/socket.io/socket.io.js',
    'bower_components/angular-socket-io/socket.min.js',
    'bower_components/ngmap/build/scripts/ng-map.js',
    'bower_components/ng-file-upload/ng-file-upload.min.js',
    'bower_components/pickadate/lib/compressed/picker.js',
    'bower_components/lodash/lodash.min.js',
    'bower_components/angular-xeditable/dist/js/xeditable.min.js',
    'bower_components/pickadate/lib/compressed/picker.date.js',
    'bower_components/pickadate/lib/compressed/picker.time.js',
    'bower_components/pickadate/lib/compressed/translations/fr_FR.js',
    'bower_components/ng-pickadate/ng-pickadate.js',
    'bower_components/velocity/velocity.js',
    'bower_components/lumx/dist/lumx.js',
    'bower_components/ng-table/dist/ng-table.js',
    'bower_components/moment/min/moment.min.js',
    'bower_components/moment/locale/fr.js',
    'bower_components/d3/d3.min.js',
    'bower_components/dimple/dist/dimple.latest.min.js',

    'bower_components/font-awesome/css/font-awesome.min.css',
    'bower_components/bootstrap/dist/css/bootstrap.min.css',
    'bower_components/ng-table/dist/ng-table.css',
    'bower_components/angular-xeditable/dist/css/xeditable.css',
    'bower_components/angular-material/angular-material.css',
    'bower_components/pickadate/lib/compressed/themes/classic.css',
    'bower_components/pickadate/lib/compressed/themes/classic.date.css',
    'bower_components/pickadate/lib/compressed/themes/classic.time.css',
    'bower_components/lumx/dist/lumx.css',
    'bower_components/mdi/css/materialdesignicons.css',
]

files.forEach(function(f) {
	if (!fs.existsSync(f))
		console.log(f)
})
