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
        "js-cookie": {
          root: 'Cookies',
          commonjs2: ['js-cookie'],
          commonjs: 'js-cookie',
          amd: 'js-cookie'
        }
      },
      {
        "lodash": {
          root: '_',
          commonjs2: ['lodash'],
          commonjs: 'lodash',
          amd: 'lodash'
        }
      },
      {
        "rx": {
          root: 'Rx',
          commonjs2: ['rx'],
          commonjs: 'rx',
          amd: 'rx'
        }
      }
    ],
    devtool: 'source-map',
    module: {
      loaders: [
        {
          test: /\.json$/,
          loader: 'json-loader'
        },
        {
          test: /\.js$/,
          exclude: [
            path.resolve('./node_modules/')
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
