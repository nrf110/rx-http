import gulp from 'gulp';
import watch from 'gulp-watch';
import gutil from 'gulp-util';
import del from 'del';
import async from 'async';
import webpack from 'webpack';
import { Server } from 'karma';
import TestServer from './test-server';

function build(minify, eslint) {
  return (done) => {
    webpack(require('./webpack.config')(minify, eslint), (err, stats) => {
        if (err) throw new gutil.PluginError('webpack', err);
        done();
    });
  };
}

gulp.task('clean', () => {
  return del.sync('./dist');
});
gulp.task('dist', build(true));
gulp.task('build', build(false));
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
  watch(['src/**', 'test/**', 'index.js'], function() {
    gulp.start('clean');
    gulp.start('karma');
  });
});
