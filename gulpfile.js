'use strict';
var gulp = require('gulp');

// Include Our Plugins
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var sourcemaps = require('gulp-sourcemaps');
var minifyCSS = require('gulp-minify-css');

var watchify = require('watchify');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var gutil = require('gulp-util');
var assign = require('lodash').assign
var glob = require("glob")
var jshint = require('gulp-jshint');
// Concatenate & Minify JS
gulp.task('scripts', function() {
    return gulp.src(['front/angular/*.js', 'front/angular/*/*.js', 'front/angular/*/*/*.js'])
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(sourcemaps.init())
        .pipe(concat('all.js'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('front/assets/dist'));
});

var customOpts = {
    entries: glob.sync('config/[^_]*.js'),
    debug: true
};
var opts = assign({}, watchify.args, customOpts);
var b = watchify(browserify(opts));

// add transformations here
// i.e. b.transform(coffeeify);


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
    return gulp.src('front/assets/css/*.css')
        .pipe(concat('all.min.css'))
        .pipe(minifyCSS())
        .pipe(gulp.dest('front/assets/dist'))
});



// Watch Files For Changes
gulp.task('watch', function() {
    gulp.watch(['front/angular/*.js', 'front/angular/*/*.js', 'front/angular/*/*/*.js'], ['scripts']);
    gulp.watch('front/assets/css/*.css', ['styles'])
});

// Default Task
gulp.task('default', ['scripts', 'styles', 'watch', 'bundle']);
