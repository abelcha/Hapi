
// Load plugins
var gulp = require('gulp'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    ngAnnotate = require('gulp-ng-annotate'),
    sourcemaps = require('gulp-sourcemaps')
var gutil = require('gulp-util');

var paths = {
    css: [
        'client/app/app.css',
        'front/assets/css/style.css',

    ],
    js: [
        'front/angular/*.js',
        'front/angular/*/*.js',
        'front/angular/*/*/*.js'
    ],
    vendor: {
        js: [
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
            'bower_components/angular-socket-io/socket.js',
            'bower_components/ngmap/build/scripts/ng-map.js',
            'bower_components/ng-file-upload/ng-file-upload.min.js',
            'bower_components/pickadate/lib/compressed/picker.js',
            'bower_components/lodash/dist/lodash.min.js',
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
        ],
        css: [
            'front/assets/css/material-color.css',
            'front/assets/css/pixel-admin.min.css',
            'front/assets/css/widget.css',
            'front/assets/css/themes.min.css',
            'front/assets/css/loaders.css',
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
    },
    shared: 'config/[^_]*.js',
    dist: {
        css: 'front/assets/dist/css',
        js: 'front/assets/dist/js',
        jsDest: 'dist.js',
        cssDest: 'dist.css',
        jsVendorDest: 'vendor.js',
        cssVendorDest: 'vendor.css'
    },
};

// Vendor

gulp.task('vendor-js', function() {
    return gulp.src(paths.vendor.js)

        .pipe(concat(paths.dist.jsVendorDest))
        .pipe(gulp.dest(paths.dist.js))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(uglify())
        .on('error', gutil.log)
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(paths.dist.js))
        .pipe(notify({
            message: 'VendorJs task complete'
        }));

})


gulp.task('vendor-css', function() {
    return gulp.src(paths.vendor.css)
        .pipe(concat(paths.dist.cssVendorDest))
        .pipe(gulp.dest(paths.dist.css))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(minifycss())
        .pipe(gulp.dest(paths.dist.css))
        .pipe(notify({
            message: 'VendorCss task complete'
        }))
})

// Scripts
gulp.task('scripts', function() {

    return gulp.src(paths.js)
        .pipe(ngAnnotate({
            remove: true,
            add: true,
            single_quotes: false
        }))
        .pipe(sourcemaps.init())
        .pipe(concat(paths.dist.jsDest))
        .pipe(gulp.dest(paths.dist.js))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(uglify())
        .on('error', gutil.log)
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(paths.dist.js))
        .pipe(notify({
            message: 'Scripts task complete'
        }));
});



gulp.task('shared', function(e) {
    var browserify = require('browserify')
    var source = require('vinyl-source-stream');
    var buffer = require('vinyl-buffer');
    var glob = require('glob')
    return browserify(glob.sync(paths.shared))
        .bundle()
        .pipe(source('shared.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({
            loadMaps: true
        }))
        .pipe(gulp.dest(paths.dist.js))
        .pipe(rename({
            suffix: '.min'
        }))
        // Add transformation tasks to the pipeline here.
        .pipe(uglify())
        .on('error', gutil.log)
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(paths.dist.js));
})


// Styles
gulp.task('styles', function() {
    return gulp.src(paths.css)
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
        .pipe(concat(paths.dist.cssDest))
        .pipe(gulp.dest(paths.dist.css))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(minifycss())
        .pipe(gulp.dest(paths.dist.css))
        .pipe(notify({
            message: 'Styles task complete'
        }))
});

gulp.task('clean:js', function() {
    var rm = require('gulp-rm')
    return gulp.src(paths.dist.js + '/*', {
            read: false
        })
        .pipe(rm())
})


gulp.task('watch', function() {
    gulp.watch(paths.shared, ['shared']);
    gulp.watch(paths.js, ['scripts']);
    gulp.watch(paths.css, ['styles']);
});

gulp.task('libs', ['vendor-js', 'vendor-css'])

gulp.task('js', ['shared', 'scripts']);

gulp.task('build', ['js', 'styles']);

gulp.task('default', ['build', 'watch']);
