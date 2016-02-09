var gulp = require("gulp");

var eslint = require("gulp-eslint");

var mocha = require("gulp-mocha");

var istanbul = require("gulp-istanbul");
var isparta = require("isparta");

var src = ["src/**/*.js"];
var tests = "test/**/*.js";


gulp.task("coverage", function() {
    return gulp.src(src)
        .pipe(istanbul({
            instrumenter: isparta.Instrumenter
        }))
        .pipe(istanbul.hookRequire());
});

gulp.task("mocha", function() {
    return gulp.src(tests)
        .pipe(mocha())
        .pipe(istanbul.writeReports())
        .pipe(istanbul.enforceThresholds({
            thresholds: {
                global: 90
            }
        })).once("error", function() {

        });
});

gulp.task("eslint", function() {
    return gulp.src(["generators/**/*.js", "gulpfile.js"])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

gulp.task("test", ["eslint", "coverage", "mocha"]);

gulp.task("default", ["test"], function() {
    gulp.watch([src, tests], ["test"]);
});
