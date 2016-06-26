const webpack = require('webpack');
const config = {};

function generateConfig(name, minify) {
  const settings = {
    entry: './index.js',
    output: {
      path: '/dist',
      filename: `${name}.js`,
      sourceMapFilename: `${name}.map`,
      library: 'rx-http',
      libraryTarget: 'umd'
    },
    node: {
      process: false
    },
    externals: [],
    devtool: 'source-map',
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
}

config['rx-http'] = generateConfig('rx-http', false);
config['rx-http.min'] = generateConfig('rx-http.min', true);

module.exports = config;
