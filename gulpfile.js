/**
 * A simple Gulp 4 Starter Kit for modern web development.
 *
 * @package @jr-cologne/create-gulp-starter-kit
 * @author JR Cologne <kontakt@jr-cologne.de>
 * @copyright 2020 JR Cologne
 * @license https://github.com/jr-cologne/gulp-starter-kit/blob/master/LICENSE MIT
 * @version v0.11.0-beta
 * @link https://github.com/jr-cologne/gulp-starter-kit GitHub Repository
 * @link https://www.npmjs.com/package/@jr-cologne/create-gulp-starter-kit npm package site
 *
 * ________________________________________________________________________________
 *
 * gulpfile.js
 *
 * The gulp configuration file.
 *
 */

 const gulp = require('gulp'),
 del = require('del'),
 sourcemaps = require('gulp-sourcemaps'),
 plumber = require('gulp-plumber'),
 sass = require('gulp-sass')(require('sass'));
 autoprefixer = require('gulp-autoprefixer'),
 minifyCss = require('gulp-clean-css'),
 babel = require('gulp-babel'),
 // imagemin                  = require('gulp-imagemin'),
 browserSync = require('browser-sync').create(),
 dependents = require('gulp-dependents'),
 replace = require('gulp-replace'),
 browserify = require('browserify'),
 babelify = require('babelify'),
 source = require('vinyl-source-stream'),
 buffer = require('vinyl-buffer'),
 SMS_ID = '51336';
(src_folder = './src/'),
(src_assets_folder = src_folder + 'working_files/'),
(dist_folder = './dist/'),
(dist_assets_folder = dist_folder + SMS_ID + '/'),
(node_modules_folder = './node_modules/'),
(dist_node_modules_folder = dist_folder + 'node_modules/'),
(node_dependencies = Object.keys(require('./package.json').dependencies || {}));

gulp.task('clear', () => del([dist_folder]));

gulp.task('sass', () => {
 return gulp
   .src([src_assets_folder + 'CSS_V3/storefront/overlay_banner.sass'], {
     since: gulp.lastRun('sass'),
   })
   .pipe(sourcemaps.init())
   .pipe(plumber())
   .pipe(dependents())
   .pipe(sass())
   .pipe(autoprefixer())
   .pipe(minifyCss())
   .pipe(sourcemaps.write('.'))
   .pipe(gulp.dest(dist_assets_folder + 'CSS_V3/storefront/'))
   .pipe(browserSync.stream());
});

gulp.task('js', () => {
 return browserify({
     entries: [src_assets_folder + 'JS_V3/storefront/overlay_banner.js'],
     transform: [babelify],
   })
   .bundle()
   .pipe(source('overlay_banner.js'))
   .pipe(sourcemaps.write('.'))
   .pipe(buffer())
   .pipe(gulp.dest(dist_assets_folder + 'JS_V3/storefront/'));
});

gulp.task('img', () => {
 return gulp.src([src_assets_folder + 'IMG_V4/**/*.*']).pipe(gulp.dest(dist_assets_folder + 'IMG_V4/'));
});

gulp.task('copy_template', () => {
 return gulp
   .src([src_folder + 'static/**/*.*'])
   .pipe(replace('<%SMT:SMS_ID%>', SMS_ID))
   .pipe(gulp.dest(dist_folder));
});

gulp.task('deploy', () => {
 return gulp.src([dist_assets_folder + '**/*.*']).pipe(gulp.dest('M:\\' + SMS_ID + '\\'));
});

gulp.task('build', gulp.series('clear', 'copy_template', 'sass', 'js', 'img'));

gulp.task('dev', gulp.series('copy_template', 'sass', 'js', 'img'));

gulp.task('serve', () => {
 return browserSync.init({
   server: {
     baseDir: ['dist'],
   },
   port: 3000,
   open: false,
 });
});

gulp.task('watch', () => {
 // const watchImages = [
 //   src_assets_folder + 'images/**/*.+(png|jpg|jpeg|gif|svg|ico)'
 // ];

 const watchJs = [src_assets_folder + '**/*.js'];

 const watchSass = [src_assets_folder + '**/*.sass'];

 const watchVendor = [];

 node_dependencies.forEach((dependency) => {
   watchVendor.push(node_modules_folder + dependency + '/**/*.*');
 });

 const watch = [src_folder + '**/*.html', src_folder + 'pug/**/*.pug', src_assets_folder + '**/*.sass', src_assets_folder + '**/*.scss', src_assets_folder + 'less/**/*.less', src_assets_folder + 'stylus/**/*.styl', src_assets_folder + '**/*.js'];

 gulp.watch(watchJs, gulp.series('js')).on('change', browserSync.reload);
 gulp.watch(watchSass, gulp.series('sass')).on('change', browserSync.reload);
 // gulp.watch(watchImages, gulp.series('images')).on('change', browserSync.reload);
 // gulp.watch(watchVendor, gulp.series('vendor')).on('change', browserSync.reload);
});

gulp.task('default', gulp.series('build', gulp.parallel('serve', 'watch')));
gulp.task(
 'deploy:7a',
 gulp.series('deploy', (done) => {
   console.log('Deploy successfully, please upload files from SMS.');
   console.log('SMS location: https://desys2/SiteManagement/task_details.php?tid=' + SMS_ID);
   done();
 })
);
