var gulp = require('gulp');

// Include Our Plugins
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var sourcemaps = require('gulp-sourcemaps');
var babel = require('gulp-babel');
var minifyCSS = require('gulp-minify-css');

// Concatenate & Minify JS
gulp.task('scripts', function() {
	return gulp.src(['angular/*.js', 'angular/*/*.js', 'angular/*/*/*.js'])
        .pipe(sourcemaps.init())
        //.pipe(babel())
        .pipe(concat('all.js'))
        .pipe(sourcemaps.write('./assets/'))
        .pipe(gulp.dest('assets/dist'));
});

 
gulp.task('styles', function() {
  return gulp.src('assets/css/*.css')
  	.pipe(concat('all.min.css'))
    .pipe(minifyCSS())
    .pipe(gulp.dest('assets/dist'))
});


// Watch Files For Changes
gulp.task('watch', function() {
	gulp.watch(['angular/*.js', 'angular/*/*.js', 'angular/*/*/*.js'], ['scripts']);
	gulp.watch('assets/css/*.css', ['styles'])
});

// Default Task
gulp.task('default', ['scripts', 'styles', 'watch']);