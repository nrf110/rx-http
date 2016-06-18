import gulp from 'gulp';
import concat from 'gulp-concat';
import header from 'gulp-header';
import umd from 'gulp-umd';
import rename from 'gulp-rename';
import uglify from 'gulp-uglify';
import babel from 'gulp-babel';
import sourcemaps from 'gulp-sourcemaps';
import watch from 'gulp-watch';
import del from 'del';
import { Server } from 'karma';
import TestServer from './test-server';

const DEST = './dist'
const SRC = [
  'utilities',
  'http-events',
  'headers',
  'response',
  'request',
  'interceptors',
  'xhr-provider',
  'http'
].map(filename => `src/${filename}.js`);

gulp.task('clean', () => {
  return del.sync(DEST);
});

gulp.task('build', () => {
  return gulp.src(SRC)
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(concat('rx-http.js'))
    .pipe(babel({ presets: ['es2015'] }))
    .pipe(umd({
      exports: () => 'Http',
      namespace: () => 'RxHttp',
      dependencies: () => {
        return [
          {
            amd: 'rx',
            cjs: 'rx',
            global: 'Rx',
            param: 'Rx'
          }
        ]
      }
    }))
    // .pipe(prettify()) TODO: add prettify in here after researching settings
    .pipe(gulp.dest(DEST))
    .pipe(uglify())
    .pipe(rename({ extname: '.min.js' }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(DEST));
});

gulp.task('karma', ['build'], (done) => {
  let testServer = new TestServer();
  testServer.start();
  new Server({
    configFile: __dirname + '/karma.conf.js'
  }, () => {
    testServer.stop();
    done();
  }).start();
});

gulp.task('default', () => {
  gulp.start('clean');
  gulp.start('karma');
});

gulp.task('dev', () => {
  watch(['src/**', 'test/**'], function() {
    gulp.start('clean');
    gulp.start('karma');
  });
});
