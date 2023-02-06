// Importações
const gulp = require('gulp');
const sass  = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync').create();
const concat = require('gulp-concat');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');

//Compilando o sass, adicionando autoprefixed e dando refresh na página

function compilaSass() {
    return gulp.src('scss/*.scss')
    .pipe(sass())
    .pipe(autoprefixer({
        overrideBrowserslist: ['last 2 versions'],
        cascade: false,
    }))
    .pipe(gulp.dest('css/'))
    .pipe(browserSync.stream());
}
//tarefa sass
gulp.task('sass', compilaSass);

//Função para os plugins de CSS
function pluginsCSS() {
   return gulp.src('css/lib/*.css')
   .pipe(concat('plugins.css'))
   .pipe(gulp.dest('css/'))
   .pipe(browserSync.stream())
}
//tarefa plugin css
gulp.task('plugincss', pluginsCSS);

//Função concat
function gulpJs() {
    return gulp.src('js/scripts/*.js')
    .pipe(concat('all.js'))
    .pipe(babel({
        presets: ['@babel/env']
    }))
    .pipe(uglify())
    .pipe(gulp.dest('js/'))
    .pipe(browserSync.stream());
}
//tarefa concat
gulp.task('alljs', gulpJs);

//Função para ativar as libs
function pluginsJs() {
    return gulp
    .src(['./js/lib/aos.min.js', './js/lib/swiper.min.js'])
    .pipe(concat('plugins.js'))
    .pipe(gulp.dest('js/'))
    .pipe(browserSync.stream())
}
//tarefa libs
gulp.task('pluginjs', pluginsJs);

//tarefa do sass
gulp.task('default', compilaSass);

//Função do Browser sync

function browser() {
   browserSync.init({
    server: {
      baseDir: './'
    }
   })
}

//Tarefa do Browser sync

gulp.task('browser-sync', browser);

//Função do Watch para alteração do sass e html

function watch() {
    gulp.watch('scss/*.scss', compilaSass);
    gulp.watch('css/lib/*.css', pluginsCSS);
    gulp.watch('*.html').on('change', browserSync.reload);
    gulp.watch('js/scripts/*js', gulpJs);
    gulp.watch('js/lib/*.js', pluginsJs);
}

//Tarefa watch

gulp.task('watch',watch);

//Tarefa par executar em pararelo o watch e browser sync

gulp.task('default', gulp.parallel('watch', 'browser-sync', 'sass', 'plugincss', 'alljs', 'pluginjs'));