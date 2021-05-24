const gulp = require("gulp");
const plumber = require("gulp-plumber");
const sourcemap = require("gulp-sourcemaps");
const less = require("gulp-less");
const postcss = require("gulp-postcss");
const rename = require("gulp-rename");
const htmlmin = require("gulp-htmlmin");
const autoprefixer = require("autoprefixer");
const csso = require("postcss-csso");
const del = require("del");
const sync = require("browser-sync").create();

// Styles

const styles = () => {
  return gulp.src("source/less/style.less")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(less())
    .pipe(postcss([
      autoprefixer(),
      csso()
    ]))
    .pipe(rename("style.min.css"))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("build/css"))
    .pipe(sync.stream());
}

exports.styles = styles;

// HTML

const html = () => {
  return gulp.src("source/*.html")
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest("build"));
}

exports.html = html;

// Scripts

const scripts = () => {
  return gulp.src("source/js/script.js")
    .pipe(terser())
    .pipe(rename("script.min.js"))
    .pipe(gulp.dest("build/js"))
    .pipe(sync.stream());
}

// Copy

// const copy = (done) => {
//   gulp.src([
//     "source/fonts/*.{woff2,woff}",
//     "source/img/fvicon/*.ico",
//     "source/img/**/*.svg",
//     "!source/img/icons/*.svg",
//   ], {
//     base: "source"
//   })
//     .pipe(gulp.dest("build"))
//   done();
// }

// exports.copy = copy;

// Clean

const clean = () => {
  return del("build");
};


exports.sprite = sprite;

// Server

const server = (done) => {
  sync.init({
    server: {
      baseDir: 'build'
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

exports.server = server;

// Reload

const reload = (done) => {
  sync.reload();
  done();
}


// Watcher

const watcher = () => {
  gulp.watch("source/less/**/*.less", gulp.series("styles"));
  gulp.watch("source/js/script.js", gulp.series(scripts));
  gulp.watch("source/*.html").on("change", sync.reload);
}

exports.default = gulp.series(
  styles, server, watcher
);

// Build

// const build = gulp.series(styles);

const build = gulp.series(
  clean,
  copy,
  gulp.parallel(
    styles,
    html,
    scripts
  ),
);

exports.build = build;
