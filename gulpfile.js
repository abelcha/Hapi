var gulp = require('gulp');

// Include Our Plugins
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var sourcemaps = require('gulp-sourcemaps');
var minifyCSS = require('gulp-minify-css');

// Concatenate & Minify JS
gulp.task('scripts', function() {
	return gulp.src(['front/angular/*.js', 'front/angular/*/*.js', 'front/angular/*/*/*.js'])
        .pipe(sourcemaps.init())
        //.pipe(babel())
        .pipe(concat('all.js'))
        .pipe(sourcemaps.write('./front/assets/'))
        .pipe(gulp.dest('front/assets/dist'));
});

 
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
gulp.task('default', ['scripts', 'styles', 'watch']);