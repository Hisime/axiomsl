const gulp = require('gulp');
const plumberNotifier = require('gulp-plumber-notifier');
const rename = require('gulp-rename');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const mqpacker = require('css-mqpacker');
const cleanss = require('gulp-cleancss');
const uglify = require('gulp-uglify');
const browserSync = require('browser-sync').create();
const merge = require('merge-stream');
const imagemin = require('gulp-imagemin');
const run = require('run-sequence');
const del = require('del');
const concat = require('gulp-concat');
const svgstore = require('gulp-svgstore');
const svgmin = require('gulp-svgmin');
const path = require('path');
const sass = require('gulp-sass');
const posthtml = require("gulp-posthtml");
const include = require('posthtml-include');


// LESS compile
gulp.task('sass', function () {
  return gulp.src('src/sass/style.scss')
    .pipe(plumberNotifier())
    .pipe(sass())
    .pipe(postcss([
        autoprefixer({browsers: [
          "Android 2.3",
          "Android >= 4",
          "Chrome >= 20",
          "Firefox >= 24",
          "Explorer >= 11",
          "iOS >= 6",
          "Opera >= 11",
          "Safari >= 4"
          ]}),
        mqpacker ({
          sort: true
        })
    ]))
    .pipe(rename('style.css'))
    .pipe(gulp.dest('build/css'))
    .pipe(cleanss())
    .pipe(rename('style.min.css'))
    .pipe(gulp.dest('./build/css'))
    .pipe(browserSync.stream());
});




gulp.task('js', function() {
  return gulp.src('src/js/*.js')
    .pipe(plumberNotifier())
    .pipe(gulp.dest('build/js'))
    .pipe(browserSync.stream());
});


gulp.task('html', function() {
  return gulp.src('src/*.html')
    .pipe(plumberNotifier())
    .pipe(posthtml([
      include()
    ]))
    .pipe(gulp.dest('build/'))
    .pipe(browserSync.stream());
});

gulp.task('images', function() {
  return gulp.src('src/img/**/')
    .pipe(gulp.dest('build/img/'));
});

gulp.task('copy', function() {
  return gulp.src([
    "src/fonts/**",
    "src/img/**"
    ], {
      base: 'src'
    })
    .pipe(gulp.dest("build"));
});

gulp.task('del', function() {
  return del('build');
})

//build project
gulp.task('build', function(done){
  run(
    'del',
    'images',
    'copy',
    'sass',
    'js',
    'html',
    done
    );
});

// browserSync
gulp.task('sync', ['build'], function(){
  browserSync.init({
    server: "build",
    });
  gulp.watch('src/sass/**/*.scss', ['sass']);
  gulp.watch('src/js/**/*.js', ['js']);
  gulp.watch('src/**/*.html', ['html']);
  gulp.watch('src/img/**/**', ['images']);
  gulp.watch('src/img/sprite.svg', ['html']);
});

gulp.task("sprite", function () {
  return gulp.src("src/img/sprite/*.svg")
  .pipe(svgstore({
    inlineSvg: true
  }))
  .pipe(rename("sprite.svg"))
  .pipe(gulp.dest("src/img/"));
});



