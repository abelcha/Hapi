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
    console.log('hey')
    jslibs = [
        '/jquery/dist/jquery.min.js',
        '/slimScroll/jquery.slimScroll.min.js',
        '/angular/angular.min.js',
        '/angular-route/angular-route.min.js',
        '/angular-resource/angular-resource.min.js',
        '/angular-animate/angular-animate.min.js',
        '/angular-aria/angular-aria.min.js',
        '/angular-slimscroll/angular-slimscroll.js',
        '/ngDialog/js/ngDialog.min.js',
        '/angular-material/angular-material.js',
        '/socket.io/socket.io.js',
        '/angular-socket-io/socket.min.js',
        '/ngmap/build/scripts/ng-map.js',
        '/ng-file-upload/ng-file-upload.min.js',
        '/pickadate/lib/compressed/picker.js',
        '/lodash/lodash.min.js',
        '/angular-xeditable/xeditable.min.js',
        '/pickadate/lib/compressed/picker.date.js',
        '/pickadate/lib/compressed/picker.time.js',
        '/pickadate/lib/compressed/translations/fr_FR.js',
        '/ng-pickadate/ng-pickadate.js',
        '/velocity/velocity.js',
        '/lumx/dist/lumx.js',
        '/ng-table/dist/ng-table.js',
        '/moment/min/moment.min.js',
        '/moment/locale/fr.js',
        '/angular-credit-cards/release/angular-credit-cards.js',
        '/d3/d3.min.js',
        '/dimple/dist/dimple.latest.min.js'
    ]
    jslibs = jslibs.map(function(e) {
        return 'front/bower_components' + e
    })
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
        'front/bower_components/font-awesome/css/font-awesome.min.css',
        'front/bower_components/bootstrap/dist/css/bootstrap.min.css',
        'front/assets/css/pixel-admin.min.css',
        'front/assets/css/themes.min.css',
        'front/assets/css/loaders.css',
        'front/assets/css/style.css',
        'front/assets/css/pages.min.css',


        'front/bower_components/ng-table/dist/ng-table.css',
        'front/bower_components/angular-xeditable/xeditable.css',
        'front/bower_components/angular-material/angular-material.css',
        'front/bower_components/angular-loading-bar/build/loading-bar.min.css',
        'front/assets/css/material-color.css',
        'front/bower_components/pickadate/lib/compressed/themes/classic.css',
        'front/bower_components/pickadate/lib/compressed/themes/classic.date.css',
        'front/bower_components/pickadate/lib/compressed/themes/classic.time.css',
        'front/bower_components/ngDialog/css/ngDialog.min.css',
        'front/bower_components/ngDialog/css/ngDialog-theme-default.min.css',
        'front/bower_components/lumx/dist/lumx.css',
        'front/bower_components/mdi/css/materialdesignicons.css'
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
