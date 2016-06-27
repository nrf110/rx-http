import gulp from 'gulp';
import watch from 'gulp-watch';
import gutil from 'gulp-util';
import del from 'del';
import async from 'async';
import webpack from 'webpack';
import { Server } from 'karma';
import TestServer from './test-server';

gulp.task('clean', () => {
  return del.sync(DEST);
});

gulp.task('build', (done) => {
  async.map(require('./webpack.config'), webpack, (err, stats) => {
    if (err) throw new gutil.PluginError('webpack', err);
    done();
  });
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
