'use strict';
var gulp = require('gulp');

// Include Our Plugins
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var notify = require('gulp-notify');
var sourcemaps = require('gulp-sourcemaps');
var minifyCSS = require('gulp-minify-css');

var watchify = require('watchify');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var gutil = require('gulp-util');
var _ = require('lodash')
var glob = require("glob")
var jshint = require('gulp-jshint');
// Concatenate & Minify JS
var jslibs;
var jssrc;
gulp.task('scripts', function() {
    jssrc = ['front/angular/*.js', 'front/angular/*/*.js', 'front/angular/*/*/*.js'];
    return gulp.src(jssrc)
        // .pipe(jshint('.jshintrc'))
        //.pipe(jshint.reporter('jshint-stylish'))
        .pipe(sourcemaps.init())
        .pipe(concat('all.js'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('front/assets/dist'));
});

gulp.task('jsLibs', function() {
    jslibs = [

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
        'bower_components/mousetrap/mousetrap.min.js',
        'bower_components/chartist/dist/chartist.min.js',
        'bower_components/Chart.js/Chart.min.js',
        'bower_components/angular-chart.js/dist/angular-chart.min.js',
        'bower_components/highcharts/highcharts.js',
        'bower_components/ng-iban/dist/ng-iban.min.js'
        //      'bower_components/highcharts/themes/grid.js'
        //        'bower_components/angular-material-icons/angular-material-icons.js',

    ]
    return gulp.src(jslibs)
        //.pipe(minify({mangle:false}))
        // .pipe(jshint('.jshintrc'))
        //.pipe(jshint.reporter('jshint-stylish'))
        .pipe(sourcemaps.init())
        .pipe(concat('libs.js'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('front/assets/dist'));
});



var customOpts = {
    entries: glob.sync('config/[^_]*.js'),
    debug: true
};
var opts = _.assign({}, watchify.args, customOpts);
var b = watchify(browserify(opts));

var bundle = function() { // so you can run `gulp js` to build the file
    return b.bundle()
        // log errors if they happen
        .on('error', gutil.log.bind(gutil, 'Browserify Error'))
        .pipe(source('.'))
        // optional, remove if you don't need to buffer file contents
        .pipe(buffer())
        // optional, remove if you dont want sourcemaps
        .pipe(sourcemaps.init({
            loadMaps: true

        })) // loads map from browserify file
        // Add transformation tasks to the pipeline here.
        .pipe(sourcemaps.write('../bundle')) // writes .map file
        .pipe(gulp.dest('./front/assets/dist/bundle.js'));

}

gulp.task('bundle', bundle);

b.on('update', bundle); // on any dep update, runs the bundler
b.on('log', gutil.log); // output build logs to terminal




gulp.task('styles', function() {
    var libs = [
        'front/assets/css/material-color.css',
        'front/assets/css/pixel-admin.min.css',
        'front/assets/css/widget.css',
        'front/assets/css/themes.min.css',
        'front/assets/css/loaders.css',
        'front/assets/css/style.css',
        'front/assets/css/pages.min.css',

        'bower_components/chartist/dist/chartist.min.css',
        'bower_components/font-awesome/css/font-awesome.min.css',
        'bower_components/font-awesome-animation/dist/font-awesome-animation.min.css',
        'bower_components/bootstrap/dist/css/bootstrap.css',
        'bower_components/ng-table/dist/ng-table.css',
        'bower_components/angular-xeditable/dist/css/xeditable.css',
        'bower_components/angular-material/angular-material.css',
        'bower_components/pickadate/lib/compressed/themes/classic.css',
        'bower_components/pickadate/lib/compressed/themes/classic.date.css',
        'bower_components/pickadate/lib/compressed/themes/classic.time.css',
        'bower_components/lumx/dist/lumx.css',
        'bower_components/mdi/css/materialdesignicons.css',
        'bower_components/angular-chart.js/dist/angular-chart.min.css'
    ]
    return gulp.src(libs)
        //.pipe(minify({mangle:false}))
        // .pipe(jshint('.jshintrc'))
        //.pipe(jshint.reporter('jshint-stylish'))
        .pipe(sourcemaps.init())
        .pipe(concat('styles.css'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('front/assets/dist'));
});



// Watch Files For Changes
gulp.task('watch', function() {
    gulp.watch(jssrc, ['scripts']);
    gulp.watch(jslibs, ['jsLibs']);
    gulp.watch(['front/assets/css/*.css', 'front/bower_components/*/*.css', 'front/bower_components/*/*/*.css'], ['styles'])
});

// Default Task
gulp.task('default', ['scripts', 'styles', 'bundle', 'jsLibs', 'watch']);
