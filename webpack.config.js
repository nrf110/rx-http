const webpack = require('webpack');
const path = require('path');

function generateConfig(name, minify) {
  const settings = {
    entry: './index.js',
    output: {
      path: 'dist/',
      filename: `${name}.js`,
      sourceMapFilename: `${name}.map`,
      library: 'rx-http',
      libraryTarget: 'umd'
    },
    node: {
      process: false
    },
    externals: [
      {
        root: 'Cookies',
        commonjs: 'js-cookie',
        amd: 'js-cookie'
      },
      {
        root: '_',
        commonjs: 'lodash',
        amd: 'lodash'
      },
      {
        root: 'Rx',
        commonjs: 'rx',
        amd: 'rx'
      }
    ],
    devtool: 'source-map',
    module: {
      loaders: [
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
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
      })
    ]
  };

  if (minify) {
    settings.plugins.push(
      new webpack.optimize.UglifyJsPlugin({
        compressor: {
          warnings: false
        }
      })
    )
  }

  return settings;
}

module.exports = [
  generateConfig('rx-http', false),
  generateConfig('rx-http.min', true)
];
