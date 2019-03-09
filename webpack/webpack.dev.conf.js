const Path = require('path');
const Webpack = require('webpack');
const merge = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base.conf');
const Dotenv = require('dotenv-webpack');

module.exports = merge(baseWebpackConfig, {
  mode: 'development',
  devtool: 'cheap-eval-source-map',
  output: {
    chunkFilename: 'js/[name].chunk.js'
  },
  devServer: {
    inline: true,
    host: '0.0.0.0',
    port: 8888,
    overlay: {
      warnings: false,
      errors: true
    },
    //disableHostCheck: true
  },
  plugins: [
    new Webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development')
    }),
    new Dotenv({path: Path.resolve(__dirname, '../.env')})
  ],
  module: {
    rules: [
      {
        test: /\.(js|vue)$/,
        include: Path.resolve(__dirname, '../src'),
        enforce: 'pre',
        loader: 'eslint-loader',
        options: {
          emitWarning: true,
        }
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.(js)$/,
        include: Path.resolve(__dirname, '../src'),
        loader: 'babel-loader'
      },
      {
        test: /\.s?css$/i,
        use: [
          'style-loader?sourceMap=true',
          'css-loader?sourceMap=true',
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              plugins: [
                require('autoprefixer')(
                  {
                    'browsers': ['>0.2%', 'last 2 versions', 'not dead', 'ie 10', 'ie 11']
                  }
                )
              ]
            }
          },
          'sass-loader?sourceMap=true'
        ]
      }
    ]
  }
});
