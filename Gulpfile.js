/*!
 * fixparser
 * https://github.com/logotype/fixparser.git
 *
 * Copyright 2015 Victor Norgren
 * Released under the MIT license
 */
var gulp = require('gulp'),
    $ = require('gulp-load-plugins')(),
    del = require('del'),
    browserify = require("browserify"),
    babelify = require("babelify"),
    source = require('vinyl-source-stream');

gulp.task('eslint', function () {
    return gulp.src(['./src/**/*.js'])
        .pipe($.eslint())
        .pipe($.eslint.format())
        .pipe($.eslint.failOnError());
});

gulp.task('clean', ['eslint'], function(done) {
    del(['build/**']).then(function () {
        done();
    });

});

gulp.task('transpile', ['clean'], function() {
    return browserify("./src/FIXParser.js", { debug: true })
        .transform(babelify)
        .bundle()
        .on("error", function (err) { console.log("Error : " + err.message); })
        .pipe(source('FIXParser.js'))
        .pipe(gulp.dest('./build'));
});

gulp.task('perf', function () {
    return gulp.src(['./perf/**/*.js'])
        .pipe($.babel())
        .pipe($.uglify())
        .pipe(gulp.dest('./perfbuild'));
});

gulp.task('test', ['transpile'], function () {
    return gulp.src('./test/**/*.js', {read: false})
        .pipe($.mocha({
            recursive: true,
            compilers: require('babel/register'),
            reporter: 'spec'
        }));
});

gulp.task('default', ['eslint', 'transpile', 'test']);