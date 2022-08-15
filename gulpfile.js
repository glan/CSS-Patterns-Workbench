'use strict';

var argv = require('yargs').argv,
  gulp = require('gulp'),
  connect = require('gulp-connect'),
  browserify = require('gulp-browserify'),
  less = require('gulp-less'),
  rename = require('gulp-rename'),
  uglify = require('gulp-uglify'),
  jshint = require('gulp-jshint'),
  sourcemaps = require('gulp-sourcemaps'),
  template = require('gulp-template');


// JSHint task =================================================================

gulp.task('jshint', function () {
  //var hintResults = [];
  return gulp.src(['gulpfile.js', './src/js/**/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

// Browserify (dev) task =======================================================

gulp.task('browserify-dev', function () {
  return gulp.src('./src/js/main.js', {
    read: false
  })
    .pipe(browserify({
      debug: true
    }))
    .pipe(rename('main.dev.js'))
    .pipe(gulp.dest('./dist'));
});

// Browserify (prod) task ======================================================

gulp.task('browserify-prod', function () {
  return gulp.src('./src/js/main.js', {
    read: false
  })
    .pipe(browserify())
    .pipe(uglify())
    .pipe(rename('main.min.js'))
    .pipe(gulp.dest('./dist'));
});

// LESS (dev) task =============================================================

gulp.task('less-dev', function () {
  return gulp.src('./src/styles/main.less')
    .pipe(sourcemaps.init())
    .pipe(less())
    .pipe(sourcemaps.write())
    .pipe(rename('main.dev.css'))
    .pipe(gulp.dest('./dist'));
});

// LESS (prod) task ============================================================

gulp.task('less-prod', function () {
  return gulp.src('./src/styles/main.less')
    .pipe(less())
    .pipe(rename('main.min.css'))
    .pipe(gulp.dest('./dist'));
});

// Template (dev) task (build index.html) =======================================

gulp.task('template-dev', function () {
  return gulp.src('./src/templates/index.html')
    .pipe(template({
      mode: 'dev',
      build: argv.build,
    }))
    .pipe(gulp.dest('.'));
});

// Template (prod) task (build index.html) ======================================

gulp.task('template-prod', function () {
  return gulp.src('./src/templates/index.html')
    .pipe(template({
      mode: 'min',
      build: argv.build
    }))
    .pipe(gulp.dest('.'));
});

// Connect server task =========================================================

gulp.task('connect', function () {
  connect.server({
    livereload: true
  });
});

// Watch task ==================================================================

gulp.task('watch', function () {
  gulp.watch(['./src/templates/**/*.html'], [
    'template-dev'
  ]);
  gulp.watch(['./src/**/*.js', './src/**/*.hbs'], [
    'browserify-dev'
  ]);
  gulp.watch('./src/**/*.less', ['less-dev']);
  gulp.watch(['./index.html', './dist/*.*'], ['reload']);
});

// Live reload task ============================================================

gulp.task('reload', function () {
  gulp.src('index.html')
    .pipe(connect.reload());
});

// Group tasks ==============================================================

gulp.task('dev',  gulp.series('browserify-dev', 'less-dev', 'template-dev'));
gulp.task('prod',  gulp.series('browserify-prod', 'less-prod', 'template-prod'));
gulp.task('default', gulp.series('watch', 'connect', 'dev'));
