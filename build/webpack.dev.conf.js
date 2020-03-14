var path = require('path')
var webpack = require('webpack')
var config = require('../config')
var utils = require('./utils')
var merge = require('webpack-merge')
var baseWebpackConfig = require('./webpack.base.conf')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')

if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = config.dev.env
}

var proxy = config.dev.proxyTable
var port = process.env.PORT || config.dev.port
var uri = 'http://localhost:' + port

module.exports = merge(baseWebpackConfig, {
  devtool: 'source-map',
  entry: {
    app: [
      'webpack-dev-server/client?' + uri,
      'webpack/hot/only-dev-server'
    ].concat(baseWebpackConfig.entry.app)
  },
  devServer: {
    // webpack-dev-server options
    hot: true,
    historyApiFallback: true,
    compress: true,
    open: config.dev.autoOpenBrowser,
    port: config.dev.port,
    proxy: proxy,
    before: function (app) {
      app.get('/test-dev-server', function (req, res) {
        res.send('Yeah you find it!');
      });
    },
    overlay: config.dev.errorOverlay ? {
      warnings: false,
      errors: true
    } : false,

    // webpack-dev-middleware options
    publicPath: config.dev.assetsPublicPath,
    headers: {
      "X-Custom-Header": "yes"
    },
    quiet: true, // necessary for FriendlyErrorsPlugin
    watchOptions: {
      ignored: /node_modules/,
      aggregateTimeout: 300,
      poll: 1000
    },
  },
  plugins: [
    new webpack.DllReferencePlugin({
      context: path.join(__dirname, '../static'),
      manifest: require('../static/manifest.json')
    }),
    // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    // https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      env: config.dev.env,
      favicon: config.build.icon,
      title: config.build.title,
      filename: 'index.html',
      template: 'index.ejs',
      inject: true
    }),
    new FriendlyErrorsPlugin({
      compilationSuccessInfo: {
        messages: ['Listening at ' + uri],
        notes: Object.keys(proxy).map(function (url) {
          var target = proxy[url].target.replace(/\/$/, '')
          var pathRewrite = proxy[url].pathRewrite
          if (pathRewrite) {
            Object.keys(pathRewrite).forEach(function (regex) {
              if (new RegExp(regex).test(url)) {
                target = target + pathRewrite[regex]
              }
            })
          } else {
            target = target + url
          }
          return '[HPM] Proxy created: ' + url + '  ->  ' + target
        })
      },
      onErrors: config.dev.notifyOnErrors ?
        utils.createNotifierCallback() : undefined
    })
  ]
})
