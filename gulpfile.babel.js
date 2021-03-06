import gulp from 'gulp';
import notifier from 'node-notifier';
import { log, colors } from 'gulp-util';
import clean from './gulp/clean';
import sass from './gulp/sass';
import scssLint from './gulp/scss-lint';
import imagemin from './gulp/imagemin';
import fileInclude from './gulp/file-include';
import { copy, copyPreviewServer } from './gulp/copy';
import cleanCss from './gulp/clean-css';
import svgstore from './gulp/svgstore';
import template from './gulp/template';
import server from './gulp/server';
import watch from './gulp/watch';
import eslint from './gulp/eslint';

const { NODE_ENV } = process.env;

// Main
let main = gulp.series(
  clean,
  scssLint,
  sass,
  svgstore,
  gulp.parallel(copy, fileInclude),
  template,
  server,
  cb => {
    log(colors.green.bold('FINISHED GULP DEV BUILD'));

    notifier.notify({
      title: 'Gulp',
      message: 'Development build complete, launching server...'
    });

    cb();
  },
  eslint,
  watch
);

if (NODE_ENV === 'production') {
  main = gulp.series(
    clean,
    scssLint,
    sass,
    svgstore,
    imagemin,
    fileInclude,
    gulp.parallel(copy, cleanCss),
    cb => {
      log(colors.green.bold('FINISHED GULP PRODUCTION BUILD'));

      notifier.notify({
        title: 'Gulp',
        message: 'Production build complete, compiling javascript...'
      });

      cb();
    }
  );
}

// Preview server
const previewServer = gulp.series(
  template,
  copyPreviewServer,
  cb => {
    log(colors.green.bold('FINISHED COPYING FILES FOR SERVER'));

    cb();
  }
);

// Tasks
gulp.task('default', main);
gulp.task('create-server', previewServer);
