const webpack = require('webpack');
const UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
const path = require('path');
const env  = require('yargs').argv.env; // use --env with webpack 2

module.exports = function(minify = false) {
  let libraryName = 'rx-http';
  let plugins = [], outputFile;

  if (minify) {
    plugins.push(new UglifyJsPlugin({ minimize: true }));
    outputFile = libraryName + '.min.js';
  } else {
    outputFile = libraryName + '.js';
  }

  return {
    entry: __dirname + '/src/index.js',
    devtool: 'source-map',
    output: {
      path: __dirname + '/lib',
      filename: outputFile,
      library: libraryName,
      libraryTarget: 'umd',
      umdNamedDefine: true
    },
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
        "rxjs": {
          root: 'Rx',
          commonjs2: ['rxjs'],
          commonjs: 'rxjs',
          amd: 'rxjs'
        }
      }
    ],
    plugins: plugins
  };
};
