var gulp = require('gulp');

// Include Our Plugins
var concat = require('gulp-concat');
var uglify = require('gulp-uglifyjs');
var rename = require('gulp-rename');
var minifyCSS = require('gulp-minify-css');

// Concatenate & Minify JS
gulp.task('scripts', function() {
	return gulp.src(['angular/*.js', 'angular/*/*.js', 'angular/*/*/*.js'])
		.pipe(concat('all.js'))
		.pipe(gulp.dest('assets/dist'))
		.pipe(uglify('all.min.js', {
			mangle: false
		}))
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