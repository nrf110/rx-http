import path from 'path';

module.exports = function(config) {
  config.set({
    exclude: [],
    browsers: ['PhantomJS'],
    browserDisconnectTimeout: 10000,
    browserDisconnectTolerance: 2,
    concurrency: 1,
    captureTimeout: 100000,
    browserNoActivityTimeout: 30000,
    colors: true,
    autowatch: false,
    singleRun: true,
    frameworks: [
      'sinon-chai',
      'sinon',
      'chai-as-promised',
      'chai',
      'mocha'
    ],
    preprocessors: {
      'test/tests.js': ['webpack']
    },
    files: [
      'test/tests.js'
    ],
    webpack: {
      cache: true,
      debug: true,
      hot: false,
      output: {},
      entry: {},
      module: {
        loaders: [
    			{
    				test: /sinon\.js/,
    				loader: 'imports?define=>false,require=>false'
    			},
          {
            test: /\.js?$/,
            exclude: [
              path.resolve('node_modules/')
            ],
            loader: 'babel-loader'
          }
        ]
      },
      resolve: {
        extensions: ['', '.js']
      }
    },
    webpackMiddleware: {
      noInfo: true
    }
  })
}
