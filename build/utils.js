var path = require('path')
var config = require('../config')
var packageConfig = require('../package.json')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var isProduction = process.env.NODE_ENV === 'production'
var sourceMapEnabled = isProduction ?
  config.build.productionSourceMap :
  config.dev.cssSourceMap

exports.assetsPath = function (_path) {
  var assetsSubDirectory = process.env.NODE_ENV === 'production' ?
    config.build.assetsSubDirectory :
    config.dev.assetsSubDirectory
  return path.posix.join(assetsSubDirectory, _path)
}

exports.createNotifierCallback = function () {
  var notifier = require('node-notifier')

  return function (severity, errors) {
    if (severity !== 'error') return

    var error = errors[0]
    var filename = error.file && error.file.split('!').pop()

    notifier.notify({
      title: packageConfig.name,
      message: severity + ': ' + error.name,
      subtitle: filename || '',
      icon: config.build.icon
    })
  }
}

exports.generateCSSLoaders = function (loader, loaderOptions) {
  var loaders = [{
    loader: 'css-loader',
    options: {
      sourceMap: sourceMapEnabled
    }
  }, {
    loader: 'postcss-loader',
    options: {
      sourceMap: sourceMapEnabled
    }
  }]

  if (loader) {
    loaders.push({
      loader: loader + '-loader',
      options: Object.assign({}, loaderOptions, {
        sourceMap: sourceMapEnabled
      })
    })
  }

  // dev 下使用 ExtractTextPlugin 会使 css 无法热更新
  // 因此在 dev 环境下不使用 ExtractTextPlugin
  if (isProduction) {
    return config.build.extractCSS ?
      ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: loaders
      }) :
      loaders
  } else {
    return ['style-loader'].concat(loaders)
  }
}

exports.getThemeConfig = function () {
  var theme = {};
  if (packageConfig.theme && typeof (packageConfig.theme) === 'string') {
    var cfgPath = packageConfig.theme;
    // relative path
    if (cfgPath.charAt(0) === '.') {
      cfgPath = path.resolve(cfgPath);
    }
    theme = require(cfgPath);
  } else if (packageConfig.theme && typeof (packageConfig.theme) === 'object') {
    theme = packageConfig.theme;
  }

  return theme;
}
