import path from 'path';

module.exports = function(config) {
  config.set({
    exclude: [],
    browsers: ['Electron'],
    browserDisconnectTimeout: 10000,
    browserDisconnectTolerance: 2,
    concurrency: 1,
    captureTimeout: 100000,
    browserNoActivityTimeout: 30000,
    colors: true,
    autowatch: false,
    singleRun: true,
    frameworks: [
      'mocha',
      'chai',
      'sinon'
    ],
    preprocessors: {
      './test/*.spec.js': ['webpack']
    },
    files: [
      './test/*.spec.js'
    ],
    webpack: {
      module: {
        rules: [
          {
            test: /(\.jsx|\.js)$/,
            loader: 'babel-loader',
            exclude: /(node_modules|bower_components)/
          }
        ]
      },
      resolve: {
        modules: [path.resolve('./src'), './node_modules'],
        extensions: ['.js']
      }
    },
    webpackMiddleware: {
      noInfo: true
    }
  })
}
