var gulp = require('gulp');
var args = require('yargs').argv;
var config = require('./gulp.config')();


var jshint = require('gulp-jshint');
var jscs = require('gulp-jshint');
var util = require('gulp-util');
var gulpPrint = require('gulp-print');
var gulpif = require('gulp-if');
var gulpInject = require('gulp-inject');

gulp.task('vet', function() {
    log('Analyzing with jshint and jscs');
    return gulp
        .src(config.alljs)
        .pipe(gulpif(args.v, gulpPrint()))
        .pipe(jscs())
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish', { verbose: true }))
        .pipe(jshint.reporter('fail'));

});

gulp.task('wiredep', function() {
    var options = config.getWiredepDefaultOptions();
    var wiredep = require('wiredep');
    return gulp
        .src(config.index)
        .pipe(wiredep(options))
        .pipe(gulpInject(gulp.src(config.js)))
        .pipe(gulp.dest(config.client));

});



function log(msg) {
    util.log(util.colors.blue(msg));
}

