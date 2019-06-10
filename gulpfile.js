"use strict";

var gulp = require("gulp");
var plumber = require("gulp-plumber");
var postcss = require("gulp-postcss");

var autoprefixer = require("autoprefixer");



gulp.task("css", function() {
    console.log("Запускаю команду style");
    gulp.src("less/style.less")
        .pipe(plumber())
        .pipe(postcss([
            autoprefixer()
        ]))
        .pipe(gulp.dest("css"))
});